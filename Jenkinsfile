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
    stage('Kubernetes') {
      steps {
        script {
          withCredentials([file(credentialsId: 'KUBE_CONFIG', variable: 'KUBE_CONFIG')]) {
            dir('k8s') {
              sh 'microk8s kubectl delete -n default deployment application --ignore-not-found=true'
              sh 'microk8s kubectl delete -n default service application --ignore-not-found=true'
              sh 'microk8s kubectl delete -n default secret application-secrets --ignore-not-found=true'
              sh 'microk8s kubectl delete -n default statefulset database --ignore-not-found=true'
              sh 'microk8s kubectl delete -n default persistentvolumeclaim --all --ignore-not-found=true'
              sh 'microk8s kubectl delete -n default persistentvolume database-pv --ignore-not-found=true'
              sh 'microk8s kubectl delete -n default service database-service --ignore-not-found=true'
              sh 'microk8s kubectl delete -n default secret database-secrets --ignore-not-found=true'
            }
          }
        }
      }
    }
  }
}
