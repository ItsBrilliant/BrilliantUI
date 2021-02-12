#!/usr/bin/env bash
# Mac OSX script

# Colors
GREEN='\033[1;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color


toolInput=frontend

# Interface
interface="api/$toolInput"

read -r -d '' applescriptCode <<'EOF'
set dialogText to text returned of (display dialog "Version Number? (Docker image tag)" default answer "latest")
return dialogText
EOF

tagInput=$(osascript -e "$applescriptCode");

# Fetch Docker ECR Login code
DockerLogin=$(aws ecr get-login --no-include-email --region=us-east-2)

# Execute Docker Login to ECR
${DockerLogin}

# Build and deploy description
printf "${YELLOW}Running a build and deploy for version: ${GREEN}${interface}:${tagInput}${NC}\n"

# Docker image build
docker build -t ${interface}:${tagInput} .  -f "docker/Dockerfile"

# Tagging image for push
docker tag ${interface}:${tagInput} 522483826916.dkr.ecr.us-east-2.amazonaws.com/${interface}:${tagInput}

# Push to ECR
docker push 522483826916.dkr.ecr.us-east-2.amazonaws.com/${interface}:${tagInput}

# create a a new revision of the relevant task
# update the service (if there is only one instance, make sure that the "force" flag is on)

