# Ease Web Version 2

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

master | development
:------: | :---:
[![CircleCI](https://circle-poc.cloud.capitalone.com/gh/ease-ui/ease-web-v2/tree/master.svg?style=shield)](https://circle-poc.cloud.capitalone.com/gh/ease-ui/ease-web-v2/tree/master) | [![CircleCI](https://circle-poc.cloud.capitalone.com/gh/ease-ui/ease-web-v2/tree/development.svg?style=shield)](https://circle-poc.cloud.capitalone.com/gh/ease-ui/ease-web-v2/tree/development)

## Prerequisites
 - node version >= 6.9.5
 - yarn installed
 - add @c1 as a scope to your npm configuration. Run the following once globally:
    - `$ curl -sSu $USER https://artifactory.cloud.capitalone.com/artifactory/api/npm/npm-internalfacing/auth/c1 >> ~/.npmrc`

## Start the project
  - Run `yarn`
  - Run `yarn dev`
  - Browse to http://localhost:3000

## Start the proxy
**Username must be defined in users.config.json.**
  - Run `yarn run proxy -- <username>`


## Lint
  - Run `yarn lint`

## Test

#### Single Run Test
  - Run `yarn test`

#### Watch Tests
  - Run `yarn test:watch`

## Coverage

This creates a `coverage` folder in the `_dist/dev` directory containing coverage information.
Open the top index.html in `./_dist/dev/coverage` in a browser.

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

## Invoking Angular 1 (L2 and Action)

### Invoking Action

To open a dialog written in Angular 1 from Angular 2 add a new module that registers an empty-path route (see `transfer-dialog.module.ts`), a component that does the wrapping, and a prepare function that loads the needed Angular 1 code.

```typescript
@Component({
  selector: 'c1-transfer-dialog',
  template: `
    <div ui-view></div>
  `,
  styles: [`
    @import '/ease-ui/ver1490660920702/dist/styles/main.min.css';
    @import '/ease-ui/ver1490660920702/bower_components/easeUIComponents/dist/ease-ui-components.css';
  `]
})
export class TransferDialogComponent {
  constructor(el: ElementRef, upgrade: UpgradeModule) {
    prepareTransferDialog().then((moduleName: string) => {
      upgrade.bootstrap(el.nativeElement, [moduleName]);
      setUpLocationSync(upgrade);
    });
  }
}
```

A prepare function uses `requirejs` to load the necessary resources. It sets up the needed UI-router states and registers a `run` hook setting the initial state.

The wrapping component should invoke a prepare function and then bootstrap the prepared Angular 1 module using `ngUpgrade`. After the bootstrap is done, it should invoke `setUpLocationSync` to make sure that the UI-router and the Angular router stay in sync.

### Routes

For the two routers not to clash, you should follow these rules:

* The URL of the wrapping component's route should be equal to the initial route's URL of the Angular 1 dialog (e.g., `/accountSummary/12121/Transfer`).
* Everything should work out of the box if the Angular 1 dialog only appends to the initial URL (e.g., `/accountSummary/12121/Transfer`, `/accountSummary/12121/Transfer/Complete`, `/accountSummary/12121/Transfer?=1`)
* If the dialog needs to navigate to a completely different URL `/accountSummary/12121/Different`, a custom url handling strategy should be defined.

#### Opening a Dialog

This is how it works:

* The user clicks a button
* The Angular router updates the URL and creates a new router state
* The Angular router instantiates the wrapping component
* The wrapping component calls its prepare function
* The prepare function returns a module name
* The wrapping component bootstraps the prepared Angular 1 module using the given module name
* The UI-router gets initialized, the dialog appears

#### Closing a Dialog (User Action)

This is how it works:

* The user closes the dialog
* The UI-router updates its state
* The UI-router updates the URL
* The Angular router picks up the URL change and creates a new router state
* The Angular router destroys the wrapping component
* The Angular 1 application containing the dialog gets destroyed

#### Closing a Dialog (Browser Event)

This is how it works:

* The user clicks on "Back"
* The Angular router picks up the URL change and creates a new router state
* The Angular router destroys the wrapping component
* The wrapping component calls close on the rootScope of the Angular1 app
* The dialog gets closed
