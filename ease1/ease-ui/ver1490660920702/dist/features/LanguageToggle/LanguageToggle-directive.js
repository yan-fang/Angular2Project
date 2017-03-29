define(["angular","LanguageToggleModule","LanguageToggleService"],function(e){"use strict";function g(e,g,a){function n(n){function u(){return g("filter")(n.languages,{value:e.use()})[0]}function l(){e.use(n.selectedLanguage.value)}a.getLanguages().then(function(e){n.languages=e,n.selectedLanguage=u(),n.updateSelectedLanguage=l})}function u(){return'<select ng-options="language.label | translate for language in languages" ng-model="selectedLanguage" ng-change="updateSelectedLanguage()"></select>'}var l={scope:{},link:n,template:u()};return l}e.module("LanguageToggleModule").directive("easeLanguageToggle",["$translate","$filter","languageToggleService",g])});