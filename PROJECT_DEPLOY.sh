#!/bin/bash

# Following the diagram implementation (VPC, ECS, Networking, Subnets, S3, Lifetime Policies, CORS/Bucket Policy, etc.)
# Must have two arguments
if [ $# -ne 2 ]
then
    echo 'Invalid number of arguments, must pass in the AWS ACCESS KEY and AWS SECRET KEY to proceed'
    exit 1
fi

# Checking length of both the Access ID and Secret Key
if [ ${#1} -eq 20 ] && [ ${#2} -eq 40 ]
then
    echo 'Ensure that AWS CLI, Node, Terraform, Docker are all installed on your computer'
    echo 'Initiating project setup..'

    echo 'Pulling the latest code from the GitHub repository'
    git pull

    echo 'Ensuring dependencies installed are up to date'
    npm install

    cd backend
    npm install

    echo 'Checking if .env file exists..'

    if [ -e .env ]
    then
        echo 'Building Docker images..'

        # Build Docker images for front/back-end servers using Dockerfile
        # Move back-end image to parent directory location
        docker build -t backendserverimage .
        mv backendserverimage ../

        cd ../
        docker build -t frontendserverimage .

        # Initializing Terraform workflow environment and showcase infrastructure to be deployed
        terraform init
        terraform plan

        # Export the AWS_ACCESS_KEY_ID & AWS_SECRET_KEY provided by the user
        export AWS_ACCESS_KEY_ID=${1}
        export AWS_SECRET_ACCESS_KEY=${2}

        # Deploying AWS infrastructure
        terraform apply
        echo 'Deploying..'

        # Notify user of successful deployment and remind them to store the state file someplace safe
        echo "AWS deployment complete! Please store the terraform.tfstate file someplace safe!"
        echo "The web application is live!"
    else
        echo "Please setup your environment variables file"
        echo "Ensure that the following secrets are added:"
        echo "AWS_S3_BUCKET_NAME=<value>"
        echo "AWS_SECRET_KEY=<value>"
        echo "AWS_ACCESS_ID=<value>"
        echo "AWS_REGION=<value>"
        echo "OPENAI_API_KEY=<value>"
        echo "WEB_SCRAPER_API_KEY=<value>"
        echo "WEB_SCRAPER_HOST=<value>"
        echo "WEB_SCRAPER_URL=<value>"
        exit 1
    fi
else
    echo "Invalid keys!"
    exit 1
fi