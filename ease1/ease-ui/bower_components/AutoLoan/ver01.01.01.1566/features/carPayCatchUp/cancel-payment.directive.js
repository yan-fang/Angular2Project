define([],
  function() {
    'use strict';

    function cancelPaymentDirective() {
      var controller = function() {

        this.cancelPaymentContent = {
          title: 'Are you sure?',
          description: 'Canceling this payment will break your plan',
          paymentDateLabel: 'Payment Date',
          dateOfPayment: 'August 20, 2017',
          payFromLabel: 'Pay From',
          accountPayFrom: '{ Capital One  ...0544}',
          payAmountLabel: 'Pay Amount',
          amountToPay: '$470.78',
          editPlanDescription: 'Did you know you can edit your plan if you need to adjust payment amounts and dates?',
          buttonEditMyPlan: 'Edit My Plan',
          buttonCancelPayment: 'Cancel This Payment'
        };
      };

      return {
        restrict: 'E',
        templateUrl: '/ease-ui/bower_components/AutoLoan/ver01.01.01.1566/features/carPayCatchUp/partial/cancel-payment.tpl.html',
        scope: {
          content: '='
        },
        controller: controller,
        controllerAs: 'vm',
        bindToController: true
      };
    }

    return cancelPaymentDirective;
  });
