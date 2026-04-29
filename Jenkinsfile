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
                        python3 -m pip install --upgrade pip
                        python3 -m pip install -r requirements.txt

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
    }
}