# Dorlin Stephen-Odogu — DevOps Portfolio

A responsive personal portfolio website built with HTML, CSS and JavaScript.

## Technologies
- HTML5 and CSS3
- JavaScript
- Nginx
- Docker
- AWS EC2
- GitHub Actions

## Run locally with Docker

Build the image:

docker build -t dorlin-portfolio:v1 .

Run the container:

docker run -d --name dorlin-portfolio -p 8080:80 dorlin-portfolio:v1

Open http://localhost:8080

## Deployment

The project is designed for automated deployment to an Ubuntu EC2 instance using GitHub Actions.

## Author

Dorlin Stephen-Odogu

## Automated Deployment and Rollback

- Live website: http://34.228.56.87
- Server: AWS EC2 Ubuntu
- Web server: Nginx
- Container: dorlin-portfolio
- Website port: 80
- Deployment: GitHub Actions on pushes to main or manual workflow dispatch.
- Runner: Self-hosted GitHub Actions runner on EC2.

### Pipeline

The workflow validates the portfolio files, builds a Docker image tagged with the Git commit SHA, tests a candidate container, deploys it, and checks the public website from a GitHub-hosted runner. If the public health check fails, the workflow attempts to restore the previous container.

### Manual rollback

Replace COMMIT_SHA with a previously deployed image tag:

    sudo docker stop dorlin-portfolio
    sudo docker rm dorlin-portfolio
    sudo docker run -d --name dorlin-portfolio --restart unless-stopped -p 80:80 dorlin-portfolio:COMMIT_SHA

### Security

The self-hosted runner communicates with GitHub using an outbound connection. SSH access is not opened to GitHub-hosted runners. Only trusted changes to main should be deployed.
