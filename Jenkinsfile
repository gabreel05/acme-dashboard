pipeline {
  agent any

  tools {nodejs "NodeJS 18.20.4"}

  environment {
      SNYK_TOKEN= credentials('SNYK_TOKEN')
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build') {
      steps {
        sh 'npm install'
      }
    }

    stage('SCA') {
      steps {
        sh 'snyk auth --auth-type=token $SNYK_TOKEN'
        sh 'snyk test'
      }
      post {
        success {
            echo 'Snyk SCA analysis completed successfully.'
        }
        failure {
            error 'Snyk SCA failed, stopping the build.'
        }
      }
    }

    stage('SAST') {
      steps {
        sh 'snyk auth --auth-type=token $SNYK_TOKEN'
        sh 'snyk code test -d'
      }
      post {
        success {
            echo 'Snyk SAST analysis completed successfully.'
        }
        failure {
            error 'Snyk SAST failed, stopping the build.'
        }
      }
    }
    stage('Docker build') {
      steps {
        sh 'docker build --no-cache -t gabreel05/acme-application:latest .'
        sh 'docker push gabreel05/acme-application:latest'
      }
    }
  }
}
