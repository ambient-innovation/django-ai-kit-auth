# Demo Project AI-KIT Authentication

This project showcases the use of the `django-ai-kit-auth` and
`ai-kit-auth` packages. It is also used for end-to-end tests, in
order to make sure, that these two libraries play well with each
other.

Since this demo project uses the local versions of both packages,
the setup is a little more complicated.
Don't worry though, when integrating this module into your existing project,
it won't be that complex. See [react-lib README](../react-lib/README.md)
and [django-app README](../django-app/README.rst) for detailed instructions

## Required

In order to run the demo project and end-to-end tests, you will need
[docker-compose](https://docs.docker.com/compose/install/). Please follow
the instructions for your operating system before you continue.

## Setup

### Automatic Setup

Navigate to the `demo` folder and execute

    bash setup_demo_project.sh
    
This script will go through all the steps mentioned in the [Manual Setup](#manual-setup) section by itself.

When the setup is complete, the frontend of the demo project will be available under http://localhost:3000. The Django Admin will be available under http://localhost:8000/admin.

### Manual Setup

#### Prepare npm package

Since this demo project uses a local npm package, we need to build said package first.
To do so, navigate to the `react-lib` folder and execute the following:
    
        npm install
        npm run build

#### Build Docker Container

Navigate to the `demo` folder and execute

    docker-compose build

#### Deploy Docker Containers

Navigate to the `demo` folder and execute

    docker-compose up -d
    
When the containers are up and running, the frontend of the demo project will be available under http://localhost:3000. The Django Admin will be available under http://localhost:8000/admin.

## Local Development
After starting the docker containers, the frontend of the demo project will be available under http://localhost:3000. The Django Admin will be available under http://localhost:8000/admin.

Changes made in the `django-app` directory will automatically trigger a restart of the backend server running in the docker container.

To get the same hot reloading for the frontend package, please navigate to the `react-lib` folder and execute

    npm run watch build

## E2E-Testing

Navigate to the `cypress` folder and execute

    npm install
 
then execute `npm run cypress:open` for testing with a GUI or `npm run cypress:run` for testing in the console.
