define(['angular'], function (angular) {
    'use strict';

    angular
        .module('BankModule')
        .service('BankMoreServicesService', BankMoreServicesService);

    BankMoreServicesService.$inject = [ 'BankMoreServicesConstants',
                                        'RetailMoreServicesConstants',
                                        'BankMoreServicesEligibilityConstants'];
    function BankMoreServicesService(BankMoreServicesConstants, RetailMoreServicesConstants, BankMoreServicesEligibilityConstants) {
        function getMoreServicesConstant(accountData) {
            if(accountData.subCategory && 'retail' === accountData.subCategory){
                return RetailMoreServicesConstants;
            }
            return BankMoreServicesConstants;
        }

        /*
         * getEligibilityOptions
         *
         * for the key matching accountType in BankMoreServicesEligibilityConstants,
         * it gets the value, which is an array of strings that correspond to eligible
         * moreAccountServices features and returns an object whose keys match features
         * and values are set to true.
         *
         * @param accountType String   type of bank account
         * @return {Object}
         */

        function getEligibilityOptions(accountType) {
          return _.zipObject( BankMoreServicesEligibilityConstants[accountType],
                               _.fill( Array( BankMoreServicesEligibilityConstants[accountType].length ), true) );
        }

        return {
            getMoreServicesConstant: getMoreServicesConstant,
            getEligibilityOptions : getEligibilityOptions
        };
    }
});
