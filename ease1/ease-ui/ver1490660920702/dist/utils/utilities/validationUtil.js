define(['angular'], function(angular) {
  'use strict';

  var validationModule = angular.module('easeAppUtils');
  validationModule.factory('validationDataService', [function() {
    var regExpForUserName = /^[a-zA-Z0-9_-]*$/;
    var regExpForPassword = /^(?=[a-zA-Z0-9~@#$^*()_+=[\]{}|\\,.?: -]*$)(?!.*[<>'"/;`%])/;
    var regExpSanitize = /<script>.*(<\/script>?)?/gi;
    return {
      getPatternForUserName: function() {
        return regExpForUserName;
      },
      getPatterForPassword: function() {
        return regExpForPassword;
      },
      isValidUserName: function(data) {
        return regExpForUserName.test(data);
      },
      isValidPassword: function(data) {
        return regExpForPassword.test(data);
      },
      sanitizeInputData: function(data) {
        return data.replace(regExpSanitize, '');
      }
    };
  }]);
});
