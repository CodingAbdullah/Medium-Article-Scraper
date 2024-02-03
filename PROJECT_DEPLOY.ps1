# Following the diagram implementation (VPC, ECS, Networking, Subnets, S3, Lifetime Policies, CORS/Bucket Policy, etc.)
# Must have two arguments
if ($args.Length -ne 2) {
    Write-Host 'Invalid number of arguments, must pass in the AWS ACCESS KEY and AWS SECRET KEY to proceed'
    exit 1
}

# Checking length of both the Access ID and Secret Key
if ($args[0].Length -eq 20 -and $args[1].Length -eq 40) {
    Write-Host 'Ensure that AWS CLI, Node, Terraform, Docker are all installed on your computer'
    Write-Host 'Initiating project setup..'

    Write-Host 'Pulling the latest code from the GitHub repository'
    git pull

    Write-Host 'Ensuring dependencies installed are up to date'
    npm install

    Set-Location -Path backend
    npm install

    Write-Host 'Checking if .env file exists..'

    if (Test-Path .env) {
        Write-Host 'Building Docker images..'

        # Build Docker images for front/back-end servers using Dockerfile
        # Move back-end image to parent directory location
        docker build -t backendserverimage .
        Move-Item backendserverimage ..

        Set-Location ..

        docker build -t frontendserverimage .

        # Initializing Terraform workflow environment and showcase infrastructure to be deployed
        terraform init
        terraform plan

        # Set the AWS_ACCESS_KEY_ID & AWS_SECRET_ACCESS_KEY provided by the user
        $env:AWS_ACCESS_KEY_ID = $args[0]
        $env:AWS_SECRET_ACCESS_KEY = $args[1]

        # Deploying AWS infrastructure
        terraform apply
        Write-Host 'Deploying..'

        # Notify user of successful deployment and remind them to store the state file someplace safe
        Write-Host 'AWS deployment complete! Please store the terraform.tfstate file someplace safe!'
        Write-Host 'The web application is live!'
    } else {
        Write-Host 'Please setup your environment variables file'
        Write-Host 'Ensure that the following secrets are added:'
        Write-Host 'AWS_S3_BUCKET_NAME=<value>'
        Write-Host 'AWS_SECRET_KEY=<value>'
        Write-Host 'AWS_ACCESS_ID=<value>'
        Write-Host 'AWS_REGION=<value>'
        Write-Host 'OPENAI_API_KEY=<value>'
        Write-Host 'WEB_SCRAPER_API_KEY=<value>'
        Write-Host 'WEB_SCRAPER_HOST=<value>'
        Write-Host 'WEB_SCRAPER_URL=<value>'
        exit 1
    }
} else {
    Write-Host 'Invalid keys!'
    exit 1
}