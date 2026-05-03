pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'engyoustina'
        BACKEND_IMAGE = 'engyoustina/flask-backend'
        FRONTEND_IMAGE = 'engyoustina/nextjs-frontend'
        TAG = 'latest'
    }

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
                        apt-get update && apt-get install -y python3-venv
                        python3 -m venv venv || true
                        . venv/bin/activate
                        python -m pip install --upgrade pip || true
                        pip install -r requirements.txt || true
                        python -m compileall .
                    '''
                }
            }
        }

        stage('Frontend - Next.js') {
            steps {
                dir('frontend') {
                    sh '''
                        npm install
                        npm run build
                    '''
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh '''
                    docker build -t $BACKEND_IMAGE:$TAG backend
                    docker build -t $FRONTEND_IMAGE:$TAG frontend
                '''
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                }
            }
        }

        stage('Push Images') {
            steps {
                sh '''
                    docker push $BACKEND_IMAGE:$TAG
                    docker push $FRONTEND_IMAGE:$TAG
                '''
            }
        }
    }
}