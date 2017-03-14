define(['angular'], function(angular) {
  'use strict';
  angular
      .module('BankModule')
      .factory('BankAccountUtilities', BankAccountUtilities);

  BankAccountUtilities.$inject = ['$stateParams'];
  function BankAccountUtilities($stateParams) {

    var accountReferenceId = $stateParams.accountReferenceId;
    var isRetail = false;
    var hybridAccounts = ['4600', '3400'];
    var checkingAccounts = ['4600', '4000', '4300'];
    return {
      getAccountReferenceId : getAccountReferenceId,
      isRetailAccount: isRetailAccount,
      isHybridAccount: isHybridAccount,
      isCheckingAccount: isCheckingAccount,
      resetUtils: resetUtils
    };

    function getAccountReferenceId() {
      //Depending on the entrance to the Bank Module, the factory can be initiated without the stateParams object
      if(!accountReferenceId) {
        accountReferenceId = $stateParams.accountReferenceId;
      }

      return accountReferenceId;
    }

    function isRetailAccount(subCategory) {
      isRetail = (subCategory && subCategory.toLowerCase() === 'retail') ? true : isRetail;
      return isRetail;
    }

    /*
     * isHybridAccount(productId)
     *
     * TotalControlChecking(4600) and ConfidentSavingsAccounts (3400)
     * are hybrid accounts in that, they are marketed to retail customers
     * and customers sign up for it in branches, but the back end of these
     * products exist in the same fashion as 360 - i.e. profile + FIS
     *
     * @params {string} productId
     * @returns {boolean}
     */
    function isHybridAccount(productId) {
      return hybridAccounts.indexOf(productId) > -1;
    }


    /*
     * isCheckingAccount(productId)
     *
     * Checking type accounts are the only accounts with debit card
     * actions. This would be 360 Checking, Money Market and Kids.
     *
     * @params {string} productId
     * @returns {boolean}
     */
    function isCheckingAccount(productId) {
      return checkingAccounts.indexOf(productId) > -1;
    }

    function resetUtils() {
      accountReferenceId = $stateParams.accountReferenceId;
      isRetail = false;
    }
  }
});
