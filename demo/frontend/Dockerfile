# base image
FROM node:12.14

RUN mkdir /app

# we use yalc because npm link is not reliable in this context
RUN npm i -g yalc

COPY ./ai-kit-auth /ai-kit-auth

# build the ai-kit-auth package and 'publish' it with yalc
WORKDIR /ai-kit-auth
RUN npm install && \
  npm run build && \
  yalc publish --private

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY demo/frontend/package*.json /app/

# add the 'published' package to node_modules with yalc
RUN yalc link ai-kit-auth && \
    npm ci

COPY demo/frontend /app/


# In production, we want to install the node server and run the "npm run build" command.
# We do not want to run this in development to save time and disk space.
# Therefore we can pass an argument when building `docker build --build-arg app_env=production .`.
ARG app_env

# Install node server and build code if production
RUN if [ ${app_env} = production ]; \
	then \
	npm install --global serve && \
	npm run build --production; \
	fi

EXPOSE 3000

# For local development run `yarn start`
CMD ["./run.sh"]
