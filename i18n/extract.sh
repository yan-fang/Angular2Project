#!/usr/bin/env bash

./node_modules/.bin/ng-xi18n -p tsconfig-build.json
cp _dist/aot/messages.xlf i18n/