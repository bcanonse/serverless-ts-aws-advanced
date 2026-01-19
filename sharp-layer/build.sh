#!/bin/bash
set -e

docker build -t sharp-layer .

docker run --rm \
  --entrypoint "" \
  -v "$(pwd)/layer/nodejs:/opt/nodejs" \
  sharp-layer \
  bash -c "cp -R node_modules nodejs/"

cd layer
zip -r sharp-layer.zip nodejs
