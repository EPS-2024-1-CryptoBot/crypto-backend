locals {
  ecr_repo_name                   = "cryptobot_ecr_repo"

  cryptobot_backend_cluster_name  = "cryptobot-backend-cluster"
  availability_zones              = ["us-east-1a", "us-east-1b", "us-east-1c"]
  cryptobot_backend_task_famliy   = "cryptobot-backend-task"
  container_port                  = 3000
  cryptobot_backend_task_name     = "cryptobot-backend-task"
  ecs_task_execution_role_name    = "cryptobot-backend-task-execution-role"

  application_load_balancer_name  = "cc-cryptobot-backend-alb"
  target_group_name               = "cc-cryptobot-backend-alb-tg"

  cryptobot_backend_service_name  = "cc-cryptobot-backend-service"
}
