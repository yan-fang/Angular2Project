define(['angular'], function(angular) {
  'use strict';
    angular
        .module('BankModule')
        .factory('UpcomingHelpersFactory', UpcomingHelpersFactory);

        function UpcomingHelpersFactory($state, $stateParams, BankFiles, BankPubSubFactory, EaseConstant, $document) {

        var UpcomingHelpersFactory = {
            getTransactionSource : getTransactionSource,
            getTransactionAmountClass : getTransactionAmountClass,
            getTransactionSign : getTransactionSign,
            isUnscheduledBill : isUnscheduledBill,
            is360Account : is360Account,
            scheduleBillPayment : scheduleBillPayment,
            initTransactionSourceOperationMap : initTransactionSourceOperationMap,
            getTransactionSourceOperationMap : getTransactionSourceOperationMap,
            getUpcomingTransactionDetailsTemplate: getUpcomingTransactionDetailsTemplate,
            toggleCheckDetailsTemplate: toggleCheckDetailsTemplate,
            getTransactionLogo:getTransactionLogo,
            isAmountDue:isAmountDue,
            isActionButtonEnabled:isActionButtonEnabled,
            editTransfer: editTransfer,
            loadingClass: getLoadingClass,
            carouselArrowButtonStateCheck: carouselArrowButtonStateCheck,
            bringFocusBack: bringFocusBack,
            setPartentTarget: setPartentTarget
        };
        var loadingClass = '',
            modalSourceTrigger = '';
        var transactionSourceOperationMap;
        var actionModalTemplateType = {
          'CHECKDEPOSIT_ATM': BankFiles.getFilePath('features/upcomingTransactions/partials/actionModal/upcomingTransactions-cardDetailsCheckDeposit.html'),
          'CHECKDEPOSIT' : BankFiles.getFilePath('features/upcomingTransactions/partials/actionModal/upcomingTransactions-cardDetailsCheckDeposit.html'),
          'CHECKDEPOSIT_BRANCH' : BankFiles.getFilePath('features/upcomingTransactions/partials/actionModal/upcomingTransactions-cardDetailsCheckDeposit.html'),
          'CreditCardPay' :  BankFiles.getFilePath('features/upcomingTransactions/partials/actionModal/upcomingTransactions-cardDetailsCreditCard.html'),
          'TRANSFER_DEPOSIT' : BankFiles.getFilePath('features/upcomingTransactions/partials/actionModal/upcomingTransactions-cardDetailsTransfers.html'),
          'TRANSFER_WITHDRAW' : BankFiles.getFilePath('features/upcomingTransactions/partials/actionModal/upcomingTransactions-cardDetailsTransfers.html'),
          'BILLPAY' : BankFiles.getFilePath('features/upcomingTransactions/partials/actionModal/upcomingTransactions-cardDetailsBillPay.html')
        };
        var upcomingTransactionTypeIcon = {
          'BILLPAY': BankFiles.getFilePath('images/bill_pay_icon.png'),
          'TRANSFER_DEPOSIT': BankFiles.getFilePath('images/transfer-icon.png'),
          'TRANSFER_WITHDRAW': BankFiles.getFilePath('images/transfer-icon.png')
        };

        return UpcomingHelpersFactory;

        function initTransactionSourceOperationMap(i18nUpcomingTransactions) {
          if (! transactionSourceOperationMap) {
            transactionSourceOperationMap = {
              'Scheduled': {
                'TRANSFER_DEPOSIT': {
                  buttonCls: 'edit-transfer-btn',
                  buttonName: i18nUpcomingTransactions["ease.bank.upcomingTransactions.card.edit.transfer.button.name"],
                  link: i18nUpcomingTransactions["ease.bank.upcomingTransactions.card.cancel.transfer.button.name"],
                  transactionCategory: i18nUpcomingTransactions["ease.bank.upcomingTransactions.card.category.transfer"]
                },
                'TRANSFER_WITHDRAW': {
                  buttonCls: 'edit-transfer-btn',
                  buttonName: i18nUpcomingTransactions["ease.bank.upcomingTransactions.card.edit.transfer.button.name"],
                  link: i18nUpcomingTransactions["ease.bank.upcomingTransactions.card.cancel.transfer.button.name"],
                  transactionCategory: i18nUpcomingTransactions["ease.bank.upcomingTransactions.card.category.transfer"]
                },
                'CreditCardPay': {
                  buttonCls: 'manage-payment-btn',
                  buttonName: i18nUpcomingTransactions["ease.bank.upcomingTransactions.card.manage.payment.button.name"],
                  link: '',
                  transactionCategory: i18nUpcomingTransactions["ease.bank.upcomingTransactions.card.category.credit.card"]
                },
                'BILLPAY': {
                  buttonCls: 'edit-transfer-btn',
                  buttonName: i18nUpcomingTransactions["ease.bank.upcomingTransactions.card.edit.payment.button.name"],
                  link: i18nUpcomingTransactions["ease.bank.upcomingTransactions.card.cancel.payment.button.name"],
                  transactionCategory: i18nUpcomingTransactions["ease.bank.upcomingTransactions.card.category.billpay"]
                },
                'default': {
                  buttonCls: 'cancel-transfer-btn',
                  buttonName: i18nUpcomingTransactions["ease.bank.upcomingTransactions.card.cancel.transfer.button.name"],
                  link: i18nUpcomingTransactions["ease.bank.upcomingTransactions.card.manage.transfer.button.name"],
                  transactionCategory: ''
                }
              },
              'Unscheduled': {
                'BILLPAY': {
                  buttonCls: 'edit-transfer-btn',
                  buttonName: i18nUpcomingTransactions["ease.bank.upcomingTransactions.card.schedule.payment.button.name"],
                  link: '',
                  transactionCategory: i18nUpcomingTransactions["ease.bank.upcomingTransactions.card.category.billpay"]
                },
                'default': {
                  buttonCls: "schedule-payment-btn",
                  buttonName: i18nUpcomingTransactions["ease.bank.upcomingTransactions.card.schedule.payment.button.name"],
                  link: '',
                  transactionCategory: ''
                }
              },
              'default': {
                buttonCls: "cancel-transfer-btn",
                buttonName: i18nUpcomingTransactions["ease.bank.upcomingTransactions.card.cancel.transfer.button.name"],
                link: '',
                transactionCategory: ''
              }
            };
          }
        }

        function getTransactionSourceOperationMap() {
          return transactionSourceOperationMap;
        }

        /**
         * The function returns the class name of the transaction source icon.
         * @param transaction
         * @returns {*}
       */
        function getTransactionSource(transaction){
            var iconClassName = "";
            if(transaction.transactionSource.replace(/\.+$/, "") === 'Scheduled'){
                iconClassName = "icon-scheduled scheduled-icon-green";
            }
            return iconClassName;
        }

          /**
           * The function returns the Merchant Logo of the transaction source.
           * @param transactions
           * @returns {*}
           */
          function getTransactionLogo(transactions){
            if (upcomingTransactionTypeIcon.hasOwnProperty(transactions.transactionType)) {
              return  upcomingTransactionTypeIcon[transactions.transactionType]
            }
            return transactions.merchant.logoURL.href;
          }

        /**
         * The Function returns the transaction amount class name
         * @param transaction
         * @returns {*}
         */
        function getTransactionAmountClass(transaction) {
            var returnClass = '';
            if(!transaction.transactionAmount){
                return returnClass;
            }
            if(transaction.debitCardType){
                return transaction.debitCardType;
            }

            return returnClass;
        }

        function getUpcomingTransactionDetailsTemplate(upComingTrans) {
          if (isLimboTransaction(upComingTrans)) {
              return BankFiles.getFilePath('features/upcomingTransactions/partials/actionModal/upcomingTransactions-cardDetailsLimboTransaction.html');
          }

          if (actionModalTemplateType.hasOwnProperty(upComingTrans.transactionType)) {
            return actionModalTemplateType[upComingTrans.transactionType]
          }
          return BankFiles.getFilePath('features/upcomingTransactions/partials/actionModal/upcomingTransactions-cardDetailsDefault.html')
        }

        function isLimboTransaction(upcomingTransaction) {
            return (upcomingTransaction.isCheckDepositTransaction && upcomingTransaction.availableFundsDate == 'Received');
        }

        function toggleCheckDetailsTemplate(upcomingTransaction) {
            if (upcomingTransaction.showTransactionDetails) {
                return BankFiles.getFilePath('features/upcomingTransactions/partials/actionModal/upcomingTransactions-cardDetailsCheckTransactionDetails.html');
            }
            else {
                return BankFiles.getFilePath('features/upcomingTransactions/partials/actionModal/upcomingTransactions-cardDetailsCheckImage.html');
            }
        }

        function isUnscheduledBill(transaction) {
          return transaction.transactionType === 'BILLPAY' && transaction.transactionSource === "Unscheduled";
        }

         function is360Account() {
          return $stateParams.accountDetails.subCategory === '360';
        }

        function editTransfer (evt, transactionReferenceId) {
          loadingClass = EaseConstant.loading;
          var levels = {
            "level3": "edit transfer"
          };
          BankPubSubFactory.logButtonClickEvent("Bank Edit Transfer Action Modal");
          BankPubSubFactory.logPageViewEvent(levels);
          $state.go('BankDetails.transferEdit', {
            'moneyTransferReferenceId': transactionReferenceId
          }).finally(function (){
            loadingClass = '';
          });
        }

        function scheduleBillPayment(spinnerSource, event, transaction) {
          if (transaction.transactionSource === "Unscheduled") {
            event.stopPropagation();
            goToState(spinnerSource, transaction,'BankDetails.MakePayment', {
              'subCategory': $stateParams.accountDetails.subCategory,
              'payeeReferenceId': transaction.payeeReferenceId,
              'unscheduledeBillReferenceId': transaction.transactionReferenceId,
              'upcomingFocusId': 'upcoming-card-container-' + modalSourceTrigger
            });
          }
          else {
            goToState(spinnerSource, transaction, 'BankDetails.EditPayment', {
              'subCategory': $stateParams.accountDetails.subCategory,
              'transactionReferenceId': transaction.transactionReferenceId,
              'paymentPlanReferenceId': transaction.planReferenceId,
              'upcomingFocusId': 'upcoming-card-container-' + modalSourceTrigger
            });
          }
        }

        function getLoadingClass(){
          return loadingClass;
        }

        function goToState(spinnerSource, transaction, stateName, stateParameter){
          transaction[spinnerSource + "LoadingClass"] = EaseConstant.loading;
          $state.go(stateName, stateParameter).finally(function() {
            transaction[spinnerSource + "LoadingClass"] = '';
          });
        }
        /**
         * The Function returns the transaction Sign
         * @param transaction
         * @returns {*}
         */
        function getTransactionSign(transaction) {
            var transactionSign = "+";
            if(transaction.debitCardType == 'Debit'){
                transactionSign = "-";
            }
            return transactionSign;
        }

        /**
        * The functions to identify if it is amount due transaction
        */
        function isAmountDue(transaction) {
          return transaction.transactionType === "TRANSFER_WITHDRAW" && transaction.transactionSource === "Scheduled" && transaction.transactionAmount == 0;
        }

        /**
        * The function to identify if the button should be enabled
        */
        function isActionButtonEnabled(transactionSource, transactionType) {
          var subCategory = $stateParams.accountDetails.subCategory;
          var actionButton = transactionSourceOperationMap[transactionSource][transactionType];
          return (actionButton && actionButton.buttonEnabled && actionButton.buttonEnabled.hasOwnProperty(subCategory)) ?  actionButton.buttonEnabled[subCategory] : true;
        }

        // prev/next buttons should not be able to receive focus if they are gray/'disabled'
        function carouselArrowButtonStateCheck(theParentElement){
          var theButtons = [];
          var prevButton = $(theParentElement + ' .slick-prev');
          var nextButton = $(theParentElement + ' .slick-next');
          theButtons.push(prevButton);
          theButtons.push(nextButton);

          for (var i = 0; i < theButtons.length; i++) {
            if( theButtons[i].hasClass('slick-disabled') ){
              theButtons[i].attr('tabindex', '-1');
            } else {
              theButtons[i].removeAttr('tabindex');
            }
          };
        }

        function setPartentTarget(theLTwoElement){
          modalSourceTrigger = theLTwoElement;
        }

        // return focus to source element of modals, set varialbe so we can call that ID elsewhere
        function bringFocusBack(){
          var carouselSlideParent = $document[0].getElementById('upcomingTrans-' + modalSourceTrigger);
          var slideInnerElement = carouselSlideParent.querySelector('.upcoming-card-container');
          slideInnerElement.focus();
        }
   }
});
