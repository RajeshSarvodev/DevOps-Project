variable "instance_type" {
  default = "t3.micro"
}

variable "region" {
  default = "eu-west-2"
}

variable "ami" {
  description = "Valid AMI ID"
  default     = "ami-09dbc7ce74870d573" # ✅ MUST be in quotes
}

variable "bucket_name" {
  description = "Unique S3 bucket name"
  default     = "test-case-bucket-raj12345" # ⚠️ MUST be globally unique
}