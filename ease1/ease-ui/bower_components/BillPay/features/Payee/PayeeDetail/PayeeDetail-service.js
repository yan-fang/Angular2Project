define(['angular'], function(angular) {
  'use strict';

  angular.module('BillPayModule').factory('PayeeDetailService', PayeeDetailService);

  PayeeDetailService.$inject = [
    'Restangular',
    'BillPayConstants',
    'EaseConstantFactory',
    'easeHttpInterceptor',
    'BillPayErrorHandlerService',
    'EASEUtilsFactory',
    'StringUtils',
    '$q'
  ];
  function PayeeDetailService(
    Restangular,
    BillPayConstants,
    EaseConstantFactory,
    easeHttpInterceptor,
    BillPayErrorHandlerService,
    EASEUtilsFactory,
    StringUtils,
    $q
  ) {
    var payeeDetail = {};

    var api = {
      getPayeeDetail: getPayeeDetail,
      getPayeeDetailFormatted: getPayeeDetailFormatted,
      setPayeeDetail: setPayeeDetail,
      initializePayeeDetail: initializePayeeDetail,
      checkPayeeLastPaymentInfo: checkPayeeLastPaymentInfo,
      checkPayeeLatestScheduledTrx: checkPayeeLatestScheduledTrx,
      deletePayeeDetail: deletePayeeDetail,
      initializePayeeDetailFromPaymentDetail : initializePayeeDetailFromPaymentDetail
    };

    function getPayeeDetail() {
      return payeeDetail;
    }

    /**
     * Returns payee detail in a clean format that can be passed directly into the
     * add payee flow payee service. This lets us reuse those existing methods in the payee
     * service and the add payee controllers. Essentially a mapping function that is the reverse
     * of the generateRequestObject methods in the Payee Service.
     *
     * @returns {object} - Mapped subset of payee detail data
     */
    function getPayeeDetailFormatted() {
      return {
        payeeReferenceId: payeeDetail.payeeReferenceId,
        payeeName: payeeDetail.payeeName,
        isPayeeAddressModifiable: payeeDetail.payeeAddress ? true : false,
        nickname: payeeDetail.payeeNickname || null,
        originalNickname: payeeDetail.payeeNickname || null,
        accountNumber: payeeDetail.accountNumberTLNPI,
        confirmAccountNumber: payeeDetail.accountNumberTLNPI,
        payeeAddress: payeeDetail.payeeAddress || null,
        displayName: payeeDetail.displayName,
        pendingPayments: payeeDetail.scheduledPayments !== null,
        phoneNumber: (payeeDetail.payeePhoneNumber.telephoneNumber || '')
                    .replace(/[^\d]/g, '')
                    .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
      };
    }

    function setPayeeDetail(payee) {
      return angular.copy(payee, payeeDetail);
    }

    function checkPayeeLastPaymentInfo(payee) {
      return !StringUtils.hasEmptyString(
        payee.lastPaymentDate,
        payee.lastPaymentAmount
      );
    }

    function checkPayeeLatestScheduledTrx(payee) {
      return !StringUtils.hasEmptyString(
        payee.latestScheduledTransactionDate,
        payee.latestScheduledTransactionAmount
      );
    }

    function deletePayeeDetail() {
      angular.copy({}, payeeDetail);
    }

    /**
     * This is used to set intial payee detail by performing a call to the OL for a given
     * payee reference ID, then performs all initialization steps. Returns a promise on success
     */
    function initializePayeeDetail(payeeReferenceId, accountReferenceId) {
      var deferred = $q.defer();

      var headers = {
        EVT_SYNCH_TOKEN: EASEUtilsFactory.getSyncId(),
        BUS_EVT_ID: BillPayConstants.PAYEE_DETAIL_EVT_ID
      };

      easeHttpInterceptor.setBroadCastEventOnce('BillPay');
      Restangular.setBaseUrl(EaseConstantFactory.baseUrl());

      Restangular.all(BillPayConstants.billPayPayeeDetailUrl)
        .get(encodeURIComponent(payeeReferenceId), _buildQueryObject(accountReferenceId), headers)
        .then(function success(data) {
          deletePayeeDetail();
          angular.copy(data, payeeDetail);
          deferred.resolve(true);
        }, function error(err) {
          BillPayErrorHandlerService.handleError(err);
          deferred.reject(err);
        });

      return deferred.promise;
    }

    function initializePayeeDetailFromPaymentDetail(paymentDetail) {
      payeeDetail = paymentDetail.payeeInfo;
    }

    function _buildQueryObject(accountReferenceId) {
      return {
        accountReferenceId: accountReferenceId
      };
    }

    return api;
  }
});
