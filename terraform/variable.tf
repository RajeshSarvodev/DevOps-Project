variable "instance_type" {
  default = "t3.micro"
}

variable "region" {
  default = "eu-west-2"
}

variable "ami" {
  description = "Valid AMI ID"
}

variable "bucket_name" {
  description = "Unique S3 bucket name"
}