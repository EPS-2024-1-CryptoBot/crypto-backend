data "aws_caller_identity" "current" {}

variable "REGISTRY" {
  type = string
  sensitive = true
}

variable "REPOSITORY" {
  type = string
  sensitive = true
}

variable "IMAGE_TAG" {
  type = string
  sensitive = true
}