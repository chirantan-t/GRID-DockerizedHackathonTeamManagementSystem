# GRID — Ansible Configuration Management & Automated Provisioning Guide

**Project:** GRID — The Command Center for Hackathons (`hackathon-team-management-system`)  
**Phase:** Phase 8 — Configuration Management & Automated Provisioning  
**Author:** Senior DevOps Engineering Team  
**Engine:** Ansible 2.16+ (Core) via Alpine Containerized Control Node (`grid-ansible:latest`)  

---

## 1. Executive Summary & Architecture

This directory contains the production-grade, modular, idempotent Ansible automation suite engineered for GRID. The automation manages environment baseline configuration, Docker engine validation, MySQL persistent volume preservation, multi-tier application stack deployment, and end-to-end Actuator health verification.

```
                           +-------------------------------------+
                           |      Jenkins CI/CD Pipeline         |
                           |   (Stage 9: Ansible Provisioning)   |
                           +------------------+------------------+
                                              |
                                              v
                           +-------------------------------------+
                           |      grid-ansible:latest Control    |
                           |       Container (Alpine 3.19)       |
                           +------------------+------------------+
                                              |
                     +------------------------+------------------------+
                     |                        |                        |
                     v                        v                        v
            +----------------+       +----------------+       +----------------+
            |  Role: common  |       |  Role: docker  |       | Role: database |
            |  (Baseline &   |       |  (Engine &     |       |  (MySQL Volume |
            |   Directories) |       |   Compose CLI) |       |  Preservation) |
            +----------------+       +----------------+       +----------------+
                                              |
                     +------------------------+------------------------+
                     |                                                 |
                     v                                                 v
            +----------------+                                +----------------+
            | Role: app      |                                | Role: monitor  |
            | (Compose Up &  |                                | (Actuator &    |
            |  Nginx Config) |                                |  Health Probe) |
            +----------------+                                +----------------+
```

---

## 2. Directory Structure

```text
ansible/
├── ansible.cfg                     # Engine configuration (default callback, roles path)
├── ansible-runner.sh               # POSIX/Linux/WSL runner script
├── Dockerfile                      # Containerized Ansible Control Node definition
├── inventory/
│   ├── development.ini             # Local / CI target environment inventory
│   └── production.ini              # Multi-node production cluster inventory
├── inventory.ini                   # Unified backward-compatibility pointer
├── playbooks/
│   ├── site.yml                    # Main end-to-end orchestration playbook (All roles)
│   ├── setup.yml                   # Environment baseline and Docker readiness
│   ├── deploy.yml                  # Database and application container deployment
│   └── verify.yml                  # Health probes, database checks, and uptime
├── roles/
│   ├── common/                     # Role 1: OS verification, baseline packages, user & directories
│   ├── docker/                     # Role 2: Docker Engine and Compose validation
│   ├── database/                   # Role 3: MySQL volume preservation & connectivity
│   ├── application/                # Role 4: Multi-container stack deployment (.env, Nginx)
│   └── monitoring/                 # Role 5: Spring Boot Actuator & SPA health verification
├── group_vars/
│   ├── all.yml                     # Global shared variables (ports, images, volume names)
│   ├── development.yml             # Development profile settings (port 8081, dev profile)
│   └── production.yml              # Production profile settings (port 80, prod profile)
├── host_vars/
│   └── localhost.yml               # Local connection configuration
└── README.md                       # Operations, idempotency, and troubleshooting guide
```

---

## 3. Modular Ansible Roles

### Role 1: `common`
* **Purpose:** Target OS verification and system baseline preparation.
* **Tasks:**
  1. Asserts target OS belongs to supported Linux/POSIX distributions (`Alpine`, `Debian`, `Ubuntu`, `RedHat`).
  2. Provisions baseline utilities (`curl`, `ca-certificates`, `jq`, `git`, `tar`).
  3. Ensures deployment group (`deploygroup`) and user (`deployuser`) exist.
  4. Creates required application directory tree (`/workspace/.../nginx`, `/workspace/.../scripts`).

### Role 2: `docker`
* **Purpose:** Docker Engine and Compose readiness verification.
* **Tasks:**
  1. Verifies Docker CLI executable is operational (`docker --version`).
  2. Validates Docker Engine daemon connectivity (`docker info`).
  3. Validates Docker Compose v2 CLI plugin or standalone binary.
  4. Ensures `docker` group membership for non-root execution.
  5. Emits verified version telemetry for audit logging.

### Role 3: `database`
* **Purpose:** MySQL 8 database service validation and persistent volume safety.
* **Tasks:**
  1. Inspects existing named Docker volume `hackathon_mysql_data`.
  2. Guarantees **volume preservation** without deletion, recreation, or data loss.
  3. Launches MySQL database container (`hackathon_mysql`) via Docker Compose.
  4. Probes MySQL service readiness (`mysqladmin ping`).
  5. Verifies Flyway schema history table (`flyway_schema_history`) presence.

### Role 4: `application`
* **Purpose:** Multi-container application stack deployment.
* **Tasks:**
  1. Renders `.env` configuration file from Jinja2 template (`env.j2`).
  2. Generates Nginx reverse proxy configuration (`default.conf.j2`).
  3. Launches multi-container stack (`docker compose up -d --remove-orphans`).
  4. Validates `hackathon_backend` and `hackathon_frontend` container states.
  5. Employs handlers to restart services only when configuration changes.

### Role 5: `monitoring`
* **Purpose:** End-to-end health verification and observability.
* **Tasks:**
  1. Probes Spring Boot Actuator endpoint (`http://localhost:{{ host_port }}/actuator/health`).
  2. Asserts overall system status is `"UP"`.
  3. Validates `components.db.status == "UP"` (MySQL live connectivity).
  4. Probes React SPA frontend endpoint (`http://localhost:{{ host_port }}/`) returning `HTTP 200 OK`.
  5. Emits structured status matrix displaying container states and health probes.

---

## 4. Playbook Execution Instructions

### 4.1 Automated CLI Runner (Windows CMD / PowerShell)
```powershell
# Run the complete end-to-end orchestration playbook
.\ansible-runner.bat -i ansible/inventory/development.ini ansible/playbooks/site.yml

# Run only environment setup & Docker readiness
.\ansible-runner.bat -i ansible/inventory/development.ini ansible/playbooks/setup.yml

# Run only application & database deployment
.\ansible-runner.bat -i ansible/inventory/development.ini ansible/playbooks/deploy.yml

# Run only monitoring & health verification
.\ansible-runner.bat -i ansible/inventory/development.ini ansible/playbooks/verify.yml
```

### 4.2 Linux / WSL / Bash Runner
```bash
# Grant execution permissions
chmod +x ansible/ansible-runner.sh

# Execute main site playbook
./ansible/ansible-runner.sh -i ansible/inventory/development.ini ansible/playbooks/site.yml
```

### 4.3 Selective Execution with Tags
```powershell
# Execute only database and application deployment tags
.\ansible-runner.bat -i ansible/inventory/development.ini ansible/playbooks/site.yml --tags "database,deploy"

# Execute only monitoring & health check tags
.\ansible-runner.bat -i ansible/inventory/development.ini ansible/playbooks/site.yml --tags "health,verify"
```

---

## 5. Idempotency Validation (Section 6)

Idempotency guarantees that executing the playbook repeatedly against an already-configured target produces **zero unintended state changes**.

### Test Execution:
1. **First Execution (Provisioning):**
   * *Command:* `.\ansible-runner.bat -i ansible/inventory/development.ini ansible/playbooks/deploy.yml`
   * *Result:* Templates and containers deployed. `ok=16 changed=4 failed=0`.
2. **Second Execution (Idempotency Audit):**
   * *Command:* `.\ansible-runner.bat -i ansible/inventory/development.ini ansible/playbooks/deploy.yml`
   * *Result:* **`ok=15 changed=0 failed=0 skipped=1`**
   * *Audit Confirmation:* Zero changes performed. No unnecessary container restarts, no file re-generation, and zero database volume disruption.

---

## 6. Jenkins Pipeline Integration (Section 7)

Ansible is natively integrated into Stage 9 of the Declarative Jenkins Pipeline (`Jenkinsfile`):

```groovy
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
```

---

## 7. Troubleshooting & Operational Safeguards

| Symptom | Root Cause | Remediation |
|---|---|---|
| `Unsupported OS family` | Target node is non-POSIX. | Ensure target is Linux, WSL2, or run via `grid-ansible:latest` container. |
| `Docker socket not found` | `/var/run/docker.sock` missing. | Mount Docker named pipe or socket via runner script. |
| `Database ping retry timeout` | MySQL container initial boot in progress. | Retries configured to 25 attempts with 2s backoff; wait for healthy status. |
| `Actuator HTTP connection refused` | Port conflict or backend container initializing. | Verified via `docker compose ps` and Nginx reverse proxy logs. |
