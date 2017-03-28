define(['angular'], function (angular) {
  'use strict';

  var payOffQuoteDateModule = angular.module('payOffQuoteDateModule', ['EaseProperties', 'easeAppUtils', 'restangular']);

  payOffQuoteDateModule.controller('PayOffQuoteDateController',
    function ($scope, $controller, accountDetailsData, EaseConstant, $state, HomeLoansUtils, data, $filter,
              homeLoansAccountDetailsService) {

      var vm = this;
      var i18nHL = homeLoansAccountDetailsService.getI18n();

      vm.inlineOptions = {
        format_day_title: 'MMMM YYYY',
        min_date: data.payoffQuoteStartDate + 'T05:00:00.00-04:00',
        max_date: data.payoffQuoteEndDate + 'T05:00:00.00-04:00'
      };

      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      var afterTomorrow = new Date();
      afterTomorrow.setDate(tomorrow.getDate() + 1);

      angular.extend(vm, {
        focusClass: 'loanDetailsLink',
        initClose: false,
        modalType: 'payOffQuoteModal',
        modalClass: 'modalIcon',
        disableGetQuote:true,
        format: 'MMMM dd, yyyy',
        close: function () {
          HomeLoansUtils.landingPageEvent();
          $state.go('^');
        },
        dateFormat: 'MMMM dd, yyyy',
        accountDetails: accountDetailsData.accountDetails,
        quoteStartDate:data.payoffQuoteStartDate,
        quoteEndDate:data.payoffQuoteEndDate,
        selectedDate:null,
        payOffQuoteFailureReason:'',
        invalidData:false,
        ariaLabelPayOffQuoteButton: i18nHL.payOffQuote.ariaLabelPayOffQuoteButtonEnabled,
        getPayOffQuote: function(showDatePicker){
          var selectedPayOffQuoteDate = $filter('date')(vm.selectedDate, 'yyyy-MM-dd');
          console.log("selecteddate by customer "+ vm.selectedDate);
          accountDetailsData.payOffQuoteSelectedDate= selectedPayOffQuoteDate;
          accountDetailsData.payOffQuoteEndDate = vm.quoteEndDate;
          accountDetailsData.payOffQuoteStartDate = vm.quoteStartDate;
          accountDetailsData.showDatePicker = showDatePicker;
          //$scope.focusId = evt.target.id;
          $state.go("HomeLoansDetails.transactions.payOffQuoteOpen");
        },
        setPayOffQuoteFailure: function(disableButton, errorMessage){
          vm.payOffQuoteFailureReason = errorMessage;
          vm.disableGetQuote = disableButton;
        },
        isGetQuoteDisabled: function(){
          return vm.disableGetQuote;
        },
        enableGetQuote: function(evt){
          if(vm.selectedDate != null) {
            vm.disableGetQuote = vm.invalidData;
          }
        },
        checkForSingleDate: function(){
          if(data.payoffQuoteStartDate === data.payoffQuoteEndDate){
            console.log('dates are equal, go to the PDF view');
            vm.selectedDate = new Date(data.payoffQuoteStartDate);
            vm.getPayOffQuote(false);
          }
        }
      });

      vm.checkForSingleDate();

    });

  return payOffQuoteDateModule;
});
