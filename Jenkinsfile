pipeline {
    agent none

    stages {

        stage('Checkout') {
            agent any
            steps {
                checkout scm
            }
        }

        stage('Backend - Flask') {
            agent {
                dockerContainer {
                    image 'python:3.9-slim'
                }
            }
            steps {
                dir('backend') {
                    sh '''
                        pip install -r requirements.txt
                        python -m compileall .
                    '''
                }
            }
        }

        stage('Frontend - Next.js') {
            agent {
                dockerContainer {
                    image 'node:18'
                }
            }
            steps {
                dir('frontend') {
                    sh '''
                        npm install
                        npm run build
                    '''
                }
            }
        }
    }
}