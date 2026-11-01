// ===================================================================
// Declarative Jenkins Pipeline as Code
// Project: GRID — The Command Center for Hackathons
// CI/CD Lifecycle: Checkout -> Env Verify -> Backend Build -> Backend Tests ->
//                  Frontend Build -> Frontend Test -> Docker Build ->
//                  Image Validation -> Deploy -> Health Verification -> Post Actions
// Windows & Linux Native Dual-Engine Compatibility
// ===================================================================

pipeline {
    agent any

    parameters {
        choice(
            name: 'DEPLOY_ENV',
            choices: ['development', 'staging', 'production'],
            description: 'Target Deployment Environment'
        )
        string(
            name: 'RELEASE_VERSION',
            defaultValue: '1.0.0',
            description: 'Semantic Version Tag for Release'
        )
        string(
            name: 'APP_HOST_PORT',
            defaultValue: '8081',
            description: 'Host Port for Nginx Entry Point'
        )
        booleanParam(
            name: 'RUN_SELENIUM_TESTS',
            defaultValue: false,
            description: 'Execute Automated Browser User Journeys'
        )
    }

    environment {
        RELEASE_VERSION = "${params.RELEASE_VERSION}"
        DOCKER_TAG = "${params.RELEASE_VERSION}-${BUILD_NUMBER}"
        APP_HOST_PORT = "${params.APP_HOST_PORT}"
        HEADLESS = 'true'
        // Windows Service PATH integration for Docker Desktop binaries and WSL2 Linux Engine pipe
        PATH = "C:\\Users\\chirantan\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin;${env.PATH}"
        DOCKER_HOST = 'npipe:////./pipe/dockerDesktopLinuxEngine'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
    }

    stages {
        // ===============================================================
        // STAGE 1: CHECKOUT SCM
        // ===============================================================
        stage('Checkout SCM') {
            steps {
                echo "=========================================================="
                echo " STAGE 1: Checking out source from repository..."
                echo "=========================================================="
                checkout scm
                script {
                    if (isUnix()) {
                        sh 'git log -1 --format="Commit: %H%nAuthor: %an%nDate:   %ad%nMessage: %s"'
                    } else {
                        bat 'git log -1 --format="Commit: %%H%%nAuthor: %%an%%nDate:   %%ad%%nMessage: %%s"'
                    }
                }
            }
        }

        // ===============================================================
        // STAGE 2: ENVIRONMENT VERIFICATION
        // ===============================================================
        stage('Environment Verification') {
            steps {
                echo "=========================================================="
                echo " STAGE 2: Verifying build environment toolchains..."
                echo "=========================================================="
                script {
                    if (isUnix()) {
                        sh 'java -version'
                        sh 'mvn -version'
                        sh 'node -v'
                        sh 'npm -v'
                        sh 'docker version'
                        sh 'docker info'
                    } else {
                        bat 'java -version'
                        bat 'call mvn -version'
                        bat 'node -v'
                        bat 'call npm -v'
                        bat 'docker.exe version'
                        bat 'docker.exe info'
                    }
                }
            }
        }

        // ===============================================================
        // STAGE 3: BACKEND BUILD
        // ===============================================================
        stage('Backend Build') {
            steps {
                echo "=========================================================="
                echo " STAGE 3: Compiling Spring Boot Backend..."
                echo "=========================================================="
                dir('backend') {
                    script {
                        if (isUnix()) {
                            sh 'mvn clean package -DskipTests --batch-mode'
                        } else {
                            bat 'call mvn clean package -DskipTests --batch-mode'
                        }
                    }
                }
            }
        }

        // ===============================================================
        // STAGE 4: BACKEND UNIT & INTEGRATION TESTING
        // ===============================================================
        stage('Backend Unit Testing') {
            steps {
                echo "=========================================================="
                echo " STAGE 4: Executing JUnit 5 & Mockito Test Suite..."
                echo "=========================================================="
                dir('backend') {
                    script {
                        if (isUnix()) {
                            sh 'mvn test --batch-mode'
                        } else {
                            bat 'call mvn test --batch-mode'
                        }
                    }
                }
            }
            post {
                always {
                    echo "Publishing JUnit backend surefire test reports..."
                    junit testResults: 'backend/target/surefire-reports/*.xml', allowEmptyResults: false
                }
            }
        }

        // ===============================================================
        // STAGE 5: FRONTEND BUILD
        // ===============================================================
        stage('Frontend Build') {
            steps {
                echo "=========================================================="
                echo " STAGE 5: Compiling React + Vite Production Bundle..."
                echo "=========================================================="
                dir('frontend') {
                    script {
                        if (isUnix()) {
                            sh 'npm ci'
                            sh 'npm run build'
                        } else {
                            bat 'call npm ci'
                            bat 'call npm run build'
                        }
                    }
                }
            }
        }

        // ===============================================================
        // STAGE 6: FRONTEND TESTING & BUNDLE VERIFICATION
        // ===============================================================
        stage('Frontend Testing') {
            steps {
                echo "=========================================================="
                echo " STAGE 6: Verifying Frontend Production Artifacts..."
                echo "=========================================================="
                dir('frontend') {
                    script {
                        if (isUnix()) {
                            sh 'test -f dist/index.html && echo "[PASS] dist/index.html verified"'
                        } else {
                            bat 'if exist dist\\index.html (echo [PASS] dist/index.html verified) else (exit /b 1)'
                        }
                    }
                }
            }
        }

        // Optional Selenium Browser Journeys
        stage('Selenium Browser Journeys') {
            when {
                expression { return params.RUN_SELENIUM_TESTS }
            }
            steps {
                echo "=========================================================="
                echo " Executing Automated Selenium Browser Journeys..."
                echo "=========================================================="
                dir('selenium-tests') {
                    script {
                        if (isUnix()) {
                            sh "mvn clean test -Dheadless=true -Dapp.base.url=http://localhost:${params.APP_HOST_PORT}"
                        } else {
                            bat "call mvn clean test -Dheadless=true -Dapp.base.url=http://localhost:${params.APP_HOST_PORT}"
                        }
                    }
                }
            }
            post {
                always {
                    junit testResults: 'selenium-tests/target/surefire-reports/*.xml', allowEmptyResults: true
                }
            }
        }

        // ===============================================================
        // STAGE 7: DOCKER IMAGE BUILD
        // ===============================================================
        stage('Docker Image Build') {
            steps {
                echo "=========================================================="
                echo " STAGE 7: Building Docker Multi-Stage Production Images..."
                echo " Tags: ${DOCKER_TAG}, ${RELEASE_VERSION}, latest"
                echo "=========================================================="
                script {
                    if (isUnix()) {
                        sh "docker build -t hackathon-team-management-backend:${DOCKER_TAG} -t hackathon-team-management-backend:${RELEASE_VERSION} -t hackathon-team-management-backend:latest -f Dockerfile ."
                        sh "docker build -t hackathon-team-management-frontend:${DOCKER_TAG} -t hackathon-team-management-frontend:${RELEASE_VERSION} -t hackathon-team-management-frontend:latest -f deployment/nginx/Dockerfile ."
                    } else {
                        bat "docker.exe build -t hackathon-team-management-backend:%DOCKER_TAG% -t hackathon-team-management-backend:%RELEASE_VERSION% -t hackathon-team-management-backend:latest -f Dockerfile ."
                        bat "docker.exe build -t hackathon-team-management-frontend:%DOCKER_TAG% -t hackathon-team-management-frontend:%RELEASE_VERSION% -t hackathon-team-management-frontend:latest -f deployment/nginx/Dockerfile ."
                    }
                }
                archiveArtifacts artifacts: 'backend/target/*.jar', fingerprint: true, allowEmptyArchive: true
            }
        }

        // ===============================================================
        // STAGE 8: DOCKER IMAGE VALIDATION
        // ===============================================================
        stage('Docker Image Validation') {
            steps {
                echo "=========================================================="
                echo " STAGE 8: Validating Docker Image Creation and Sizes..."
                echo "=========================================================="
                script {
                    if (isUnix()) {
                        sh 'docker images --filter=reference="hackathon-team-management-backend:*"'
                        sh 'docker images --filter=reference="hackathon-team-management-frontend:*"'
                    } else {
                        bat 'docker.exe images --filter=reference="hackathon-team-management-backend:*"'
                        bat 'docker.exe images --filter=reference="hackathon-team-management-frontend:*"'
                    }
                }
            }
        }

        // ===============================================================
        // STAGE 9: ANSIBLE PROVISIONING & DEPLOYMENT
        // ===============================================================
        stage('Ansible Provisioning & Deployment') {
            steps {
                echo "=========================================================="
                echo " STAGE 9: Automated Provisioning & Deployment via Ansible..."
                echo " Inventory: ansible/inventory/${params.DEPLOY_ENV}.ini"
                echo " Playbook:  ansible/playbooks/site.yml"
                echo " Release:   ${DOCKER_TAG} | Host Port: ${params.APP_HOST_PORT}"
                echo "=========================================================="
                script {
                    def inventoryFile = "ansible/inventory/${params.DEPLOY_ENV}.ini"
                    if (isUnix()) {
                        sh """
                            chmod +x ansible/ansible-runner.sh
                            ./ansible/ansible-runner.sh -i ${inventoryFile} ansible/playbooks/site.yml \
                                --extra-vars "release_tag=${RELEASE_VERSION} host_port=${params.APP_HOST_PORT} deploy_env=${params.DEPLOY_ENV}"
                        """
                    } else {
                        bat """
                            call ansible-runner.bat -i ${inventoryFile} ansible/playbooks/site.yml --extra-vars "release_tag=%RELEASE_VERSION% host_port=%APP_HOST_PORT% deploy_env=%DEPLOY_ENV%"
                        """
                    }
                }
            }
        }

        // ===============================================================
        // STAGE 10: HEALTH VERIFICATION
        // ===============================================================
        stage('Health Verification') {
            steps {
                echo "=========================================================="
                echo " STAGE 10: Verifying Backend, Database & Frontend Health..."
                echo " Target URL: http://localhost:${params.APP_HOST_PORT}"
                echo "=========================================================="
                script {
                    def maxRetries = 12
                    def delaySeconds = 3
                    def isHealthy = false

                    for (int i = 1; i <= maxRetries; i++) {
                        echo "Health verification probe ${i}/${maxRetries}..."
                        try {
                            if (isUnix()) {
                                sh "curl -f -s http://localhost:${params.APP_HOST_PORT}/actuator/health | grep '\"status\":\"UP\"'"
                                sh "curl -f -s -o /dev/null http://localhost:${params.APP_HOST_PORT}/"
                            } else {
                                bat "curl.exe -f -s http://localhost:%APP_HOST_PORT%/actuator/health | findstr \"UP\""
                                bat "curl.exe -f -s -o nul http://localhost:%APP_HOST_PORT%/"
                            }
                            isHealthy = true
                            echo "===> Health Verification PASSED on attempt ${i}!"
                            break
                        } catch (Exception e) {
                            echo "Waiting for services to become healthy (${i}/${maxRetries})..."
                            sleep(delaySeconds)
                        }
                    }

                    if (!isHealthy) {
                        error("Health Verification FAILED: Service did not report UP on http://localhost:${params.APP_HOST_PORT} within timeout.")
                    }
                }
            }
        }
    }

    // ===================================================================
    // STAGE 11: POST-BUILD ACTIONS
    // ===================================================================
    post {
        success {
            echo "=========================================================="
            echo " GRID CI/CD PIPELINE SUCCEEDED"
            echo " Released Version : ${params.RELEASE_VERSION}"
            echo " Build Tag        : ${DOCKER_TAG}"
            echo " Environment      : ${params.DEPLOY_ENV}"
            echo " Web Entry Point  : http://localhost:${params.APP_HOST_PORT}"
            echo " Actuator Health  : http://localhost:${params.APP_HOST_PORT}/actuator/health"
            echo "=========================================================="
        }
        failure {
            echo "=========================================================="
            echo " GRID CI/CD PIPELINE FAILED"
            echo " Failing stage blocked deployment."
            echo " Check console logs above for surefire or build output."
            echo "=========================================================="
        }
    }
}
