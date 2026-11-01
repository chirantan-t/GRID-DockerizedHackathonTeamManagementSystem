#!/usr/bin/env bash
# ===================================================================
# GRID Ansible Automation Runner for Linux, WSL & Jenkins CI
# ===================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

# Check if grid-ansible image exists, build if missing
if ! docker image inspect grid-ansible:latest >/dev/null 2>&1; then
    echo "[INFO] Building grid-ansible container image..."
    docker build -t grid-ansible:latest -f "${SCRIPT_DIR}/Dockerfile" "${SCRIPT_DIR}"
fi

# Execute playbook inside container
exec docker run --rm \
    --network host \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v "${PROJECT_ROOT}:/workspace/hackathon-team-management-system" \
    -w /workspace/hackathon-team-management-system \
    -e ANSIBLE_CONFIG=/workspace/hackathon-team-management-system/ansible/ansible.cfg \
    grid-ansible:latest "$@"

