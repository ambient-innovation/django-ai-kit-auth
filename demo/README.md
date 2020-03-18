# Demo Project AI-KIT Authentication

This project showcases the use of the `django-ai-kit-auth` and
`ai-kit-auth` packages. It is also used for end-to-end tests, in
order to make sure, that these two libraries play well with each
other.

## Required

In order to run the demo project and end-to-end tests, you will need
[docker-compose](https://docs.docker.com/compose/install/). Please follow
the instructions for your operating system before you continue.

## Setup

### Automatic Setup

Navigate to the `demo` folder and execute

    bash setup_demo_project.sh

This script will go through all the steps mentioned in the [Manual Setup](#manual-setup) section by itself.

### Manual Setup

#### Prepare npm package

Since this demo project uses a local npm package, we need to build said package first.
To do so, navigate to the `react-lib` folder and execute the following:

        npm install
        npm run build

#### Build Docker Container

Navigate to the `demo` folder and execute

    docker-compose build

#### Deploy Docker Container

Navigate to the `demo` folder and execute

    docker-compose up -d

## Local Development
Changes made in the `django-app` directory will automatically trigger a restart of the backend server running in the docker container.

To get the same hot reloading for the frontend package, please navigate to the `react-lib` folder and execute

    npm run watch build

## E2E-Testing

Navigate to the `cypress` folder and execute

    npm install

then execute `npm run cypress:open` for testing with a GUI or `npm run cypress:run` for testing in the console.

## Using the Demo

The frontend server will be available on `localhost:3000`. You can login using one of the two
initially created users:

* username `root`, password `root`
* username `testuser`, password `testuserpassword`

On the dashboard, you can click the logout button to logout again, or click the `Trigger 401`
button to trigger an unauthorized response from the server. This will lead to a logout.

Further, we included a separate post test in the demo, which can be triggered via the `POST TEST`
button. If you activate the developer's tools, you will see a response containing the string
`'it works'`.

In order to demonstate redirection after login, visit `localhost:3000/fallback` while logged out.
Then enter valid credentials in the opened login page and check the browser URL after login.

The admin page is available on `localhost:8000/admin`. Here you can only login as user `root`.
