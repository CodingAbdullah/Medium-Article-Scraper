# Providing Cloud Provider information and region where resources should be deployed
provider "aws" {
    region = "us-east-2"
}

# Setting up AWS VPC
resource "aws_vpc" "aws_medium_scraper_vpc" {
  cidr_block = "10.0.0.0/16"
  enable_dns_hostnames = true
  tags = {
    Name = "aws_medium_scraper_vpc"
  }
}

# Setting up Private/Public Subnets using VPC
# Assign a Public IP address to the AWS Subnet
resource "aws_subnet" "public_subnet_ALB" {
  vpc_id                  = aws_vpc.aws_medium_scraper_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-2a"
  map_public_ip_on_launch = true 
  tags = {
    Name = "public_subnet_ALB"
  }
}

# Private Subnet Frontend Container 
# Ensuring it is private without issuing a public IP
resource "aws_subnet" "private_subnet_frontend_container" {
  vpc_id                  = aws_vpc.aws_medium_scraper_vpc.id
  cidr_block              = "10.0.2.0/24"
  availability_zone       = "us-east-2b"
  map_public_ip_on_launch = false 
  tags = {
    Name = "private_subnet_frontend_container"
  }
}

# Private Subnet Backend Container
# Ensuring it is private without issuing a public IP
resource "aws_subnet" "private_subnet_backend_container" {
  vpc_id                  = aws_vpc.aws_medium_scraper_vpc.id
  cidr_block              = "10.0.3.0/24"
  availability_zone       = "us-east-2c"
  map_public_ip_on_launch = false 
  tags = {
    Name = "private_subnet_backend_container"
  }
}

# By default, all inbound traffic is blocked
# By default, all outbound traffic is allowed
# Setting ingress rules to allow HTTP/HTTPS traffic on the ALB
resource "aws_security_group" "sg_alb" {
  name        = "sg_alb"
  description = "Allow inbound internet traffic to access the application load balancer"
  vpc_id      = aws_vpc.aws_medium_scraper_vpc.id

  # Accept traffic on port 80 for HTTP
  ingress {
    from_port = 80
    to_port   = 80
    protocol  = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Accept traffic on port 443 for HTTPS
  ingress {
    from_port = 443
    to_port   = 443
    protocol  = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Send traffic to front-end running container
  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
}

# Define Security Group for the Front-end Container
resource "aws_security_group" "sg_frontend_container" {
  name        = "sg_frontend_container"
  description = "Allow inbound from the load balancer to access the frontend container"
  vpc_id      = aws_vpc.aws_medium_scraper_vpc.id

  # Accept traffic from any Port, CIDR blocks, and Protocol
  ingress {
      from_port   = 3000
      to_port     = 3000
      protocol    = "-1"
      cidr_blocks = ["0.0.0.0/0"]
  }

  # Receive response from the same port
  egress {
    from_port        = 3000
    to_port          = 3000
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
}

# Define Security Group for the Back-end Container
resource "aws_security_group" "sg_backend_container" {
  name        = "sg_backend_container"
  description = "Allow inbound internet traffic only from front-end container"
  vpc_id      = aws_vpc.aws_medium_scraper_vpc.id

# Accept traffic from any Port, CIDR blocks, and Protocol
  ingress {
      from_port   = 5000
      to_port     = 5000
      protocol    = "-1"
      cidr_blocks = ["0.0.0.0/0"]
  }
  
  # Send out response from the same port
  egress {
    from_port        = 5000
    to_port          = 5000
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }
}

# Set up the AWS ALB
# Define the Security Group and Subnet to be used
resource "aws_lb" "medium_article_application_balancer" {
    name               = "medium-article-alb"
    internal           = false
    load_balancer_type = "application"
    security_groups    = [aws_security_group.sg_alb.id]
    subnets            = [aws_subnet.public_subnet_ALB.id]

    enable_deletion_protection = true
}

# Create the AWS S3 Bucket and assign it a name
# Establish bucket ownership and enable public access
# Define CORS policy for the bucket
# Define Bucket policy for all the objects for the bucket
# PUT GET Methods are the only allowed methods
# Finally, define a bucket lifecycle policy
resource "aws_s3_bucket" "medium_article_files" {
  bucket = "medium_article_files"
}

# Setting the ownership to the bucket owner
resource "aws_s3_bucket_ownership_controls" "medium_article_files_ownership_control" {
  bucket = aws_s3_bucket.medium_article_files.id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

# Enabling public access using the public access block
# Disable any public blocking resources
resource "aws_s3_bucket_public_access_block" "medium_article_files_access_block" {
  bucket = aws_s3_bucket.medium_article_files.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# Enabling actions on S3 Bucket ACL
resource "aws_s3_bucket_acl" "medium_article_files_acl" {
  depends_on = [
    aws_s3_bucket_ownership_controls.medium_article_files_ownership_control,
    aws_s3_bucket_public_access_block.medium_article_files_access_block
  ]

  bucket = aws_s3_bucket.medium_article_files.id
  acl    = "public-read-write"
}

# Assign the bucket ID of the resource in the CORS configuration
resource "aws_s3_bucket_cors_configuration" "medium_article_files_cors_policy" {
    bucket = aws_s3_bucket.medium_article_files.id

    cors_rule {
        allowed_headers = ["*"]
        allowed_methods = ["PUT", "GET"]
        allowed_origins = ["*"]
        expose_headers  = ["ETag"]
        max_age_seconds = 3000
    }
}

# Set the Bucket policy for the Medium Article Files S3 Bucket
resource "aws_s3_bucket_policy" "medium_article_files_bucket_policy" {
    bucket = aws_s3_bucket.medium_article_files.id
    policy = data.aws_iam_policy_document.medium_article_files_policy_document
}

# Policy document description in the form of a JSON Document
data "aws_iam_policy_document" "medium_article_files_policy_document" {
  statement {
    principals {
      type        = "AWS"
      identifiers = ["*"]
    }
    actions = [
      "s3:GetObject",
      "s3:PutObject"
    ]

    resources = [
      aws_s3_bucket.medium_article_files.arn,
      "${aws_s3_bucket.medium_article_files.arn}/*"
    ]
  }
}

# Define a lifecycle policy for all the objects stored within the S3 Bucket, delete after 2 days
resource "aws_s3_bucket_lifecycle_configuration" "medium_article_files" {
  bucket = aws_s3_bucket.medium_article_files.id

  rule {
    id     = "delete-in-2-days"
    status = "Enabled"
    expiration {
      days = 2
    }
  }
}

# Define an AWS ECR for storing Docker Images
# Set options for the repository (image_tag mutability)
# Set policy for the repository
resource "aws_ecr_repository" "docker_ecr_service" {
  name                 = "docker_ecr_service"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

# Generating a policy to be attached to the ECR Repository
data "aws_iam_policy_document" "docker_ecr_service_policy_document" {
  statement {
    sid    = "new policy"
    effect = "Allow"

    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    actions = [
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage",
      "ecr:BatchCheckLayerAvailability",
      "ecr:PutImage",
      "ecr:InitiateLayerUpload",
      "ecr:UploadLayerPart",
      "ecr:CompleteLayerUpload",
      "ecr:DescribeRepositories",
      "ecr:GetRepositoryPolicy",
      "ecr:ListImages",
      "ecr:DeleteRepository",
      "ecr:BatchDeleteImage",
      "ecr:SetRepositoryPolicy",
      "ecr:DeleteRepositoryPolicy",
    ]
  }
}

# AWS ECR Repository Policy with the policy attached
resource "aws_ecr_repository_policy" "docker_ecr_service_policy" {
  repository = aws_ecr_repository.docker_ecr_service.name
  policy     = data.aws_iam_policy_document.docker_ecr_service_policy_document
}

# Attaching a lifecycle policy to the AWS ECR Repository
resource "aws_ecr_lifecycle_policy" "docker_ecr_service_lifecycle_policy" {
    repository = aws_ecr_repository.docker_ecr_service.name
    policy = <<-EOF
    {
                "rules": [
                            {  
                                "rulePriority": 1,
                                "description": "Images to be removed after 5 days",
                                "selection": {
                                                "tagStatus": "untagged",
                                                "countType": "sinceImagePushed",
                                                "countUnit": "days",
                                                "countNumber": 5
                                },
                                "action": {
                                    "type": "expire"
                                }
                            }
                        ]
    }
    EOF
}

# Defining an IAM role for working with the ECS service
resource "aws_iam_role" "ecs_role" {
  name = "ecs_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

# ECS Task Definition for running Docker containers
resource "aws_ecs_task_definition" "docker_ecr_task_definition" {
  family = "service"
  network_mode = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn = aws_iam_role.ecs_role.arn

  container_definitions = jsonencode([
    {
      name      = "front-end-react-server"
      image     = "frontendserverimage"
      cpu       = 256
      memory    = 512
      essential = true
      portMappings = [
        {
          containerPort = 3000
          hostPort      = 3000
        }
      ]
    },
    {
      name      = "back-end-node-server"
      image     = "backendserverimage"
      cpu       = 256
      memory    = 512
      essential = true
      portMappings = [
        {
          containerPort = 5000
          hostPort      = 5000
        }
      ]
    }
  ])
}

# ECS Cluster for setting up cluster
resource "aws_ecs_cluster" "servercluster" {
  name = "server-cluster"
}

# ECS Service for running the containers
resource "aws_ecs_service" "servercontainer" {
  name            = "my-ecs-service"
  cluster         = aws_ecs_cluster.servercluster.id
  task_definition = aws_ecs_task_definition.docker_ecr_task_definition.arn
  launch_type     = "FARGATE"
  desired_count   = 2

  # Assigning the subnets and security groups of the two containers defined in resources earlier
  network_configuration {
    subnets = [aws_subnet.private_subnet_frontend_container.id, aws_subnet.private_subnet_backend_container.id]
    security_groups = [aws_security_group.sg_frontend_container.id, aws_security_group.sg_backend_container.id]
  }
}

# Application Load Balancer Target Group
resource "aws_lb_target_group" "application_load_balancer_target_group" {
  name        = "aws-lb-target-group"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = aws_vpc.aws_medium_scraper_vpc.id
  target_type = "ip"

  health_check {
    path = "/"
    port = 80
  }
}

# Listen for HTTP requests and forward them to the target group
resource "aws_lb_listener" "application_load_balancer_listener" {
  load_balancer_arn = aws_lb.medium_article_application_balancer.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.application_load_balancer_target_group.arn
  }
}

# Attach the target group to the AWS ECS Service resource created earlier
resource "aws_lb_target_group_attachment" "example" {
  target_group_arn = aws_lb_target_group.application_load_balancer_target_group.arn
  target_id        = aws_ecs_service.servercontainer.id
  port             = 80
}