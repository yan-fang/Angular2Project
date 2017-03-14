define(['angular'], function (angular) {
  'use strict';
  angular
    .module('BankModule')
    .directive('slickSlider', function slickSlider(BankUpcomingConstants, $timeout, $templateRequest, BankFiles, UpcomingHelpersFactory) {
      return {
        restrict: 'A',
        scope: {'afterChange': '&', 'totalCards': '=', 'showAddTransactionCard': '=', 'toggleStatus': '='},
        link: function (scope, element, attrs) {

          $timeout(function(){
            UpcomingHelpersFactory.carouselArrowButtonStateCheck('.bankUpcomingTransactionsCards');
          }, 250);

          // introducing timeout of 5 seconds to render the carousel
          $timeout(function() {
            if(scope.afterChange) {
              $(element).on('afterChange', function(slick, currentSlide) {
                scope.afterChange({"slick": slick, "currentSlide": currentSlide});

                UpcomingHelpersFactory.carouselArrowButtonStateCheck('.bankUpcomingTransactionsCards');
              });
            }
            $(element).slick(scope.$eval(attrs.slickSlider));
          });
        }
      }
    });
});
