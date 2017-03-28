define([
  'angular'
], function(angular) {
  'use strict';
  var globalFooterModule = angular.module('GlobalFooterModule', []);

  globalFooterModule.directive('footerSubmenu', ['$document',function($document) {
    return {
      restrict: 'A',
      secope:{
        footerSubmenu: '='
      },
      link: function(scope, element, attrs) {
        var addMyClass = function(classToAdd) {
          var myClasses = ['footerHover', 'footerClick'];
          for (var cCl in myClasses) {
            if (myClasses[cCl] === classToAdd) {
              element.addClass(classToAdd);
            } else {
              element.removeClass(myClasses[cCl]);
            }
          }
        };

        function togglePopup(onlyIfOpen) {
          if (!element.hasClass('footerClick')) {
            if (!onlyIfOpen) {
              angular.element($document[0].querySelectorAll('li.has-children')).removeClass('footerClick');
              addMyClass('footerClick');
              var el = element.find('ul').children()[0];
              el.firstChild.focus();
            }
          } else {
            closePopup();
          }
        }

        function closePopup() {
          element.removeClass('footerClick');
        }

        $document.bind('click', function() {
          closePopup();
        });

        scope.$on('$stateChangeStart', function() {
          closePopup();
        });

        element.bind('click', function(event) {
          togglePopup();
          event.stopImmediatePropagation();
        });

        element.bind('focus', function(event) {
          if (attrs.footerSubmenu == 'false') {
            angular.element($document[0].querySelectorAll('li.has-children')).removeClass('footerClick');
          }
        });

        element.bind('keyup',function(evt) {
          if (evt.which === 13 || evt.which === 48) {
            togglePopup();
          } else if (evt.which === 27) {
            togglePopup(true);
          }
        });
      }
    };
  }]);

  globalFooterModule.controller('GlobalFooterController',['$scope', '$rootScope', 'EaseConstantFactory',
    'EASEUtilsFactory', 'EaseLocalizeService', 'appCookie', 'contentOneFactory', 'ContentConstant', 'EaseConstant',
    'featureToggleFactory', 'pubsubService', '$window', '$timeout','customerPlatformDetailsFactory', '$state',
    'languagePreferencesFactory',
    function($scope, $rootScope, EaseConstantFactory, EASEUtilsFactory, EaseLocalizeService,
             appCookie, contentOneFactory, ContentConstant, EaseConstant, featureToggleFactory, pubsubService,$window,
             $timeout,	customerPlatformDetailsFactory, $state, languagePreferencesFactory) {
      var vm = this;
      vm.isFeedbackButtonDisplay = false;

      $rootScope.$on('featureToggleReady', function() {
        var featureToggleData = featureToggleFactory.getFeatureToggleData();
        vm.isFeedbackButtonDisplay = featureToggleData[EaseConstant.features.usabillaFeature];
      });

      $rootScope.$on('customerPlatFormReady', function() {
        var data = customerPlatformDetailsFactory.getCustomerPlatformData();
        vm.isFullSiteLink = data.customerPlatform.indexOf('EASEM') === -1 &&
          data.customerPlatform.indexOf('EASEW') > -1;
        if (vm.isFullSiteLink) {
          vm.fullSiteUrl = data.fullsiteUrl;
        }
        vm.termsAndCondition = data.customerPlatform.indexOf('EASEM') === -1 &&
          data.customerPlatform.indexOf('EASEW') === -1 &&
          data.customerPlatform.indexOf('EASE') > -1;
      });

      contentOneFactory.initializeContentOneData(
        ContentConstant.kGlobalFooter, null, languagePreferencesFactory.currentLocale).then(function(data) {
          var languagePref = languagePreferencesFactory.currentLocale.replace('-', '_');
          vm.contentDataGlobalFooter = data[ContentConstant.kCoreGlobalFooter + languagePref];
          vm.house = EaseConstant.easeFooterOptions.house;
          vm.norton = EaseConstant.easeFooterOptions.norton;
          vm.fdic = EaseConstant.easeFooterOptions.fdic;
          vm.disclaimer = data[ContentConstant.kCoreGlobalFooterArticle + languagePref].article.section.body;
        });

      $scope.service = EASEUtilsFactory;
      $scope.$watch('service.IsFooterDisplayValue', function(newVal) {
        vm.IsDisplayFooter = newVal;
      });

      angular.extend(vm, {
        displayFooter: function() {
          if ($state.current.name === EaseConstant.states.kVerify) {
            return '';
          } else {
            return '/ease-ui/dist/features/GlobalFooter/html/GlobalFooter-index.html';
          }
        },
        termsAndConditionLink: function() {
          if (vm.contentDataGlobalFooter !== undefined) {
            if (vm.termsAndCondition) {
              return vm.contentDataGlobalFooter['ease.core.footer.beta.terms.link'];
            } else {
              return vm.contentDataGlobalFooter['ease.core.footer.terms.link'];
            }
          }
        },
        createCookie: function() {
          pubsubService.pubsubTrackAnalytics({
            name: 'full site:link'
          });
          appCookie.create('easeBetaOptOut', 'true');
          appCookie.erase('C1_TARGET');
          appCookie.erase('C1_DEEPLINK');
        },
        currentYear: new Date().getFullYear(),
        openFeedback: function() {
          'usabilla_live' in $window && $window.usabilla_live('click');
        }
      });
    }]);

  return globalFooterModule;
});
