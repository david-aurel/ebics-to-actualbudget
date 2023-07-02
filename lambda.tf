# S3 to store the Javascript code for the lambda
resource "aws_s3_bucket" "lambda_bucket" {
  bucket        = "ebics-to-ynab-lambda"
  force_destroy = true
}

data "archive_file" "ebics-to-ynab" {
  type        = "zip"
  source_dir  = "${path.module}/src"
  output_path = "${path.module}/output/lambda.zip"
}

resource "aws_s3_object" "ebics-to-ynab" {
  bucket = aws_s3_bucket.lambda_bucket.id
  key    = "lambda.zip"
  source = data.archive_file.ebics-to-ynab.output_path
  etag   = filemd5(data.archive_file.ebics-to-ynab.output_path)
}


# Lambda that will run the Javascript code
resource "aws_lambda_function" "ebics-to-ynab" {
  function_name = "ebics-to-ynab"

  s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_key    = aws_s3_object.ebics-to-ynab.key

  runtime = "nodejs18.x"
  handler = "main.handler"

  source_code_hash = data.archive_file.ebics-to-ynab.output_base64sha256

  role = aws_iam_role.lambda_exec.arn
}

resource "aws_cloudwatch_log_group" "ebics-to-ynab" {
  name = "/aws/lambda/${aws_lambda_function.ebics-to-ynab.function_name}"

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

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
