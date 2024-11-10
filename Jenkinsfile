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
    stage('Docker Login') {
      steps {
        script {
          withCredentials([usernamePassword(credentialsId: 'DOCKER_HUB', usernameVariable: 'DOCKER_HUB_USER', passwordVariable: 'DOCKER_HUB_PASSWORD')]) {
              sh "docker login -u ${DOCKER_HUB_USER} -p ${DOCKER_HUB_PASSWORD}"
          }
        }
      }
    }
    stage('Docker build') {
      steps {
        sh 'docker build --no-cache -t gabreel05/acme-application:latest .'
      }
    }
    stage('Docker push') {
      steps {
        sh 'docker push gabreel05/acme-application:latest'
      }
    }
  }
}
