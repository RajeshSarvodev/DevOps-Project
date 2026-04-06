output "instance_public_ips" {
  value = aws_instance.test_ec2[*].public_ip
}

output "bucket_name" {
  value = aws_s3_bucket.bucket1.bucket
}