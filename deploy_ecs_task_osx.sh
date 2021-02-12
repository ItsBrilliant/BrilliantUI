#!/bin/bash

cluster="api-dev"
task_to_kill=$(aws ecs list-tasks --cluster $cluster | jq -r '.taskArns[0]')
container_instance_arn=$(aws ecs list-container-instances --cluster $cluster | jq -r '.containerInstanceArns[0]')
task_definition_arn=$(aws ecs stop-task --cluster $cluster --task "$task_to_kill" | jq -r '.task.taskDefinitionArn')

echo "Stopping old task"
num_running_tasks=$(aws ecs list-tasks --cluster $cluster | jq -r '.taskArns | length')
while true; do
  if [ $num_running_tasks -eq 0 ]; then
    break
  fi
  echo 'Waiting for old task to stop'
  sleep 10
  num_running_tasks=$(aws ecs list-tasks --cluster $cluster | jq -r '.taskArns | length')
done

echo 'Old task stopped. Launching new task'
new_task_arn=$(aws ecs start-task --cluster $cluster --container-instance $container_instance_arn --task-definition $task_definition_arn | jq -r '.tasks[0].taskArn')

task_status=$(aws ecs describe-tasks --cluster $cluster --tasks $new_task_arn | jq -r '.tasks[0].lastStatus')
while true; do
  if [ $task_status == "RUNNING" ]; then
    echo 'New task reached RUNNING status.'
    break
  fi
  echo 'Waiting for new task to reach RUNNING STATUS.'
  sleep 10
  task_status=$(aws ecs describe-tasks --cluster $cluster --tasks $new_task_arn | jq -r '.tasks[0].lastStatus')
done
