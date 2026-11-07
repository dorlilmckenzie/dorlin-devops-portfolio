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
