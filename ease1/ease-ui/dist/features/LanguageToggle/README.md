##i18n
###Getting Started
EASE uses angular-translate, the defacto standard AngularJS module for i18n.  angular-translate offers three options for translating text keys into text values.  These options are: Directive, Filter, and Service.  The preferred method is the directive.  Here is the specification and an example:  
```html
<!-- <ANY translate>TRANSLATION_ID</ANY> -- >
<div data-translate >summary.yourAccount</div>
```

Because just in time loading of resources is an important aspect of EASE design another feature of angular-translate to call out is asynchronous loading of translation files.  When adding a new "state" to the route provider, you should also include the associated translation file as a resource to resolve in the state configuration.
```javascript
      var accountSummaryState = {
        name: 'accountSummary',
        url: '/accountSummary',
        resolve: {
          translate: function($translatePartialLoader) {
            $translatePartialLoader.addPart('summary');
          },
```

Learn more about how to use [Angular Translate](http://angular-translate.github.io/docs/#/guide).

###Implementation Details

#### Configuration
Language toggle is configured in the `app.js` file.  Configuration consists of two main parts.  The first part is configuring angular-translate in the `.config` stage of the Angular life cycle.  The second part is registering event listeners for various translation events once the app starts in the `.run` phase. Angular Translate is configured in two phases because global configuration needs to happen before the Angular Translate service is created. It's too late to wait until the run phase. This is not the case for event registration as events will not fire until after the app starts and `$rootScope` is not available in the config phase anyway.

#### easeLanguageToggle Directive
Toggling the language can be accomplished using the `easeLanguageToggle` Directive.  The directive renders a select option control.  The control is backed by the languageToggleService, which is detailed below.  The control displays the available languages, automatically selects the current language and updates the language when the selection changes.

#### languageToggleService Factory
This is the primary service for the Language Toggle feature. This service handles interaction several web services.  This service also encapsulates the logic used to register event handlers for translation related events.  See LanguageToggle-service.js for the full details.  The service calls the following endpoints, note that failures with these calls are ignored and default responses for en_US are returned:
 - `GET /languages returns list of available languages in the format [{"label":"header.language.english","value":"en_US"},...]`
 - `GET /customer/profile/preferences/ returns customers preferences in the format {...,"language":"en_US"}`

#### languageToggleStorage Factory
This service is a custom extension to Angular Translate that is used by Translate to store and retrieve a users language preference.  This calls the `PUT /customer/profile/preferences/language expects desired language in the format {"language":"en_US"}` endpoint to attempt to store the user's language preference.   Failures with this call are ignored.  See [custom storages](http://angular-translate.github.io/docs/#/guide/11_custom-storages).

#### languageToggleMissingTranslationHandler Factory
This service is a custom extension to Angular Translate that is used by Translate to handle when a translation is missing.  See [custom error handlers](http://angular-translate.github.io/docs/#/guide/17_custom-error-handler). 
