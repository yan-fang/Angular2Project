define(["angular"],function(e){"use strict";function n(n,r,a,t,o,g){function i(){function e(e){o.resolve(e.data)}function n(){o.resolve([{label:"header.language.english",value:"en_US"}])}var o=r.defer();return a.get(t.baseUrl+"/languages").then(e,n),o.promise}function u(){o.$on("$translatePartialLoaderStructureChanged",function(){g.refresh()})}function l(){o.$on("$translateMissingTranslationError",function(e,r){throw n.createEaseException({module:"LanguageToggleModule","function":"languageToggleService.registerThrowErrorOnMissingTranslationErrorEvent",cause:"failed to find translation for "+r})})}function s(){o.$on("$translateLoadingError",function(e,r){throw n.createEaseException({module:"LanguageToggleModule","function":"languageToggleService.registerThrowErrorOnTranslateLoadFailure",cause:"failed to load partial for lang "+r.language})})}function c(){o.$on("customerSummaryLoaded",function(n,r){e.isDefined(r.language)&&g.use(r.language)})}return{getLanguages:i,registerRefreshOnTranslateAddPartEvent:u,registerThrowErrorOnMissingTranslationErrorEvent:l,registerThrowErrorOnTranslateLoadFailureEvent:s,registerChangeLanguageOnCustomerPreferencesLoadedEvent:c}}function r(e,n,r){function a(n,r){e.create(t,r)}function o(){return e.read(t)}return{put:a,get:o}}function a(e){function n(n){return e.$emit("$translateMissingTranslationError",n),n}return n}var t="locale_pref";e.module("LanguageToggleModule").factory("languageToggleService",["easeExceptionsService","$q","$http","EaseConstant","$rootScope","$translate",n]).factory("languageToggleStorage",["appCookie","$http","EaseConstant",r]).factory("languageToggleMissingTranslationHandler",["$rootScope",a])});