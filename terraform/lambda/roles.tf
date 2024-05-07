resource "aws_iam_role" "backend_api_role" {
    name   = "Backend_Lambda_Role"
    assume_role_policy = jsonencode(
            {
                "Version": "2012-10-17",
                "Statement": [
                {
                    "Action": "sts:AssumeRole",
                    "Principal": {
                    "Service": "lambda.amazonaws.com"
                    },
                    "Effect": "Allow",
                    "Sid": ""
                }
                ]
            }
        )
}