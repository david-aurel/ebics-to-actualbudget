provider "aws" {
  region = "eu-central-1"
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.2.0"
    }
  }

  backend "s3" {
    bucket = "ebics-to-ynab-terraform-state"
    key    = "default-infrastructure"
    region = "eu-central-1"
  }

  required_version = ">= 1.2.0"
}


resource "aws_s3_bucket" "terraform_state" {
  # This bucket stores the terraform state so that local dev machines and the CI stay in sync
  bucket = "ebics-to-ynab-terraform-state"
}
