define(['noext!/ease-ui/bower_components/AutoLoan/ver01.01.01.1566/directives/autoloan-carousel/autoloan-carousel.controller.js?'],
  function(autoLoanCarouselController) {
    'use strict';

    function autoLoanCarouselDirective() {

      return {
        restrict: 'E',
        templateUrl: '/ease-ui/bower_components/AutoLoan/ver01.01.01.1566/directives/autoloan-carousel/partials/autoloan-carousel.html',
        scope: {
          carouselModel: '='
        },
        controller: autoLoanCarouselController,
        controllerAs: 'vm',
        bindToController: true
      };
    }

    return autoLoanCarouselDirective;
  });
