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
              sh('docker login -u $DOCKER_HUB_USER -p $DOCKER_HUB_PASSWORD')
          }
        }
      }
    }
    stage('Docker build - Application') {
      steps {
        sh 'docker build --no-cache -t gabreel05/acme-application:latest .'
      }
    }
    stage('Docker push - Application') {
      steps {
        sh 'docker push gabreel05/acme-application:latest'
      }
    }
    stage('Docker build - Database') {
      steps {
        dir('database') {
          sh 'docker build --no-cache -t gabreel05/acme-database:latest .'
        }
      }
    }
    stage('Docker push - Database') {
      steps {
        dir('database') {
          sh 'docker push gabreel05/acme-database:latest'
        }
      }
    }
    stage('Kubernetes - Delete') {
      steps {
        script {
          withCredentials([file(credentialsId: 'KUBE_CONFIG', variable: 'KUBE_CONFIG')]) {
            dir('k8s') {
              sh 'microk8s kubectl delete -n default statefulset database --ignore-not-found=true'
              sh 'microk8s kubectl delete -n default persistentvolume database-pv --ignore-not-found=true'
              sh 'microk8s kubectl delete -n default persistentvolumeclaim --all --ignore-not-found=true'
              sh 'microk8s kubectl delete -n default service database-service --ignore-not-found=true'
              sh 'microk8s kubectl delete -n default secret database-secrets --ignore-not-found=true'
              sh 'microk8s kubectl delete -n default secret application-deployment --ignore-not-found=true'
              sh 'microk8s kubectl delete -n default secret application-service --ignore-not-found=true'
              sh 'microk8s kubectl delete -n default secret application-secrets --ignore-not-found=true'
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
              sh 'microk8s kubectl apply -f database-pv.yaml'
              sh 'microk8s kubectl apply -f database-secrets.yaml'
              sh 'microk8s kubectl apply -f database-ss.yaml'
              sh 'microk8s kubectl apply -f database-service.yaml'
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
              sh 'microk8s kubectl apply -f application-secrets.yaml'
              sh 'microk8s kubectl apply -f application-deployment.yaml'
              sh 'microk8s kubectl apply -f application-service.yaml'
            }
          }
        }
      }
    }
  }
}
