define('easeLodash', ['angular', 'lodash'], function(angular) {
  'use strict';
  var module = angular.module('angular-lo-dash', []);
  module.service('_', ['$window', function($window) {
    return $window._;
  }]);
  return module;
});
require(['easeLodash']);
