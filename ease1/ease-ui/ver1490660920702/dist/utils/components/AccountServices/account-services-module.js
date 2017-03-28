define(['angular'], function (angular) {
  'use strict'

  var accountServiceModule = angular.module('accountServicesModule', [])
    .controller('AccountServicesCtrl', AccountServicesCtrl)
    .factory('AccountServicesModel', AccountServicesModel)

  function AccountServicesCtrl ($scope, $state, AccountServicesModel) {
    // this.accountServices = accountServicesData
    var accountServicesCtrl = this
    // Controller properties
    angular.extend(accountServicesCtrl, {
      initClose: false,
      // Replace with actual icon when we get one..
      modalClass: 'icon-account-services',
      modalType: 'accountServicesPane'
    })

    // Controller methods
    angular.extend(accountServicesCtrl, {
      close: function () {
        $state.go('^')
      },
      getServiceId: function (index, title) {
        // Remove all spaces, Id attribute should not have spaces.
        title = title.replace(/\s+/g, '')
        return title + index
      }
    })

    // Get the data and give it controller
    accountServicesCtrl.accountServicesData = AccountServicesModel.getListOfAccountServices()
  }
  AccountServicesCtrl.$inject = ["$scope", "$state", "AccountServicesModel"];

  function AccountServicesModel () {
    return {
      // Retrive available account services related to given account
      getListOfAccountServices: function () {
        // [TODO][SD]: This should vary from each LoB or account. Right now there is no API for this.
        var accountServices = [{
          'title': 'Document',
          'services': ['Statements', 'Download Transactions', 'Reward Summary', 'Credit Card Agreement']
        }, {
          'title': 'Payment Settings',
          'services': ['Manage Auto Pay', 'Payment Accounts', 'Change Due Date', 'Secured Credit Deposit']
        }, {
          'title': 'Account Management',
          'services': ['Activate a Card', 'Combine two Accounts', 'Authorized Users', 'Update Income', 'Overlimit Preferences', 'Mobile 2 way', 'Close Account']
        }, {
          'title': 'Upgrades',
          'services': ['Credit Line Increase', 'Balance Transfer', 'Image Card', 'Swap Card']
        }, {
          'title': 'Security',
          'services': ['Report Lost, Stolen or damaged card', 'Set Travel Notification', 'Electronic Fraud Information(eFIF)']
        }]
        return accountServices
      }
    }
  }

  return accountServiceModule
});