# base image
FROM node:12.14

# set working directory
RUN mkdir /app
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json package-lock.json /app/
RUN npm ci

COPY . /app/


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
