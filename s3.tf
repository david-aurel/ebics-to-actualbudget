resource "aws_s3_bucket" "lambda_bucket" {
  bucket        = "ebics-to-ynab"
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
