#!/usr/bin/env bash
cd /react-lib
echo "build ai-kit-auth package"
npm link /app/node_modules/react
npm run build
echo "link ai-kit-auth package"
npm link
cd /app
npm link ai-kit-auth

echo "npm run start"
npm run start
