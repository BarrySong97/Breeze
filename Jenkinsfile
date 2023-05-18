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
                sh 'docker run -v /home/lighthouse/nginx/site/breeze:/app/dist --name breeze-front breeze-front'
            }
        }
    }
}
