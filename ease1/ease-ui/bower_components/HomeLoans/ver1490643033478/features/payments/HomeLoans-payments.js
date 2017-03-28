/**
 * Created by wni931 on 12/4/16.
 */
angular.module('UMMPaymentModule', ['easeUIComponents'])
  .controller('PaymentsController', ['homeLoansAccountDetailsService', 'UmmPaymentFactory', '$state', '$rootScope', '$scope', 'close','TemplateSelectionFactory',
    function (homeLoansAccountDetailsService, UmmPaymentFactory, $state, $rootScope, $scope, close,TemplateSelectionFactory) {
      var vm = $scope;
      vm.i18n = homeLoansAccountDetailsService.getI18n();
      vm.close = close;
      var productCategory = homeLoansAccountDetailsService.getProductCategory();
      // has the data from the rest call to the payment accounts v6. getUmmPayments of the OL.
      vm.fromAccounts = UmmPaymentFactory.getUmmData();
      vm.paymentInfo = homeLoansAccountDetailsService.getPaymentInfoData();
      vm.payFrom = {};
      vm.payFrom.required = false;
      vm.payFrom.isReset = false;
      vm.payFrom.isOpen = false;
      vm.productCategory = homeLoansAccountDetailsService.getProductCategory();
      vm.accountRefId = homeLoansAccountDetailsService.getAccountRefId();
      vm.payFrom.items = vm.fromAccounts.availableAccounts;
      vm.effectiveDate = null;
      vm.payFrom.itemsMenu = [];
      vm.payFrom.selectedItem = vm.payFrom.items[0].label;
      vm.onetimepayment = true;
      vm.autopayment = false;
      vm.editFlow = false;
      vm.modalTitle = null;
      vm.showTab = true;
      vm.displayRecurringMsg = false;// this flag determines if transaction is available for the edit.
      vm.existingTransaction = null;
      vm.showOTPMessage = null;
      vm.payFrom.data = {
        id           : 'paymentAccounts',
        placeholder  : 'Choose Account',
        label        : 'Pay From',
        sublabel     : 'Available',
        errorMessage : 'You must select an amount',
        secondaryData: vm.payFrom.items[0].subLabel,
        tertiaryData : vm.payFrom.items[0].amount
      };
      // Function to be called when the payFrom dd is selected
      vm.payFrom.selected = function (item) {
        if (typeof(item) === "object") {
          if (item.label == "+ Add Account") {
            // start the flow for add account
            $state.fromHL = true;
            $state.accountBeingAdded = true;
            vm.close(false);
            if ($state.current.parent.name === 'accountSummary') {
              $state.go('SummAccPrefAddExtAccount');
            } else {
              $state.go($state.current.parent.name + '.AddExtAccount');
            }
          } else {
            vm.payFrom.selectedItem = item.label;
            vm.payFrom.data.secondaryData = item.subLabel;
            vm.payFrom.data.tertiaryData = item.amount;
            vm.selectedAccount  = {
              accntNbr : item.subLabel,
              abaNumber : item.aba
            }
          }
        }
      }
      vm.payFrom.required = true;
      vm.amountOptions = {};

      vm.amountOptions.selected = function (item) {
        if (typeof(item) === "object") {
          vm.amountOptions.selectedItem = item.label;
          var additionalInputAmountText = document.getElementById("ease-input-guide-additionalInputAmount");
          if ((null != vm.additionalInput) && (null != vm.additionalInput.amountText) && (null != additionalInputAmountText)) {
            additionalInputAmountText.value = vm.additionalInput.contentObj.placeholder;
          }
          if(item.label == 'Principal Only' || item.label == 'Partial'){
            vm.amountOptions.data.secondaryData = '';
          } else if(item.label == 'Amount Due + Principal' || item.label == vm.i18n.payment.monthlyAmntDuePrincipal || item.label == 'Amount Due'){
            vm.amountOptions.data.secondaryData = item.amount;
          }
          if (item.label == 'Amount Due + Principal' || item.label == 'Principal Only' || item.label == 'Total Due + Principal' || item.label == vm.i18n.payment.monthlyAmntDuePrincipal) {
            vm.showInputBox = true;
            vm.additionalInput.label = vm.i18n.payment.principalAmnt;
            vm.buttonDisabled = true;
            vm.additionalInput.amountText = null;
            vm.additionalInput.contentObj.validationMsg = null;
          } else if (item.label == 'Partial') {
            vm.additionalInput.label = vm.i18n.payment.otherAmnt;
            vm.showInputBox = true;
            vm.buttonDisabled = true;
            vm.additionalInput.amountText = null;
            vm.additionalInput.contentObj.validationMsg = null;
          } else {
            vm.showInputBox = false;
            vm.buttonDisabled = false;
            vm.additionalInput.amountText = null;
            vm.additionalInput.contentObj.validationMsg = null;
          }
        }
      };
      vm.amountOptions.required = true
      // code for the additional principal payment amount input box
      vm.additionalInput = {};
      vm.additionalInput.amountText = '';
      vm.currency = '$';
      vm.inputType = 'amount';
      vm.additionalInput.contentObj = {
        placeholder: '0.00'
      };
      vm.additionalInput.charLimit = 10;
      vm.additionalInput.status = "";
      vm.additionalInput.id = 'additionalInputAmount'
      vm.additionalInput.label = vm.i18n.payment.principalAmnt;
      // code for the OTP/RP button on the top
      vm.paymentTypeTab = {};
      vm.paymentTypeTab.oneTimePayment = true;
      //send on dropdown
      vm.sendOn = {};

      vm.sendOn.selected = function (item) {
        if (typeof(item) === "object") {
          vm.sendOn.selectedItem = item.label;
        }
      };
      vm.sendOn.required = true;
      //code for the add external account option.
      var addExternalAccount = function () {
        //this method is to add the add External account as one of the options into the payment accounts.
        if (vm.paymentInfo.features.addAccountEnabled) {
          var additionalOption = {
            "label": "+ Add Account"
          };
          return additionalOption;
        }
      };
      /**
       * This method would be invoked when the user selects payFromAccounts.
       * when add account is selected, user will be navigated to the Add Account flow.
       */
      $rootScope.$on('EXT_ACCOUNT_ADDED', function (event, paymentAccount) {
        if ($state.fromHL && $state.accountBeingAdded) {
          $state.accountBeingAdded = false;
          $state.wannaPay = true;
          var paymentParams = {
            'lineOfBusiness': productCategory,
            'accountReferenceId': vm.accountRefId,
            'payment': {
              'isAccountDataAvailable': false,
              'defaultPaymentAccountData': paymentAccount
            }
          };
          if ($state.current.name === 'accountSummary' ||
            ($state.current.parent && $state.current.parent.name === 'accountSummary')) {
            angular.extend(paymentParams, {
              'category'   : paymentParams.lineOfBusiness,
              'subCategory': productCategory,
            });
            TemplateSelectionFactory.payNow(paymentParams);
          } else {
            $state.go('HomeLoanPayment',
              {
                'lineOfBusiness'    : productCategory,
                'accountReferenceId': vm.accountRefId,
                'payment'           : {isAccountDataAvailable: false}
              });
          }
        }
      });
      // Switch between the OTP and Automatic Payments.
      vm.paymentTypeOption = 'onetime';
      vm.populateSendOn = function () {
        var graceDays = vm.paymentInfo.accountDetails.gracePeriodDays;
        if (vm.paymentInfo.accountDetails.paymentFrequency != null && vm.paymentInfo.accountDetails.paymentFrequency == "BiWeekly") {
          //bi-weekly loan.
          graceDays = 0;
        }
        var dataItems = [];
        var dates = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen'];
        var const1 = ' day after due date';
        var const2 = ' days after due date';
        var dueDateConst = 'My due date';
        for (var i = 0; i <= graceDays; i++) {
          if (i == 0) {
            var labelVal = dueDateConst;
            var typeVal = dueDateConst;
            var item = {
              'label'                 : labelVal,
              'type': typeVal, 'value': i
            }
            dataItems.push(item);
          }
          else if (i == 1) {
            var labelVal = dates[i] + const1;
            var typeVal = dates[i] + const1;
            var item = {
              'label'                 : labelVal,
              'type': typeVal, 'value': i
            }
            dataItems.push(item);
          }
          else if (i > 1) {
            var labelVal = dates[i] + const2;
            var typeVal = dates[i] + const2;
            var item = {
              'label'                 : labelVal,
              'type': typeVal, 'value': i
            }
            dataItems.push(item);
          }
        }
        return dataItems;
      }
      vm.initDropDowns = function(){
        /*------------------------------amount options--------------------------------------------- */
        vm.amountOptions.required = false;
        vm.amountOptions.isReset = false;
        vm.amountOptions.isOpen = false;
        vm.amountOptions.items = [];
        vm.amountOptions.data = {
          id           : 'amount-options',
          placeholder  : 'Choose amount',
          label        : 'Amount',
          sublabel     : 'Available',
          errorMessage : 'You must select an amount'
        };
        if (vm.paymentInfo != null && vm.paymentInfo.accountDetails.paymentOptions != null && vm.paymentInfo.accountDetails.paymentOptions.length > 0) {
          vm.amountOptions.items = vm.paymentInfo.accountDetails.paymentOptions;
          vm.amountOptions.itemsMenu = [];
          vm.amountOptions.selectedItem = vm.amountOptions.items[0].label;
          vm.amountOptions.data.secondaryData = vm.amountOptions.items[0].amount;
        } else {
          vm.amountOptions.itemsMenu = [];
          vm.noAmountOptions = true;
          vm.showErrorMessage = true;
          vm.amountOptions.selectedItem = '';
          vm.errorMessage = vm.i18n.payment.apiFailure;
        }
        /*------------------------------send on date--------------------------------------------- */
        vm.sendOn.show = true;
        vm.sendOn.required = false;
        vm.sendOn.isReset = false;
        vm.sendOn.isOpen = false;
        vm.sendOn.items = vm.populateSendOn();
        vm.sendOn.itemsMenu = [];
        vm.sendOn.selectedItem = vm.sendOn.items[0].label;
        vm.sendOn.data = {
          id           : 'sendOn',
          placeholder  : 'Choose Date',
          label        : 'Send On'
        };
        /*------------------------------payment accounts--------------------------------------------- */

      };
      /**
       * Toggle the tab based on the user clicked action. This would hide the relevant details.
       * @param clickedOn
       */
      vm.toggleTab = function (clickedOn) {
        if (clickedOn == 'recurring') {
          vm.autopayment = true;
          vm.modalTitle = (vm.editFlow) ? vm.i18n.payment.updateRecurringPayment : vm.i18n.payment.makeAPaymentLabel;
          vm.onetimepayment = false;
          vm.paymentTypeOption = 'recurring';
          if (vm.paymentInfo.accountDetails.isRecurringPaymentEligible) {
            vm.sendOn.show = true;
            vm.submitButtonText = (vm.editFlow) ? vm.i18n.payment.updateRecurringPayment : vm.i18n.payment.makeAPButton;
            vm.amountOptions.items = [
              {
                "type"  : "amountDue",
                "amount": vm.paymentInfo.accountDetails.basePaymentDueAmount,
                "label" : vm.i18n.payment.monthlyAmnt
              },
              {
                "type"  : "amountDuePrincipal",
                "amount": vm.paymentInfo.accountDetails.basePaymentDueAmount,
                "label" : vm.i18n.payment.monthlyAmntDuePrincipal
              }
            ];
            if ((homeLoansAccountDetailsService.getPaymentSelectedOptions() != null && !homeLoansAccountDetailsService.getPaymentSelectedOptions().fromTransactions) ||
              homeLoansAccountDetailsService.getPaymentSelectedOptions() == null) {
              vm.amountOptions.itemsMenu = [];
              vm.amountOptions.itemsMenu.push(vm.amountOptions.items[0]);
              vm.amountOptions.selectedItem = vm.amountOptions.items[0].label;
              vm.showInputBox = false;
            }
            vm.amountOptions.data.secondaryData = vm.amountOptions.items[0].amount;
          } else {
            vm.autoPayInfoMessage = true;
            vm.displayRecurringMsg = true;
          }
        } else {
          vm.sendOn.show = false;
          vm.paymentTypeOption = 'onetime';
          vm.submitButtonText = (vm.editFlow) ? vm.i18n.payment.updateOTP : vm.i18n.payment.makeOTPButton;
          vm.autopayment = false;
          vm.onetimepayment = true;
          vm.modalTitle = (vm.editFlow) ? vm.i18n.payment.editAPaymentLabel : vm.i18n.payment.makeAPaymentLabel;
          if(!vm.noAmountOptions){
            vm.amountOptions.items = vm.paymentInfo.accountDetails.paymentOptions;
            vm.amountOptions.itemsMenu = [];
            vm.amountOptions.itemsMenu.push(vm.amountOptions.items[0]);
            vm.amountOptions.selectedItem = vm.amountOptions.items[0].label;
            vm.amountOptions.data.secondaryData = vm.amountOptions.items[0].amount;
            if (vm.amountOptions.selectedItem == 'Principal Only'
              || vm.amountOptions.selectedItem == 'Amount Due + Principal' || vm.amountOptions.selectedItem == vm.i18n.payment.monthlyAmntDuePrincipal) {
              vm.showInputBox = true;
              vm.additionalInput.label = vm.i18n.payment.principalAmnt;
            } else if (vm.amountOptions.selectedItem == 'Partial') {
              vm.additionalInput.label = vm.i18n.payment.otherAmnt;
              vm.showInputBox = true;
            } else {
              vm.showInputBox = false;
            }
          } else {
            vm.amountOptions.items = [];
            vm.amountOptions.itemsMenu = [];
            vm.amountOptions.selectedItem = '';
            vm.showErrorMessage = true;
            vm.errorMessage = vm.i18n.payment.apiFailure;
            vm.amountOptions.data.secondaryData = '';
          }
        }
      };
      /**
       * Initialize the data on the modal based on the user action.
       */
      vm.initializeModal = function () {
        vm.initDropDowns();
        vm.effectiveDate = vm.paymentInfo.effectiveDate;
        if (null != vm.paymentInfo.accountDetails.principalBalance) {
        	if (vm.paymentInfo.accountDetails.principalBalance.toString().length <= 5) {
        		vm.additionalInput.charLimit = vm.paymentInfo.accountDetails.principalBalance.toString().length + 4;
        	} 
        	else {
        		vm.additionalInput.charLimit = vm.paymentInfo.accountDetails.principalBalance.toString().length + 5;
        	}
        	
        }
        var paymentSelectedOptions = homeLoansAccountDetailsService.getPaymentSelectedOptions();
        vm.existingTransaction = vm.paymentInfo.transactions[0];
        vm.displayOTPPayMessage = vm.existingTransaction == null && (vm.paymentInfo.accountDetails.isRecurringPaymentEligible == false);
        vm.displayTabularData = vm.existingTransaction != null;
        homeLoansAccountDetailsService.setIsConfirm(false);
        // user is opening up the modal for the first time.
        if (paymentSelectedOptions == null) {
          vm.payFrom.items.push(addExternalAccount());
          vm.showTab = true;
          //recurring payment exists, hence pre-populate to recurring tab.
          if (vm.existingTransaction != null && vm.existingTransaction.isRecurringPaymentDraft) {
            vm.paymentTypeOption = 'recurring';
            vm.displayRecurringMsg = true;
            vm.autoPayExists = true;
            var length = vm.existingTransaction.bankAccountNumber.length;
            vm.existingTransaction.fromAccountNumber4 = vm.existingTransaction.bankAccountNumber.substring(length - 4, length);
            vm.existingTransaction.amountType = (vm.existingTransaction.additionalPrincipalAmount != null && vm.existingTransaction.additionalPrincipalAmount != 0) ? vm.i18n.payment.monthlyAmntDuePrincipal : vm.i18n.payment.monthlyAmnt;
          }
        } else if (paymentSelectedOptions.fromTransactions) {
          vm.payFrom.items.push(addExternalAccount());
          vm.editFlow = true;
          vm.showTab = false;
          vm.paymentTypeOption = paymentSelectedOptions.paymentType;
          vm.amountOptions.selectedItem = paymentSelectedOptions.amountOption;
          vm.showInputBox = !(typeof paymentSelectedOptions.additionalInput == 'undefined' || paymentSelectedOptions.additionalInput == null || paymentSelectedOptions.additionalInput == 0);
          if (vm.showInputBox) {
            vm.additionalInput.amountText = paymentSelectedOptions.additionalInput;
          }
          vm.displayTabularData = false;
          var fromAccntNbr = paymentSelectedOptions.fromAccount;
          var fromAbaNbr = paymentSelectedOptions.fromAbaNumber;
          for (i = 0; i < vm.payFrom.items.length; i++) {
            if (fromAccntNbr.includes(vm.payFrom.items[i].subLabel) && ((fromAbaNbr != null && fromAbaNbr.includes(vm.payFrom.items[i].aba)) || fromAbaNbr == null)) {
              vm.payFrom.itemsMenu = [];
              vm.payFrom.itemsMenu.push(vm.payFrom.items[i]);
              vm.payFrom.selectedItem = vm.payFrom.items[i].label;
              vm.payFrom.data.secondaryData = vm.payFrom.items[i].subLabel;
              vm.payFrom.data.tertiaryData = vm.payFrom.items[i].amount;
            }
          }
        } else {
          vm.editFlow = true;
          vm.showTab = false;//while in edit mode, the user should not be able to switch between tabs
          vm.paymentTypeOption = paymentSelectedOptions.paymentType;
          var fromAccntNbr = paymentSelectedOptions.fromAccount.subLabel;
          var fromAbaNbr = paymentSelectedOptions.fromAbaNumber;
          for (i = 0; i < vm.payFrom.items.length; i++) {
            if (fromAccntNbr.includes(vm.payFrom.items[i].subLabel) && ((fromAbaNbr != null && fromAbaNbr.includes(vm.payFrom.items[i].aba)) || fromAbaNbr == null)) {
              vm.payFrom.itemsMenu = [];
              vm.payFrom.itemsMenu.push(vm.payFrom.items[i]);
              vm.payFrom.selectedItem = vm.payFrom.items[i].label;
              vm.payFrom.data.secondaryData = vm.payFrom.items[i].subLabel;
              vm.payFrom.data.tertiaryData = vm.payFrom.items[i].amount;
            }
          }
          vm.sendOn.selectedItem = paymentSelectedOptions.sendOn.label;
          vm.amountOptions.selectedItem = paymentSelectedOptions.amountOption.label;
          vm.additionalInput.amountText = paymentSelectedOptions.additionalInput;
          vm.showInputBox = (paymentSelectedOptions.amountOption.label == 'Amount Due + Principal'
          || paymentSelectedOptions.amountOption.label == 'Principal Only'
          || paymentSelectedOptions.amountOption.label == 'Partial'
          || paymentSelectedOptions.amountOption.label == 'Total Due + Principal'
          || paymentSelectedOptions.amountOption.label == vm.i18n.payment.monthlyAmntDuePrincipal);
        }
        if(homeLoansAccountDetailsService.getManageAutoPay()){
          vm.paymentTypeOption = 'recurring';
          homeLoansAccountDetailsService.setManageAutoPay(false);
        }
        vm.toggleTab(vm.paymentTypeOption);
        if (vm.autopayment && (paymentSelectedOptions == null || typeof paymentSelectedOptions == 'undefined')) {
          vm.amountOptions.selectedItem = vm.amountOptions.items[0].label;
          vm.amountOptions.data.secondaryData = vm.amountOptions.items[0].amount;
          vm.amountOptions.itemsMenu = [];
        }
        if(!vm.paymentInfo.features.recurringPaymentEnabled){
          vm.showTab = false;
          vm.toggleTab('onetime');
        }
        vm.showPartialAccounts = vm.fromAccounts.partialResponse;
      };
      vm.validateAmount = function () {
        if(vm.paymentInProgress){
          return false;
        } else if(vm.amountOptions.itemsMenu.length == 0){
          return false;
        }

        var returnFlag = true;
        if (vm.amountOptions.itemsMenu[0].type == 'amountDue') {
          return true;
        }
        else if (vm.amountOptions.itemsMenu[0].type == 'amountDuePrincipal' || vm.amountOptions.itemsMenu[0].type == 'principal_Only') {
          var principal = vm.additionalInput.amountText;
          if (principal == '' || principal == undefined) {
            returnFlag = false;
          }else{
            //run for other validations
            principal = principal.toString();
            var amount = parseFloat(principal.replace(/[^0-9.]/g, ''));
            var currentBalance = vm.paymentInfo.accountDetails.principalBalance;
            if (amount > currentBalance || amount <= 0) {
              vm.additionalInput.contentObj.errorMessage = vm.i18n.payment.principalMustBeLessMessage;
              vm.additionalInput.contentObj.errorStatus = 'error';
              returnFlag = false;
            }else{
              returnFlag = true;
              vm.additionalInput.contentObj.errorStatus = '';
              vm.additionalInput.contentObj.errorMessage = '';
            }
          }
        }
        else if (vm.amountOptions.itemsMenu[0].type == 'other'){
          var principal = vm.additionalInput.amountText;
          if (principal == '' || principal == undefined) {
            returnFlag = false;
          }else{
            //run for other validations
            principal = principal.toString();
            var amount = parseFloat(principal.replace(/[^0-9.]/g, ''));
            if (amount >= vm.paymentInfo.accountDetails.totalPaymentDueAmount || amount <= 0) {
              vm.additionalInput.contentObj.errorMessage = vm.i18n.payment.partialPaymentMustBeLessMessage;
              vm.additionalInput.contentObj.errorStatus = 'error';
              returnFlag = false;
            }else{
              returnFlag = true;
              vm.additionalInput.contentObj.errorStatus = '';
              vm.additionalInput.contentObj.errorMessage = '';
            }
          }

        }
        return returnFlag;
      };
      // fix for the EWHL-340
      vm.checkFromAccount = function (){
        if(vm.selectedAccount != null){
          for (i = 0; i < vm.payFrom.items.length; i++) {
            if (vm.selectedAccount.accntNbr.includes(vm.payFrom.items[i].subLabel) && vm.selectedAccount.abaNumber.includes(vm.payFrom.items[i].aba)) {
              vm.payFrom.itemsMenu = [];
              vm.payFrom.itemsMenu[0] = vm.payFrom.items[i];
              vm.payFrom.selectedItem = vm.payFrom.items[i].label;
              vm.payFrom.data.secondaryData = vm.payFrom.items[i].subLabel;
              vm.payFrom.data.tertiaryData = vm.payFrom.items[i].amount;
              break;
            } else {
              vm.payFrom.itemsMenu = [];
            }
          }
        }
      };

      vm.initializeModal();
      /**
       * post the payment..
       */
      vm.makePayment = function () {
        vm.paymentInProgress = true;
        vm.buttonDisabled = true;
        vm.submitButtonText = "";
        var totalPaymentDue = null;
        if (vm.amountOptions.itemsMenu[0].type == 'amountDue' || vm.amountOptions.itemsMenu[0].type == 'amountDuePrincipal') {
          totalPaymentDue = parseFloat(vm.amountOptions.itemsMenu[0].amount.toString().replace(/[^0-9.]/g, ''));
        } else if (vm.amountOptions.itemsMenu[0].type == 'principal_Only') {
          totalPaymentDue = 0;
        } else if (vm.amountOptions.itemsMenu[0].type == 'other') {
          totalPaymentDue = parseFloat(vm.additionalInput.amountText.toString().replace(/[^0-9.]/g, ''));
        }
        var additionalInput = ((vm.amountOptions.itemsMenu[0].type == 'principal_Only') || (vm.amountOptions.itemsMenu[0].type == 'amountDuePrincipal')) ? parseFloat(vm.additionalInput.amountText.toString().replace(/[^0-9.]/g, '')) : null;
        vm.checkFromAccount();
        var selectedFromAccount = vm.payFrom.itemsMenu[0];
        var paymentSetupRequest = {
          "paymentOption"            : (vm.amountOptions.itemsMenu[0].type == 'principal_Only') ? "principalOnly" : vm.amountOptions.itemsMenu[0].type,
          "paymentDate"              : vm.paymentInfo.effectiveDate,
          "totalPaymentAmount"       : totalPaymentDue,
          "principalPaymentAmount"   : additionalInput,
          "productType"              : productCategory,
          "paymentType"              : vm.paymentTypeOption,
          "additionalPrincipalAmount": additionalInput,
          "paymentDraftDelayDays"    : vm.sendOn.itemsMenu[0].value,
          "paymentAccountInfo"       : {
            "abaNumber"            : selectedFromAccount.aba,
            "accountReferenceId"   : selectedFromAccount.referenceId,
            "accountHolderFullName": vm.paymentInfo.accountDetails.primaryBorrowerName,
            "accountType"          : selectedFromAccount.accountType,
            "accountName"          : selectedFromAccount.label,
            "isInternalAccount"    : selectedFromAccount.isInternalAccount
          },
          "paymentDueInfo"           : {
            "totalPaymentDueAmount"     : vm.paymentInfo.accountDetails.totalPaymentDueAmount,
            "lateChargeBalance"         : vm.paymentInfo.accountDetails.lateChargeBalance,
            "pastDueAmount"             : vm.paymentInfo.accountDetails.pastDueAmount,
            "nextPaymentDate"           : vm.paymentInfo.accountDetails.nextPaymentDate,
            "basePaymentDueAmount"      : vm.paymentInfo.accountDetails.basePaymentDueAmount,
            "suspenseBalance"           : vm.paymentInfo.accountDetails.suspenseBalance,
            "escrowDueAmount"           : vm.paymentInfo.accountDetails.escrowDueAmount,
            "mortgageInsuranceDueAmount": vm.paymentInfo.accountDetails.mortgageInsuranceDueAmount,
            "optionalInsuranceDueAmount": vm.paymentInfo.accountDetails.optionalInsuranceDueAmount
          }
        };
        if (vm.editFlow) {
          var paymentSuccessData = homeLoansAccountDetailsService.getPaymentsSuccess();
          homeLoansAccountDetailsService.editHomeLoansPayment(vm.accountRefId,
            paymentSuccessData.paymentDate, productCategory, paymentSuccessData.isExternal,
            paymentSetupRequest, paymentSuccessData.transactionId, paymentSuccessData.transactionId).then(function(data){
              vm.paymentInProgress = false;
              var paymentAmountSum = data.totalPaymentReceivedAmount + data.additionalPrincipalAmount;
              var paymentConfimationMessage = {
                "paymentConfirmationNumber" : (data.paymentConfirmationNumber != null) ? data.paymentConfirmationNumber : data.recurringPaymentId,
                "paymentDate"               : (data.paymentDate == null) ? data.nextPaymentDate : data.paymentDate,
                "totalPaymentReceivedAmount": ((data.totalPaymentReceivedAmount == 0 || data.totalPaymentReceivedAmount == null) && data.additionalPrincipalAmount != 0)?data.additionalPrincipalAmount:data.totalPaymentReceivedAmount,
                "totalDueAmount"            : ((data.totalPaymentReceivedAmount == 0 || data.totalPaymentReceivedAmount == null) && data.additionalPrincipalAmount != 0)?data.additionalPrincipalAmount:data.totalPaymentReceivedAmount,
                "monthlyPaymentAmount"      : data.monthlyPaymentAmount,
                "additionalPrincipalAmount" : data.additionalPrincipalAmount,
                "pushedDate"                : data.pushedDate,
                "recurringPaymentId"        : data.recurringPaymentId,
                "transactionId"             : data.transactionId,
                "fromAccountNumber"         : vm.payFrom.itemsMenu[0].subLabel,
                "paymentAmountSum"          : paymentAmountSum,
                "accountName"               : vm.payFrom.itemsMenu[0].label,
                "sendOn"                    : vm.sendOn.itemsMenu[0].label,
                "amountOption"              : vm.amountOptions.itemsMenu[0].label,
                "isExternal"                : !vm.payFrom.itemsMenu[0].isInternalAccount,
                "paymentType"               : vm.paymentTypeOption,
                "editFlow"                  : vm.editFlow,
                "fromTransactions"          : false
              };
              if(vm.amountOptions.itemsMenu[0].type == "amountDuePrincipal"){
                paymentConfimationMessage.totalPaymentReceivedAmount = data.totalPaymentReceivedAmount + data.additionalPrincipalAmount;
              }
              if(vm.amountOptions.itemsMenu[0].type == "other" || vm.amountOptions.itemsMenu[0].type == "principal_Only"){
                paymentConfimationMessage.totalDueAmount = 0;
              }
              var paymentSelectedOptions = {
                "fromAccount"    : vm.payFrom.itemsMenu[0],
                "amountOption"   : vm.amountOptions.itemsMenu[0],
                "sendOn"         : vm.sendOn.itemsMenu[0],
                "additionalInput": vm.additionalInput.amountText,
                "paymentType"    : vm.paymentTypeOption,
                "fromAbaNumber" : vm.payFrom.itemsMenu[0].aba
              };
              $state.reload = true;
              homeLoansAccountDetailsService.setPaymentSelectedOptions(paymentSelectedOptions);
              homeLoansAccountDetailsService.setPaymentsSuccess(paymentConfimationMessage);
              homeLoansAccountDetailsService.paymentSetupSuccess();
              homeLoansAccountDetailsService.setReloadOnError(false);
              vm.close();
            }, function(data){ 
              vm.close();
              homeLoansAccountDetailsService.setPaymentSelectedOptions(null);
              homeLoansAccountDetailsService.setPaymentsSuccess(null);
              homeLoansAccountDetailsService.setReloadOnError(true);
            });
        } else {
          homeLoansAccountDetailsService.postHomeLoansPayment(paymentSetupRequest, vm.accountRefId).then(function(data){
            vm.paymentInProgress = false;
            var paymentAmountSum = data.totalPaymentReceivedAmount + data.additionalPrincipalAmount;
            var paymentConfimationMessage = {
              "paymentConfirmationNumber" : (data.paymentConfirmationNumber != null) ? data.paymentConfirmationNumber : data.recurringPaymentId,
              "paymentDate"               : (data.paymentDate == null) ? data.nextPaymentDate : data.paymentDate,
              "totalPaymentReceivedAmount": ((data.totalPaymentReceivedAmount == 0 || data.totalPaymentReceivedAmount == null) && data.additionalPrincipalAmount != 0)?data.additionalPrincipalAmount:data.totalPaymentReceivedAmount,
              "totalDueAmount"            : ((data.totalPaymentReceivedAmount == 0 || data.totalPaymentReceivedAmount == null) && data.additionalPrincipalAmount != 0)?data.additionalPrincipalAmount:data.totalPaymentReceivedAmount,
              "monthlyPaymentAmount"      : data.monthlyPaymentAmount,
              "additionalPrincipalAmount" : data.additionalPrincipalAmount,
              "pushedDate"                : data.pushedDate,
              "recurringPaymentId"        : data.recurringPaymentId,
              "transactionId"             : data.transactionId,
              "fromAccountNumber"         : vm.payFrom.itemsMenu[0].subLabel,
              "paymentAmountSum"          : paymentAmountSum,
              "accountName"               : vm.payFrom.itemsMenu[0].label,
              "sendOn"                    : vm.sendOn.itemsMenu[0].label,
              "amountOption"              : vm.amountOptions.itemsMenu[0].label,
              "isExternal"                : !vm.payFrom.itemsMenu[0].isInternalAccount,
              "paymentType"               : vm.paymentTypeOption,
              "editFlow"                  : vm.editFlow,
              "fromTransactions"          : false
            };
            if(vm.amountOptions.itemsMenu[0].type == "amountDuePrincipal"){
              paymentConfimationMessage.totalPaymentReceivedAmount = data.totalPaymentReceivedAmount + data.additionalPrincipalAmount;
            }
            if(vm.amountOptions.itemsMenu[0].type == "other" || vm.amountOptions.itemsMenu[0].type == "principal_Only"){
              paymentConfimationMessage.totalDueAmount = 0;
            }
            var paymentSelectedOptions = {
              "fromAccount"    : vm.payFrom.itemsMenu[0],
              "amountOption"   : vm.amountOptions.itemsMenu[0],
              "sendOn"         : vm.sendOn.itemsMenu[0],
              "additionalInput": vm.additionalInput.amountText,
              "paymentType"    : vm.paymentTypeOption,
              "fromAbaNumber" : vm.payFrom.itemsMenu[0].aba
            };
            $state.reload = true;
            homeLoansAccountDetailsService.setReloadOnError(false);
            homeLoansAccountDetailsService.setPaymentSelectedOptions(paymentSelectedOptions);
            homeLoansAccountDetailsService.setPaymentsSuccess(paymentConfimationMessage);
            homeLoansAccountDetailsService.paymentSetupSuccess();
            vm.close();
          }, function(data){
            vm.close();
            homeLoansAccountDetailsService.setPaymentSelectedOptions(null);
            homeLoansAccountDetailsService.setPaymentsSuccess(null);
            homeLoansAccountDetailsService.setReloadOnError(true);
          });
        }
      };

      vm.cancelAutoPay = function () {
        vm.close(true);
        var paymentConfimationMessage = {
          "paymentDate"               : vm.existingTransaction.paymentEffectiveDate,
          "totalPaymentReceivedAmount": vm.existingTransaction.totalPaymentReceivedAmount,
          "additionalPrincipalAmount" : vm.existingTransaction.additionalPrincipalAmount,
          "recurringPaymentId"        : data.recurringPaymentId,
          "transactionId"             : vm.existingTransaction.transactionId,
          "fromAccountNumber"         : vm.existingTransaction.bankAccountNumber,
          "accountName"               : vm.existingTransaction.bankName,
          "isExternal"                : vm.existingTransaction.externalAccount,
          "paymentType"               : 'recurring',
          "fromTransactions"          : false, //TODO this has to be refactored for edit-cancel from success modal
          "reLaunchModal"             : true
        };
        homeLoansAccountDetailsService.setPaymentsSuccess(paymentConfimationMessage);
        homeLoansAccountDetailsService.paymentCancel();
      };
      vm.editAutoPay = function () {
        vm.displayTabularData = false;
        vm.editFlow = true;
        vm.showTab = false;
        vm.displayRecurringMsg = false;
        vm.paymentTypeOption = 'recurring';
        vm.autoPayExists = true;
        homeLoansAccountDetailsService.trackAnalytics('edit payment', 'recurring', '');
        if(vm.existingTransaction.fromAccountNumber4 != null){
          var fromAbaNbr = vm.existingTransaction.bankAbaNumber;
          for (i = 0; i < vm.payFrom.items.length; i++) {
            if (vm.existingTransaction.fromAccountNumber4.includes(vm.payFrom.items[i].subLabel) && ((fromAbaNbr != null && fromAbaNbr.includes(vm.payFrom.items[i].aba)) || fromAbaNbr == null)) {
              vm.payFrom.itemsMenu = [];
              vm.payFrom.itemsMenu[0] = vm.payFrom.items[i];
              vm.payFrom.selectedItem = vm.payFrom.items[i].label;
              vm.payFrom.data.secondaryData = vm.payFrom.items[i].subLabel;
              vm.payFrom.data.tertiaryData = vm.payFrom.items[i].amount;
              break;
            } else {
              vm.payFrom.itemsMenu = [];
            }
          }
        }

        if (vm.payFrom.itemsMenu[0] == null) {
          vm.payFrom.itemsMenu[0] = vm.payFrom.items[0];
          vm.payFrom.selectedItem = vm.payFrom.items[0].label;
        }
        vm.sendOn.selectedItem = vm.sendOn.itemsMenu[0].label;
        if (vm.existingTransaction.additionalPrincipalAmount != null && vm.existingTransaction.additionalPrincipalAmount != 0) {
          vm.amountOptions.selectedItem = vm.i18n.payment.monthlyAmntDuePrincipal;
          vm.showInputBox = true;
          vm.additionalInput.amountText = vm.existingTransaction.additionalPrincipalAmount;
        } else {
          vm.amountOptions.selectedItem = vm.i18n.payment.monthlyAmnt;
          vm.showInputBox = false;
          vm.additionalInput.amountText = "";
        }
        var paymentSuccessData = {
          "paymentDate"  : vm.existingTransaction.paymentEffectiveDate,
          "isExternal"   : vm.existingTransaction.externalAccount,
          "transactionId": vm.existingTransaction.transactionId
        };
        vm.submitButtonText = vm.i18n.payment.updateRecurringPayment;
        vm.modalTitle = vm.i18n.payment.updateRecurringPayment;
        homeLoansAccountDetailsService.setPaymentsSuccess(paymentSuccessData);
      };
    }]);
