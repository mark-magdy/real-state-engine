pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend - Flask Install') {
            steps {
                dir('backend') {
                    sh '''
                        echo "Installing backend dependencies..."
                        python -m venv venv
                        . venv/bin/activate
                        pip install -r requirements.txt
                    '''
                }
            }
        }

        stage('Backend - Test') {
            steps {
                dir('backend') {
                    sh '''
                        echo "Running backend checks..."
                        python -m compileall .
                    '''
                }
            }
        }

        stage('Frontend - Install') {
            steps {
                dir('frontend') {
                    sh '''
                        echo "Installing frontend dependencies..."
                        npm install
                    '''
                }
            }
        }

        stage('Frontend - Build') {
            steps {
                dir('frontend') {
                    sh '''
                        echo "Building Next.js app..."
                        npm run build
                    '''
                }
            }
        }
    }
}