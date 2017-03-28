define(['angular'], function(angular) {
  'use strict';
  angular.module('easeAppUtils')
    .factory('customerPlatformDetailsFactory', customerPlatformDetailsFactory);
  customerPlatformDetailsFactory.$inject = ['Restangular', 'EaseConstant', '$q', '$rootScope'];

  function customerPlatformDetailsFactory(Restangular, EaseConstant, $q, $rootScope) {

    var customerPlatformData = {};

    function getCustomerPlatformData() {
      return customerPlatformData;
    }

    function initializeCustomerPlatform() {
      var deferred = $q.defer();
      if (customerPlatformData.fromServer) {
        deferred.resolve(customerPlatformData);
      } else {
        Restangular.setBaseUrl(EaseConstant.baseUrl);

        var url = 'customer/customerPlatformDetails';

        var customerPlatformRestService = Restangular.one(url);

        customerPlatformRestService.get()
          .then(function successfulResolver(data) {
            customerPlatformData=data;
            deferred.resolve(data);
            console.log('Customer Platform Rest call Success');
            $rootScope.$emit('customerPlatFormReady', data);
          })
          .catch(function rejectResolver(ex) {
            deferred.reject();
            console.log('Customer Platform Rest call Failure - ' + ex.statusMessage);
          });
      }
      return deferred.promise;
    }
    var factory = {
      getCustomerPlatformData: getCustomerPlatformData,
      initializeCustomerPlatform: initializeCustomerPlatform
    };
    return factory;
  }
});
