terraform {
  backend "s3" {
    bucket  = "cryptobotunb-terraform-prod-state"
    key     = "terraform/backend_terraform.tfstate"
    region  = "us-east-1"
    encrypt = true
  }
}