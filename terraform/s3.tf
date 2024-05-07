resource "aws_s3_bucket" "backend_bucket" {
  bucket = "prod-backend-cryptobotunb-${data.aws_caller_identity.current.account_id}"
}

resource "aws_s3_object" "file_upload_firebase" {
  bucket      = aws_s3_bucket.backend_bucket.id
  key         = "firebase.json"
  source      = "${path.root}/../env/prod/firebase.json"
  source_hash = filemd5("${path.root}/../env/prod/firebase.json")
}