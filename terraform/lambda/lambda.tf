resource "aws_lambda_function" "terraform_lambda_func" {
    # s3_bucket                      = aws_s3_bucket.backend_bucket.id
    # s3_key                         = aws_s3_object.file_upload_prod.key
    image_uri                      = "${var.REGISTRY}/${var.REPOSITORY}:${var.IMAGE_TAG}"
    package_type                   = "Image"
    function_name                  = "Backend"
    role                           = aws_iam_role.backend_api_role.arn
    # handler                        = "main.handler"
    # runtime                        = "nodejs18.x"
    depends_on                     = [aws_iam_role_policy_attachment.backend_API_Attach]
    source_code_hash               = base64sha256(aws_s3_object.file_upload_prod.key)
    timeout                        = 10

    # environment {
    #     variables = {
    #         MONGO_URI = var.MONGO_URI
    #     }
    # }
}