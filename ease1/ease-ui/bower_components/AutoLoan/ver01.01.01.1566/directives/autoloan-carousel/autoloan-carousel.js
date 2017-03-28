define(['angular',
    'noext!/ease-ui/bower_components/AutoLoan/ver01.01.01.1566/directives/autoloan-carousel/autoloan-carousel.directive.js?'],
  /**
   *
   * @param angular
   * @param autoloanCarouselDirective
   * @returns {*}
   */
  function(angular,
           autoloanCarouselDirective) {
    'use strict';

    return angular.module('AutoloanCarouselModule', [])
      .directive('autoloanCarouselDirective', autoloanCarouselDirective);
  });
