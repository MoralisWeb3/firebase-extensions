#!/bin/sh
set -e

SCRIPT_DIR=$(cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd)
ROOT_DIR=$SCRIPT_DIR/../..

echo "auth"
cd $ROOT_DIR/auth/functions
npm install --loglevel error --no-progress --ignore-scripts
npm run build

echo "streams"
cd $ROOT_DIR/streams/functions
npm install --loglevel error --no-progress --ignore-scripts
npm run build
npm run test
