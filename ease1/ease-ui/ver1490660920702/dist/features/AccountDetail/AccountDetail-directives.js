define(['angular'], function(angular) {
  'use strict';
  angular.module('AccountDetailsModule')
    .directive('sampleDirective', ['EASEUtilsFactory', function(EASEUtilsFactory) {
      return {
        scope: { controllerFunction: '&callbackFn' },
        link: function(scope, element, attrs) {
          scope.controllerFunction({ arg1: 1 });
        }
      };

    }])
    .directive('accountDetailsNextAcct', ['EaseConstant', '$state', 'EASEUtilsFactory', 'pubsubService',
      function(EaseConstant, $state, EASEUtilsFactory, pubsubService) {
        return {
          restrict: 'AE',
          template: '<div><button aria-label="{{i18n.nextAriaLabel}}" class="next_prev next_acct"' +
            'ng-hide="carouselControls.showRightArrow.isRightNavigable"><img src="{{::nextButtonImg}}" ' +
            ' alt="{{i18n.nextImageAltText}}" ></button></div>',
          link: function(scope, elem) {
            scope.nextButtonImg = EaseConstant.nextButtonImg;
            elem.bind('click', function() {
              pubsubService.pubsubCarouselClicked({ 'name': 'next:carousel' });
              scope.carouselLoadingClass = EaseConstant.loading;
              var element = scope.carouselControls.showRightArrow.account;

              var stateObject = EASEUtilsFactory.getStateDetailsObject(element);

              $state.go(EASEUtilsFactory.SelectDetailsTransaction(element).lobType +
                'Details.transactions', stateObject);
            });
          }
        };
      }
    ])
    .directive('accountDetailsPrevAcct', ['EaseConstant', '$state', 'EASEUtilsFactory', 'pubsubService',
      function(EaseConstant, $state, EASEUtilsFactory, pubsubService) {
        return {
          restrict: 'AE',
          template: '<div><button aria-label="{{i18n.prevAriaLabel}}" class="next_prev prev_acct" ' +
            ' ng-hide="carouselControls.showLeftArrow.isLeftNavigable"><img src="{{::prevButtonImg}}" ' +
            ' alt="{{i18n.prevImageAltText}}" ></button></div>',
          link: function(scope, elem) {
            scope.prevButtonImg = EaseConstant.prevButtonImg;
            elem.bind('click', function() {
              pubsubService.pubsubCarouselClicked({ 'name': 'previous:carousel' });
              scope.carouselLoadingClass = EaseConstant.loading;

              var element = scope.carouselControls.showLeftArrow.account;

              var stateObject = EASEUtilsFactory.getStateDetailsObject(element);

              $state.go(EASEUtilsFactory.SelectDetailsTransaction(element).lobType +
                'Details.transactions', stateObject);
            });
          }
        };
      }
    ])
    .directive('transactionDate', ['dateFilter', function(dateFilter) {
      return {
        restrict: 'AE',
        template: '<span class="right-col month">{{month}}</span><span class="right-col day">{{day}}</span>',
        link: function(scope, element, attrs) {
          scope.month = dateFilter(attrs.transactionDate, 'MMM');
          scope.day = dateFilter(attrs.transactionDate, 'dd');
        }
      };
    }]);
});
