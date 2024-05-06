terraform {
  required_version = ">= 1.2.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

module "buckets" {
  source = "./buckets"
}

module "postgres" {
  source = "./db"

  PG_USERNAME = var.PG_USERNAME
  PG_PASSWORD = var.PG_PASSWORD
}

module "ecr_repo" {
  source        = "./ecr"
  
  ecr_repo_name = local.ecr_repo_name
}

module "ecs_cluster" {
  source = "./ecs"

  cryptobot_backend_cluster_name = local.cryptobot_backend_cluster_name
  availability_zones             = local.availability_zones

  cryptobot_backend_task_famliy = local.cryptobot_backend_task_famliy
  ecr_repo_url                  = module.ecr_repo.ecr_repo_url
  container_port                = local.container_port
  cryptobot_backend_task_name   = local.cryptobot_backend_task_name
  ecs_task_execution_role_name  = local.ecs_task_execution_role_name

  application_load_balancer_name = local.application_load_balancer_name
  target_group_name              = local.target_group_name
  cryptobot_backend_service_name = local.cryptobot_backend_service_name

  REGISTRY = var.REGISTRY
  REPOSITORY = var.REPOSITORY
  IMAGE_TAG = var.IMAGE_TAG
}