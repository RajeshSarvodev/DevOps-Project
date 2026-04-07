provider "aws" {
  region = var.region
}

#  Security Group
resource "aws_security_group" "test_sg" {
  name = "test-case-sg"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]   # later we will secure this
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

#  EC2 Instances
resource "aws_instance" "test_ec2" {
  count         = 2
  ami           = var.ami
  instance_type = var.instance_type

  vpc_security_group_ids = [aws_security_group.test_sg.id]

  tags = {
    Name = "server-${count.index + 1}"
  }
}

#  S3 Bucket
resource "aws_s3_bucket" "bucket1" {
  bucket = var.bucket_name

  tags = {
    Name = "test-case-bucket"
  }
}