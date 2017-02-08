# Ease Web Version 2

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

master | development
:------: | :---:
[![CircleCI](https://circle-poc.cloud.capitalone.com/gh/ease-ui/ease-web-v2/tree/master.svg?style=shield)](https://circle-poc.cloud.capitalone.com/gh/ease-ui/ease-web-v2/tree/master) | [![CircleCI](https://circle-poc.cloud.capitalone.com/gh/ease-ui/ease-web-v2/tree/development.svg?style=shield)](https://circle-poc.cloud.capitalone.com/gh/ease-ui/ease-web-v2/tree/development)

## Prerequisites
 - node version >= 6.9.5
 - yarn installed

## Start the project
  - Run `yarn`
  - Run `yarn dev`
  - Browse to http://localhost:3000

## Lint
  - Run `yarn lint`

## Test

#### Single Run Test
  - Run `yarn test`

#### Watch Tests
  - Run `yarn test:watch`

## Coverage

This creates a `coverage` folder in the root directory containing coverage information.
Open the top index.html in `./coverage` in a browser.

#### Single Run Test & Coverage
  - Run `yarn cover`

#### Watch Tests & Coverage
  - Run `yarn cover:watch`

## Commit Message Guidelines
  - Run `yarn commit`
  - `yarn lint` and `yarn test` run as pre-hooks for commits
