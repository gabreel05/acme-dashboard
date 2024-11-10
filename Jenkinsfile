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
          withCredentials([file(credentialsId: 'KUBE_CONFIG', variable: 'config')]) {
            dir('k8s') {
              sh 'microk8s status --wait-ready'
            }
          }
        }
      }
    }
  }
}
