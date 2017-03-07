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

## Run Webpack Dashboard

 - Run `yarn dashboard`

## Commit Message Guidelines
  - Run `yarn commit`
  - `yarn lint` and `yarn test` run as pre-hooks for commits

## I18n

- Run `yarn i18n:extract` to extract all the strings from the application.
- Create a copy of the translated file (see `messages.ru.xlf` as an example).
- Pass a locale to `yarn dev` (`yarn dev:aot -- --env.locale=ru`).

## Lighthouse Tests

As part of the CI process, the [lighthouse](https://github.com/GoogleChrome/lighthouse) CLI is used to evaluate a production
build of the application. Some of the results of lighthouse CLI are compared against
a pre-defined budget of acceptable timings, defined in `lighthouse/lighthouse-budgets.json`.
If any of the actual timings are greater than budgeted, the build will fail. The budget JSON
mirrors the structure of `lighthouse/tmp/lighthouse-parsed.json`, so any new budgets can be added as long as the
data exists in the generated/parsed report at `lighthouse/tmp/lighthouse-parsed.json`.

By default, Lighthouse evaluates the app using emulated mobile (Good 3G) network and mobile device (~5x
CPU slowdown).

Currently, the following timings are measured:

 * Time to first byte
 * Time to first meaningful paint
 * Time to meaningful content (custom time recorded when Angular bootstrap is complete)
   * If server-side-rendering is added to the application later, this metric would be recorded as soon as the document is rendered.
 * Time to interactive (custom time recorded when Angular bootstrap is complete)

### Running Lighthouse Tests

To build the app with prod mode and run the lighthouse tests, run `yarn lighthouse`.

### PerfMeasureService

A new service, `PerfMeasureService`, has been added which allows marking custom times for measurement, using the native `window.performance.mark` API.
Calling `perfMeasureService.mark('special-moment')` will record an entry with a timestamp of that moment, which tools like lighthouse can see
by calling `window.performance.getEntries()`. Any custom timings added to the Angular application
will automatically be added to the parsed lighthouse report stored at `lighthouse/tmp/lighthouse-parsed.json`
after running the lighthouse test.

The service comes with a module, `PerfMeasureModule` that automatically configures necessary providers.
In order to disable the service for an environment, the static `disable` method of `PerfMeasureModule` can
be called when including it in the imports of another module. This makes the module and its providers available
for injection, but the methods of the service will essentially be no-ops.

```typescript
@NgModule({
  imports: [
    PerfMeasureModule.disable()
  ]
})
```
