#!/usr/bin/env bash

echo "STEP 1 of 4: install npm package dependencies"
cd ../../react-lib
npm install

echo "STEP 2 of 4: building npm package"
npm run build

echo "STEP 3 of 4: building docker container"
cd -
docker-compose build

echo "STEP 4 of 4: starting docker container"
docker-compose up -d
