# S3 to store the Javascript code for the lambda
resource "aws_s3_bucket" "lambda_bucket" {
  bucket        = "ebics-to-actualbudget-lambda"
  force_destroy = true
}
resource "aws_s3_object" "ebics-to-actualbudget" {
  bucket = aws_s3_bucket.lambda_bucket.id
  key    = "lambda.zip"
  source = "${path.module}/build/lambda.zip"
  etag   = filemd5("${path.module}/build/lambda.zip")
}


# Lambda that will run the Javascript code
resource "aws_lambda_function" "ebics-to-actualbudget" {
  function_name = "ebics-to-actualbudget"

  s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_key    = aws_s3_object.ebics-to-actualbudget.key

  runtime = "nodejs18.x"
  handler = "build/index.handler"

  source_code_hash = filemd5("${path.module}/build/lambda.zip")

  role = aws_iam_role.lambda_exec.arn

  environment {
    variables = {
      NODE_OPTIONS = "enable-source-maps"
      NODE_ENV     = "production"
    }
  }
}

resource "aws_cloudwatch_log_group" "ebics-to-actualbudget" {
  name = "/aws/lambda/${aws_lambda_function.ebics-to-actualbudget.function_name}"

  retention_in_days = 30
}

resource "aws_iam_role" "lambda_exec" {
  name = "serverless_lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy_execution" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
resource "aws_iam_role_policy_attachment" "lambda_policy_ssm" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMReadOnlyAccess"
}
