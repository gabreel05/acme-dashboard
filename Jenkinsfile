pipeline {
  agent any

  tools {nodejs "NodeJS 18.20.4"}

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
    }
  }
}
