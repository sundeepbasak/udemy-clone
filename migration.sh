#!/bin/bash

echo "changin dir"
cd ./src/migrations
echo "compile typescript"
tsc src/* --outDir dist/
echo "changing back to root directory"
cd ../../
echo "running node script"
node src/migrations/dist/script.js
