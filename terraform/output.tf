output "instance_public_ips" {
  value = aws_instance.Bethel_ec2[*].public_ip
}

output "bucket_name" {
  value = aws_s3_bucket.my_bucket.bucket
}