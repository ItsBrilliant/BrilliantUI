aws ecr get-login-password | docker login --username AWS --password-stdin 522483826916.dkr.ecr.us-east-2.amazonaws.com

$api_ecr='522483826916.dkr.ecr.us-east-2.amazonaws.com'
$tag_cmd='docker tag '
$push_cmd='docker push '

$tag = Read-Host -Prompt 'Tag'

Invoke-Expression "docker build -t api/frontend:$tag -f docker/Dockerfile ."
Invoke-Expression "$tag_cmd api/frontend:$tag $api_ecr/api/frontend:$tag"
Invoke-Expression "$push_cmd $api_ecr/api/frontend:$tag"



