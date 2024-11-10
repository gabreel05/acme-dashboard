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
              sh 'microk8s kubectl delete -n default deployment application'
              sh 'microk8s kubectl delete -n default service application'
              sh 'microk8s kubectl delete -n default secret application-secrets'
              sh 'microk8s kubectl delete -n default statefulset database'
              sh 'microk8s kubectl delete -n default service database-service'
              sh 'microk8s kubectl delete -n default secret database-secrets'
            }
          }
        }
      }
    }
  }
}
