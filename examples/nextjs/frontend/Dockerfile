# base image
FROM gitlab.ambient-innovation.com:443/ai/dependency_proxy/containers/node:15.14

ENV CI true

# set working directory
WORKDIR /examples/nextjs/frontend

# add `/demo/frontend/node_modules/.bin` to $PATH
ENV PATH /examples/nextjs/frontend/node_modules/.bin:$PATH

# install and cache demo/frontend dependencies
COPY examples/nextjs/frontend/package*.json ./
COPY react-lib /react-lib

RUN echo "installing npm packages" && \
    yarn install --pure-lockfile && \
    cd node_modules/react && yarn link && cd - && \
    cd /react-lib && \
    echo "build ai-kit-auth package" && \
    yarn install --pure-lockfile && \
    yarn link react && \
    yarn build && \
    yarn link && \
    cd - && \
    yarn link ai-kit-auth

COPY examples/nextjs/frontend .


# In production, we want to install the node server and run the "npm run build" command.
# We do not want to run this in development to save time and disk space.
# Therefore we can pass an argument when building `docker build --build-arg app_env=production .`.
ARG app_env

# Install node server and build code if production
RUN if [ "${app_env}" = production ]; \
	then \
	yarn global add serve && \
	yarn build --profile; \
	fi

EXPOSE 3000
