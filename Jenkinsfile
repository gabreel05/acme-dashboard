pipeline {
  agent any

  tools {nodejs "NodeJS 18.20.4"}

  environment {
      SNYK_TOKEN=credentials('SNYK_TOKEN')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Kubernetes - Delete') {
      steps {
        script {
          withCredentials([file(credentialsId: 'KUBE_CONFIG', variable: 'KUBE_CONFIG')]) {
            dir('k8s') {
              sh 'kubectl delete -n default deployment application --ignore-not-found=true'
              sh 'kubectl delete -n default service application --ignore-not-found=true'
              sh 'kubectl delete -n default secret application-secrets --ignore-not-found=true'
              sh 'kubectl delete -n default statefulset database --ignore-not-found=true'
              sh 'kubectl delete -n default persistentvolumeclaim --all --ignore-not-found=true'
              sh 'kubectl delete -n default persistentvolume database-pv --ignore-not-found=true'
              sh 'kubectl delete -n default service database-service --ignore-not-found=true'
              sh 'kubectl delete -n default secret database-secrets --ignore-not-found=true'
            }
          }
        }
      }
    }
    stage('Kubernetes - Database') {
      steps {
        script {
          withCredentials([file(credentialsId: 'KUBE_CONFIG', variable: 'KUBE_CONFIG')]) {
            dir('k8s') {
              sh 'kubectl apply -f database-secrets.yaml'
              sh 'kubectl apply -f database-pv.yaml'
              sh 'kubectl apply -f database-ss.yaml'
              sh 'kubectl apply -f database-service.yaml'
            }
          }
        }
      }
    }
    stage('Kubernetes - Application') {
      steps {
        script {
          withCredentials([file(credentialsId: 'KUBE_CONFIG', variable: 'KUBE_CONFIG')]) {
            dir('k8s') {
              sh 'kubectl apply -f application-secrets.yaml'
              sh 'kubectl apply -f application-deployment.yaml'
              sh 'kubectl apply -f application-service.yaml'
            }
          }
        }
      }
    }
  }
}
