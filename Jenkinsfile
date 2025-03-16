pipeline {
    agent any
    
    stages {
        stage('Clone Repository') {
            steps {
                checkout([$class: 'GitSCM', userRemoteConfigs: [[url: 'https://github.com/saiyedsahilhussain/Project1_Devops.git']]])
            }
        }
    }
}
