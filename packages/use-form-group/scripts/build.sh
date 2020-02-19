#!/usr/bin/env sh

set -eux

# Remove previous build files
rm -rf ./dist

yarn run build:esm5
yarn run build:fesm5

yarn run build:esm2015
yarn run build:fesm2015
yarn run build:umd
