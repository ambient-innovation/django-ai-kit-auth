# base image
FROM node:12.14

ENV CI true

# set working directory
WORKDIR /examples/email-user/frontend

# add `/demo/frontend/node_modules/.bin` to $PATH
ENV PATH /examples/email-user/frontend/node_modules/.bin:$PATH

# install and cache demo/frontend dependencies
COPY examples/email-user/frontend/package*.json ./
COPY react-lib /react-lib

RUN echo "installing npm packages" && \
    npm ci && \
    cd /react-lib && \
    echo "build ai-kit-auth package" && \
    npm ci && \
    npm link /examples/email-user/frontend/node_modules/react && \
    npm link /examples/email-user/frontend/node_modules/react-router-dom && \
    npm link /examples/email-user/frontend/node_modules/@material-ui/styles && \
    npm run build && \
    npm link && \
    cd - && \
    npm link ai-kit-auth

COPY examples/email-user/frontend .


# In production, we want to install the node server and run the "npm run build" command.
# We do not want to run this in development to save time and disk space.
# Therefore we can pass an argument when building `docker build --build-arg app_env=production .`.
ARG app_env

# Install node server and build code if production
RUN if [ "${app_env}" = production ]; \
	then \
	npm install --global serve && \
	npm run build --production; \
	fi

EXPOSE 3000
