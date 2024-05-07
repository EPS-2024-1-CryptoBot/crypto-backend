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

module "postgres" {
  source = "./db"

  PG_USERNAME = var.PG_USERNAME
  PG_PASSWORD = var.PG_PASSWORD
}

module "ecr_repo" {
  source        = "./ecr"
  
  ecr_repo_name = local.ecr_repo_name
}