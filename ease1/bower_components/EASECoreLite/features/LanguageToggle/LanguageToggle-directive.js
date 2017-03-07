define([
  'angular',
  'LanguageToggleModule',
  'LanguageToggleService'
], function(angular) {
  'use strict';

  angular
    .module('LanguageToggleModule').directive('easeLanguageToggle', [
      '$translate', '$filter', 'languageToggleService', easeLanguageToggleDirective
    ]);

  /**
   * Directive that creates a language selection control.
   *
   * The directive also updates the Angular Translate language selection when the selection changes.
   *
   * @param $translate Angular Translate service to determine current language and change language when selection is
   * changed.
   * @param $filter Angular filter service used to find the current language in the list of available languages.
   */
  function easeLanguageToggleDirective($translate, $filter, languageToggleService) {
    var directive = {
      scope: {},
      link: easeLanguageToggleLink,
      template: getTemplate()
    };

    return directive;

    /**
     * Link function for this directive.
     *
     * @param scope
     */
    function easeLanguageToggleLink(scope) {
      languageToggleService.getLanguages().then(function(languages) {
        scope.languages = languages;
        scope.selectedLanguage = findSelectedLanguage();
        scope.updateSelectedLanguage = updateSelectedLanguage;
      });

      /**
       * Finds the language instance in the list of available languages with a language.value that matches the language
       * value set in Angular Translate.
       *
       * @returns the selected language in the format {{label: string, value: string}}
       * @see getLanguages
       */
      function findSelectedLanguage() {
        return $filter('filter')(scope.languages, {
          value: $translate.use()
        })[0];
      }

      /**
       * Updates the selected language within Angular Translate to match the language the user selected.
       */
      function updateSelectedLanguage() {
        $translate.use(scope.selectedLanguage.value);
      }
    }

    /**
     * Creates the template for this directive.
     *
     * @returns {string}
     */
    function getTemplate() {
      return '<select ng-options="language.label | translate for language in languages" ng-model="selectedLanguage" ' +
        'ng-change="updateSelectedLanguage()"></select>';
    }
  }
});
