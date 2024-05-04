# https://github.com/CumulusCycles/IaC_on_AWS_with_Terraform
resource "aws_ecr_repository" "cryptobotunb_repo" {
  name = var.ecr_repo_name
  force_delete = true
}