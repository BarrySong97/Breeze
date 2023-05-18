pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('build') {
            steps {
                sh 'docker build -t breeze-front .'
            }
        }
        stage('deploy') {
            steps {
                sh 'docker run --name breeze-front breeze-front'
                sh 'docker cp breeze-front:/app/dist /var/jenkins_home/site/breeze-front'
                sh 'docker rm -f breeze-front'
            }
        }
    }
}
