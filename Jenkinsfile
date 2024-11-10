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
  }
}
