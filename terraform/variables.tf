data "aws_caller_identity" "current" {}

variable "PG_USERNAME" {
  type      = string
  sensitive = true
}

variable "PG_PASSWORD" {
  type      = string
  sensitive = true
}

variable "REGISTRY" {
  type      = string
  sensitive = true
}

variable "REPOSITORY" {
  type      = string
  sensitive = true
}

variable "IMAGE_TAG" {
  type      = string
  sensitive = true
}