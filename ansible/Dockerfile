FROM alpine:3.19

LABEL maintainer="GRID DevOps Team <devops@hackathon.dev>"
LABEL description="GRID Ansible Control Node Container for Automated Configuration & Deployment"

# Install Python, Ansible-core, Docker CLI, OpenSSH, and essential utilities
RUN apk add --no-cache \
    bash \
    curl \
    git \
    jq \
    openssh-client \
    python3 \
    py3-pip \
    py3-yaml \
    py3-jinja2 \
    py3-cryptography \
    ansible-core=2.16.1-r0 \
    docker-cli \
    docker-cli-compose \
    shadow \
    tzdata

# Install Ansible collections for Docker & POSIX automation
RUN ansible-galaxy collection install community.docker community.general ansible.posix

# Set default workdir and configuration environment
WORKDIR /workspace/hackathon-team-management-system

ENV ANSIBLE_CONFIG=/workspace/hackathon-team-management-system/ansible/ansible.cfg
ENV PYTHONUNBUFFERED=1

ENTRYPOINT ["ansible-playbook"]
CMD ["--version"]

