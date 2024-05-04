resource "aws_s3_bucket" "firebase_credentials" {
  bucket = "prod-backend-cryptobotunb-${data.aws_caller_identity.current.account_id}"
}

resource "aws_s3_object" "file_upload" {
  bucket      = aws_s3_bucket.firebase_credentials.id
  key         = "firebase.json"
  source      = "${path.root}/../env/dev/firebase.json"
  source_hash = filemd5("${path.root}/../env/dev/firebase.json")
}