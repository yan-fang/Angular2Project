define([], function() {
  'use strict';

  autoLoanPaymentPayoffUtil.$inject = ['$state', '$filter', 'autoLoanModuleService', 'UmmPaymentFactory',
    'refreshTransactionsService', 'autoLoanPaymentService'];

  function autoLoanPaymentPayoffUtil($state, $filter, autoLoanModuleService, UmmPaymentFactory,
                                     refreshTransactionsService, autoLoanPaymentService) {
    var COAF_CREATE_PAYOFF = '50006';
    this.populatePayoffAmountAndDateList = function(ummData) {
      var ummData = UmmPaymentFactory.getUmmData();
      var payoffAmountAndDateList = [];
      for (var index = 0; index < ummData.availableDates.entries.length; index++) {
        var item = ummData.availableDates.entries[index];
        var effectiveDate = item.paymentDate;
        var payoffAmount = item.payOffAmount;

        var display = $filter('date')(effectiveDate, 'longDate') + ' (' + $filter('currency')(payoffAmount) + ')';
        payoffAmountAndDateList.push({
          'effectiveDate': effectiveDate,
          'payoffAmount': payoffAmount,
          'display': display,
          'date': $filter('date')(effectiveDate, 'yyyy-MM-dd')
        });
      }
      return payoffAmountAndDateList;
    };


    this.verifyPayoff = function($scope, controller) {
      var payoffDetail = {
        'bankDetail': {
          'abaNumber': controller.from.abaNumber,
          'bankAccountNumber': controller.from.accountNumber.trim(),
          'accountType': controller.from.accountType.toUpperCase(),
          'bankName': controller.from.displayName
        }
      };

      if (controller.from.paymentAccountReferenceId) {
        payoffDetail.paymentAccountReferenceId = controller.from.paymentAccountReferenceId;
      }

      var bankDetail = payoffDetail.bankDetail;
      payoffDetail.payFromText = autoLoanPaymentService.formatPayFrom(bankDetail.bankName,
        bankDetail.bankAccountNumber);
      payoffDetail.paymentDate = controller.selectPayoffDetails.effectiveDate;
      payoffDetail.payoffAmount = controller.selectPayoffDetails.payoffAmount;
      payoffDetail.bankName = bankDetail.bankName;


      $scope.$modalCancel();
      autoLoanModuleService.setPayoffDetails(payoffDetail);
      if ($state.current.parent) {
        // payoff confirm page is stateless so changing URL back to parent allows
        // Edit to work
        $state.go($state.current.parent.name);
      }
      autoLoanModuleService.payoffConfirm();
    };


    this.submitPayoffPayment = function($scope, controller) {
      $scope.disabled = true;
      $scope.spinnerEnable = true;

      var payoffDetails = autoLoanModuleService.getPayoffDetails();

      var paymentInstruction = {
        'scheduleDate': payoffDetails.paymentDate,
        'paymentAmount': [
          {
            'paymentAmount': payoffDetails.payoffAmount,
            'paymentTerm': 'Payoff_Amount'
          }
        ]
      };

      if (payoffDetails.paymentAccountReferenceId) {
        paymentInstruction.paymentAccountReferenceId = payoffDetails.paymentAccountReferenceId;
      } else {
        paymentInstruction.bankDetail = {
          'accountType': payoffDetails.bankDetail.accountType,
          'bankAccountNumber_TLNPI': payoffDetails.bankDetail.bankAccountNumber,
          'abaNumber': payoffDetails.bankDetail.abaNumber,
          'accountName': payoffDetails.bankName
        }
      }

      try {

        var accountRefId = autoLoanModuleService.getAccountDetailsData().accountRefId;
        var promise = autoLoanModuleService.postPaymentInstruction(paymentInstruction,
          accountRefId, COAF_CREATE_PAYOFF);


        promise.then(function(data) {
          if (data.notificationMessage != null) {
            controller.errorMessage = data.notificationMessage.text;
            $scope.disabled = false;
            $scope.spinnerEnable = false;
          } else {
            var successData = {
              'payFromText': payoffDetails.payFromText,
              'payoffAmount': payoffDetails.payoffAmount,
              'paymentDate': payoffDetails.paymentDate,
              'confirmCode': data.paymentInstructionId ? data.paymentInstructionId : data.paymentInstructionID,
              'paymentId': data.paymentScheduleId ? data.paymentScheduleId : data.paymentScheduleID,
              'bankName': payoffDetails.bankName
            };

            UmmPaymentFactory.setSuccessData(successData);
            autoLoanModuleService.fetchAccountDetailData(accountRefId).then(function() {
              refreshTransactionsService.refreshTransactions();
              $scope.$modalCancel();
              autoLoanModuleService.makePaymentSuccess(true);
            });
          }
        }, function(failureReason) {
          controller.errorMessage = failureReason.message;
          $scope.disabled = false;
          $scope.spinnerEnable = false;

        });

      } catch (error) {
        $scope.disabled = false;
        $scope.spinnerEnable = false;

      }
      return false;

    };
  }

  return {
    'autoLoanPaymentPayoffUtil': autoLoanPaymentPayoffUtil
  }
});
