#!/bin/sh
set -e

echo "auth"
cd auth/functions
npm install --loglevel error --no-progress --ignore-scripts
npm run build
npm run lint
cd ../..

echo "streams"
cd streams/functions
npm install --loglevel error --no-progress --ignore-scripts
npm run build
npm run test
npm run lint
npm run format:check
cd ../..
