# GRID — Academic Demonstration & Evaluator Script

This guide provides the exact sequence of steps, commands, credentials, and expected observations to conduct a comprehensive academic demonstration of the **GRID** Hackathon Management Platform and its DevOps lifecycle.

---

## 1. Quick Startup & Environment Readiness

### Option A: Launch Complete Docker Environment
```bash
cd "d:\PROJECTS\Hackathon devops\hackathon-team-management-system"
docker compose up -d
```
*Verify Containers:*
```bash
docker ps
```
*Expected Output:*
* `hackathon_mysql` (Up, healthy, port 3306)
* `hackathon_backend` (Up, healthy, port 8080 internal)
* `hackathon_frontend` (Up, healthy, mapped `0.0.0.0:8081->80`)

### Option B: Verify Spring Boot Actuator Telemetry
```bash
curl.exe -s http://localhost:8081/actuator/health
```
*Expected Output:*
```json
{"status":"UP","components":{"db":{"status":"UP",...},"ping":{"status":"UP"}}}
```

---

## 2. Seed Accounts & Credentials

The database is pre-seeded with 3 primary accounts representing the platform's core roles:

| Role | Account Email | Password | Primary Interface Route |
| :--- | :--- | :--- | :--- |
| **Team Lead** | `chirantan@grid.dev` | `Grid@2026` | `http://localhost:8081/team/dashboard` |
| **Organizer** | `organizer@grid.dev` | `Grid@2026` | `http://localhost:8081/organizer/dashboard` |
| **Super Admin** | `superadmin@grid.dev` | `Grid@2026` | `http://localhost:8081/admin/dashboard` |

> *Tip for Demonstrators:* The Login page (`http://localhost:8081/login`) includes one-click role buttons ("Team Lead", "Organizer", "Super Admin") for rapid role switching during presentations.

---

## 3. Step-by-Step Functional Demonstration

### Step 1: Public Landing Page & Branding
1. Open browser to `http://localhost:8081/`.
2. **Observe:** The Aurora Glass dark aesthetic, floating atmosphere particles, feature showcase, and statistics counters.
3. Click **"Enter GRID"** or navigate to `http://localhost:8081/login`.

---

### Step 2: Authentication & Role Switcher
1. On `http://localhost:8081/login`, click **"Use Email"**.
2. Enter invalid credentials (`test@wrong.com` / `WrongPass`) and submit.
3. **Observe:** Inline validation alert displays *"Invalid email or password"*.
4. Click **"Team Lead"** button at the bottom of the login card.
5. **Observe:** Instant authentication and redirection to `/team/dashboard`.

---

### Step 3: TEAM Workflow Demonstration
1. **Explore Hackathons:**
   * In the left sidebar, click **"Explore"** (`/team/explore`).
   * **Observe:** Active hackathons (e.g. *AI Innovations Hackathon 2026*, *Smart Cities Summit*).
   * Notice pagination controls and carousel navigation.
2. **Team Workspace:**
   * Click **"Submissions"** in sidebar (`/team/workspace`).
   * **Observe:** Team identity (*Neural Hackers*), roster members (*Chirantan*, *Aarav*), project repository URL, and live demo link.
3. **Announcements:**
   * Click **"Announcements"** (`/team/announcements`).
   * **Observe:** Real-time organizer broadcasts and event updates.

---

### Step 4: ORGANIZER Workflow Demonstration
1. In the sidebar, click the bottom avatar / role indicator and switch to **Organizer** (or navigate to `/login` and click **"Organizer"**).
2. **Observe:** Redirection to `/organizer/dashboard`.
3. **Review Metrics:** Top cards displaying *Total Registered Teams*, *Active Hackathons*, *Pending Reviews*, and *Average Evaluation Score*.
4. **Hackathons Oversight:**
   * Click **"Hackathons"** (`/organizer/hackathons`).
   * **Observe:** Active events with registration caps and status controls.
5. **Team Approvals:**
   * Click **"Teams"** (`/organizer/teams`).
   * **Observe:** Table of participating teams across hackathons with approval status badges.
6. **Submissions & Scoring:**
   * Click **"Evaluations"** (`/organizer/evaluations`).
   * **Observe:** Submissions list with 4-pillar evaluation criteria: **Impact**, **Innovation**, **Technical Execution**, and **Presentation**.

---

### Step 5: SUPER_ADMIN Governance Demonstration
1. Switch role to **Super Admin** (`/admin/dashboard`).
2. **Observe:** Executive platform dashboard with global metrics.
3. **User Governance:**
   * Click **"Users"** (`/admin/users`).
   * **Observe:** Complete platform user directory with active/deactivated toggles and role indicators.
4. **Platform Health Telemetry:**
   * Click **"System Health"** (`/admin/health`).
   * **Observe:** Real-time database connectivity, memory consumption, disk capacity, and uptime.

---

## 4. DevOps Automation Demonstration

### Step 6: Jenkins CI/CD Pipeline Automation
1. Open browser to Jenkins controller: `http://localhost:8080/`.
2. Navigate to job: **`hackathon-team-management-system`**.
3. **Show Recent Build (Build #11):**
   * Demonstrate the 11-stage pipeline visualization:
     * *Checkout SCM* $\to$ *Environment Verification* $\to$ *Backend Build* $\to$ *Backend Testing* $\to$ *Frontend Build* $\to$ *Frontend Testing* $\to$ *Docker Packaging* $\to$ *Docker Validation* $\to$ *Ansible Provisioning* $\to$ *Health Verification* $\to$ *Post Actions*.
   * Show that all 44 JUnit backend tests passed and reports were automatically published.
4. **Trigger Build (Optional):**
   * Click **"Build with Parameters"** and click **"Build"** to showcase real-time execution.

---

### Step 7: Docker Container Lifecycle
Run the following commands in PowerShell / Terminal:
```bash
# 1. Inspect running containers
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# 2. Inspect Docker networks
docker network inspect hackathon_network

# 3. Inspect persistent volume
docker volume inspect hackathon_mysql_data
```
*Key Discussion Point for Evaluators:* The named volume `hackathon_mysql_data` guarantees zero data loss during application container upgrades or restarts.

---

### Step 8: Ansible Configuration Management & Idempotency
Demonstrate the containerized Ansible control node:
```bash
# Run Ansible playbook via Windows wrapper
.\ansible-runner.bat
```
*Key Observations:*
1. **First Execution:** Shows role execution across `common`, `docker`, `database`, `application`, and `monitoring`.
2. **Second Execution (Idempotency Proof):**
   * Shows `ok=15, changed=0, failed=0`.
   * Proves that Ansible verifies existing state without restarting containers or destroying persistent volumes.

---

### Step 9: Automated Selenium E2E Testing
Execute the headless browser test suite:
```bash
mvn -f selenium-tests/pom.xml test
```
*Expected Output:*
```
Tests run: 7, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```
*Show Screenshot Artifacts Generated:*
* `selenium-tests/target/screenshots/demo01_landing_page.png`
* `selenium-tests/target/screenshots/demo03_team_dashboard.png`
* `selenium-tests/target/screenshots/demo06_organizer_dashboard.png`
* `selenium-tests/target/screenshots/demo07_superadmin_dashboard.png`

---

## 5. Demonstration Summary & Academic Q&A Points

1. **How is team persistence maintained across multiple hackathons?**  
   *Answer:* The `teams` table is decoupled from `hackathons`. The `hackathon_registrations` join table establishes a many-to-many relationship allowing a team to register for multiple distinct events over time.
2. **How does the system ensure zero data loss during CI/CD deployments?**  
   *Answer:* The MySQL 8 database mounts a named Docker volume `hackathon_mysql_data`. In Ansible, the `database` role contains explicit safeguard assertions that fail the pipeline if volume destruction is attempted.
3. **How is configuration drift prevented?**  
   *Answer:* Ansible templates all `.env` and `nginx/default.conf` configuration files from Jinja2 source files on every run, asserting strict environment parity across development and production.
