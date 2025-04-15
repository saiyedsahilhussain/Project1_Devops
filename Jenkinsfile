pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: '', credentialsId: 'git-cred'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Run Test') {
            steps {
                sh 'npm test'
            }
        }
        stage('Build') {
            steps {
                   sh 'npm run build'
                }
            }
        stage("Build Docker Image") {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-cred', usernameVariable: 'DOCKERHUB_USERNAME', passwordVariable: 'DOCKERHUB_PASSWORD')]) {
                    sh "echo $DOCKERHUB_PASSWORD | docker login -u $DOCKERHUB_USERNAME --password-stdin"
                    sh 'docker build -t pizzaimage1.0 .'  // Removed sudo
                }
            }
        }
        stage("Push Image To DockerHub") {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-cred', passwordVariable: 'DOCKERHUB_PASSWORD', usernameVariable: 'DOCKERHUB_USERNAME')]) {
                    sh 'docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_PASSWORD'  // Removed sudo
                    sh 'docker tag pizzaimage1.0 sahilhussain12/pizzaimage1.0'
                    sh 'docker push sahilhussain12/pizzaimage1.0'
                    sh 'docker logout'
                }
            }
        }
    }
}
