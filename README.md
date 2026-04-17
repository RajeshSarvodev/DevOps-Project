# Bethel City Application Deployment (DevOps vs DevSecOps)

## Project Overview

This project presents a comparative implementation of **Traditional DevOps** and **Modern DevSecOps** deployment approaches using a cloud-based application.

The purpose is to evaluate how automation, security integration, and scalability impact deployment performance in modern cloud environments.

---

## Architecture Overview

The system is deployed on AWS and follows a cloud-native architecture:

* Application hosted on EC2
* Infrastructure provisioned using Terraform
* CI/CD pipeline implemented using GitHub Actions
* Containerisation using Docker
* Orchestration using Kubernetes (EKS)
* Monitoring using AWS CloudWatch

---

## Technologies Used

* Amazon Web Services (EC2, S3, IAM, CloudWatch)
* Terraform (Infrastructure as Code)
* GitHub Actions (CI/CD Automation)
* Docker (Containerisation)
* Kubernetes (EKS Orchestration)

---

## Traditional DevOps Pipeline

* Manual infrastructure provisioning
* Semi-automated deployment
* Limited monitoring and security
* Higher operational effort

---

## Modern DevSecOps Pipeline

* Fully automated CI/CD pipeline
* Infrastructure as Code using Terraform
* Integrated security checks in pipeline
* Scalable and cloud-native deployment
* Continuous monitoring and logging

---

## CI/CD Pipeline Workflow

1. Code pushed to GitHub repository
2. GitHub Actions triggers pipeline
3. Terraform provisions AWS infrastructure
4. Docker builds application container
5. Application deployed automatically
6. Monitoring enabled via CloudWatch

---

## Key Features

* Automated infrastructure provisioning
* Reduced deployment time
* Improved system reliability
* Integrated security practices
* Scalable architecture

---

## Screenshots

*(To be added for dissertation evidence)*

* GitHub Repository
* GitHub Actions Pipeline
* AWS EC2 Deployment
* Terraform Execution Output
* Docker Build Output
* Kubernetes Pods

---

## Project Objective

To compare the performance of DevOps and DevSecOps based on:

* Deployment Speed
* Reliability
* Security
* Scalability
* Operational Efficiency

---

## Author

Rajesh R S
