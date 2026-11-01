@echo off
rem ===================================================================
rem GRID Ansible Automation Runner for Windows / CI / Developer CLI
rem ===================================================================
setlocal enabledelayedexpansion

set SCRIPT_DIR=%~dp0
set WORKSPACE_DIR=%SCRIPT_DIR%
if "%WORKSPACE_DIR:~-1%"=="\" set WORKSPACE_DIR=%WORKSPACE_DIR:~0,-1%

rem Check if grid-ansible image exists, build if missing
docker image inspect grid-ansible:latest >nul 2>&1
if errorlevel 1 (
    echo [INFO] Building grid-ansible container image...
    docker build -t grid-ansible:latest -f "%SCRIPT_DIR%ansible\Dockerfile" "%SCRIPT_DIR%ansible"
)

rem Execute Ansible Playbook inside container with volume mounts and docker.sock
docker run --rm ^
    --network host ^
    -v /var/run/docker.sock:/var/run/docker.sock ^
    -v "%WORKSPACE_DIR%:/workspace/hackathon-team-management-system" ^
    -w /workspace/hackathon-team-management-system ^
    -e ANSIBLE_CONFIG=/workspace/hackathon-team-management-system/ansible/ansible.cfg ^
    grid-ansible:latest %*

