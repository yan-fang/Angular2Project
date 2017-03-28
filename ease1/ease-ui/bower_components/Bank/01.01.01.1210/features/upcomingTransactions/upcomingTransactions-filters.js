define(['angular'], function (angular) {
  'use strict';

  angular
      .module('BankModule')
      .filter('truncate', getEllipsisText);

  //------------------------------------------ Filters -----------------------------------------------------------------
  getEllipsisText.$inject = [ '$filter', '$locale'];
  function getEllipsisText($filter, locale) {

    return truncateFilter;

    function truncateFilter(textToTruncate, length){
      var ellipsisText = textToTruncate;
      var lengthToTruncate = length || 19;
      if (textToTruncate && textToTruncate.length > lengthToTruncate) {
        ellipsisText = textToTruncate.substr(0,lengthToTruncate-3) + "...";
      }
      return ellipsisText;
    }
  }
});
