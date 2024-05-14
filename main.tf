provider "aws" {
  region = "eu-central-1"
}

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.67.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.2.0"
    }
  }

  backend "s3" {
    bucket = "ebics-to-actualbudget-terraform-state"
    key    = "default-infrastructure"
    region = "eu-central-1"
  }

  required_version = ">= 1.2.0"
}


resource "aws_s3_bucket" "terraform_state" {
  # This bucket stores the terraform state so that local dev machines and the CI stay in sync
  bucket = "ebics-to-actualbudget-terraform-state"
}


output "lambda_bucket_name" {
  description = "Name of the S3 bucket used to store function code."
  value       = aws_s3_bucket.lambda_bucket.id
}

output "function_name" {
  description = "Name of the Lambda function."
  value       = aws_lambda_function.ebics-to-actualbudget.function_name
}
