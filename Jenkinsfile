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
                        echo "Installing backend dependencies..."
                        python3 --version || true
                        python3 -m venv venv
                        . venv/bin/activate
                        python -m pip install --upgrade pip
                        pip install -r requirements.txt

                        echo "Running tests / checks..."
                        python -m compileall .
                    '''
                }
            }
        }

        stage('Frontend - Next.js') {
            agent any
            steps {
                dir('frontend') {
                    sh '''
                        npm install
                        npm run build
                    '''
                }
            }
        }
        stage('Backend Docker Build') {
            steps {
                dir('backend') {
                    sh '''
                        pwd
                        ls -la
                        ls -la backend || true
                        ls -la frontend || true
                        docker build -t flask-backend ./backend
                    '''
                }
            }
        }
        stage('Frontend Docker Build') {
            steps {
                    dir('frontend') {
                        sh '''
                            docker build -t nextjs-frontend ./frontend
                        '''
                    }
                }
            }
    }
}