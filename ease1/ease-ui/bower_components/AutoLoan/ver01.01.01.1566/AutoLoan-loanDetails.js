define(['angular'], function(angular) {
  'use strict';

  var AutoLoanDetailsModule = angular.module('AutoLoanDetailsModule',
    ['EaseProperties', 'easeAppUtils', 'restangular']);

  AutoLoanDetailsModule.service('autoLoanDetailsService', function() {
    this.getLastYear = function() {
      return new Date().getFullYear() - 1;
    };

    this.getDisplayDayOfMonth = function(dateString) {
      var suffix;
      if (dateString) {
        var day = new Date(dateString).getUTCDate();

        if (day === 1 || day === 21 || day === 31) {
          suffix = 'st';
        } else if (day === 2 || day === 22) {
          suffix = 'nd';
        } else if (day === 3 || day === 23) {
          suffix = 'rd';
        } else {
          suffix = 'th';
        }
        return day + suffix + ' of the Month';
      }
    };
  });

  AutoLoanDetailsModule.controller('AutoLoanDetailsController',
    ['$scope', '$controller', 'accountDetailsData', '$state', 'autoLoanDetailsService',
      'pubsubService', 'i18nData',
      function($scope, $controller, accountDetailsData, $state, autoLoanDetailsService, pubsubService, i18nData) {

        var vm = this;
        vm.i18n = i18nData;

        angular.extend(vm, {
          focusClass: 'loanDetailsLink',
          initClose: false,
          modalType: 'loanDetailsModal',
          modalClass: 'icon-info',
          close: function() {

            pubsubService.pubsubTrackAnalytics({
              taxonomy: {
                level1: 'ease',
                level2: 'account details',
                level3: '',
                level4: '',
                level5: '',
                country: 'us',
                language: 'english',
                system: 'ease_web'
              },
              lob: 'coaf'
            });

            $state.go('AutoLoanDetails.transactions', {}, {location: 'replace'});
          },
          dateFormat: 'MMMM dd, yyyy',
          accountDetails: accountDetailsData.accountDetails,
          lastYear: autoLoanDetailsService.getLastYear(),
          dueDate: autoLoanDetailsService.getDisplayDayOfMonth(accountDetailsData.accountDetails.dueDate)
        });

        pubsubService.pubsubTrackAnalytics({
          taxonomy: {
            level1: 'ease',
            level2: 'account details',
            level3: 'loan details',
            level4: '',
            level5: '',
            country: 'us',
            language: 'english',
            system: 'ease_web'
          },
          lob: 'coaf'
        });
      }]);

  return AutoLoanDetailsModule;
});

