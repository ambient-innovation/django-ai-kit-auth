# base image
FROM node:15.14

ENV CI true

# set working directory
WORKDIR /examples/react-router/frontend

# add `/demo/frontend/node_modules/.bin` to $PATH
ENV PATH /examples/react-router/frontend/node_modules/.bin:$PATH

# install and cache demo/frontend dependencies
COPY examples/react-router/frontend/package*.json ./
COPY react-lib /react-lib

RUN echo "installing npm packages" && \
    yarn install --pure-lockfile && \
    cd node_modules/react && yarn link && cd - && \
    cd node_modules/react-router-dom && yarn link && cd - && \
    cd node_modules/@material-ui/styles && yarn link && cd - && \
    cd /react-lib && \
    echo "build ai-kit-auth package" && \
    yarn install --pure-lockfile && \
    yarn link react && \
    yarn link react-router-dom && \
    yarn link @material-ui/styles && \
    yarn build && \
    yarn link && \
    cd - && \
    yarn link ai-kit-auth

COPY examples/react-router/frontend .


# In production, we want to install the node server and run the "npm run build" command.
# We do not want to run this in development to save time and disk space.
# Therefore we can pass an argument when building `docker build --build-arg app_env=production .`.
ARG app_env

# Install node server and build code if production
RUN if [ "${app_env}" = production ]; \
	then \
	yarn global add serve && \
	yarn build --production; \
	fi

EXPOSE 3000
