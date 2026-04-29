pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend - Flask') {
            steps {
                dir('backend') {
                    sh '''
                        echo "Running backend manually in host Jenkins"
                        docker --version
                    '''
                }
            }
        }

        stage('Frontend - Next.js') {
            agent any
            steps {
                dir('frontend') {
                    sh '''
                        echo "Running frontend manually in host Jenkins"
                        node --version
                    '''
                }
            }
        }
    }
}