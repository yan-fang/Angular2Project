define(['angular'], function(angular) {

'use strict';

    angular
        .module('BankModule')
        .factory('BankViewDetailsFactory', BankViewDetailsFactory)
        .factory('BankDisclosuresFactory', BankDisclosuresFactory);

        BankViewDetailsFactory.$inject = ['$window', '$location', 'BankEnvironmentConstants', 'BankConstants', 'BankAccountUtilities'];

        function BankViewDetailsFactory($window, $location, BankEnvironmentConstants, BankConstants, BankAccountUtilities) {
            var BankViewDetailsFactory = {
                postConstruct : postConstruct,
                isJointAccount : isJointAccount,
                accountHolderLabel: accountHolderLabel,
                debitCardLabel: debitCardLabel,
                primaryAccountHolderCardNumber: primaryAccountHolderCardNumber,
                secondaryAccountHolderCardNumber: secondaryAccountHolderCardNumber,
                getPrimaryAccountHolder: getPrimaryAccountHolder,
                getSecondaryAccountHolder : getSecondaryAccountHolder,
                isRoutingNumberActivated: isRoutingNumberActivated,
                isCDAccount: isCDAccount,
                isTrustAccount: isTrustAccount,
                getOwnerShipType : getOwnerShipType,
                viewDisclosures : viewDisclosures,
                truthInSavingDisclosure: truthInSavingDisclosure,
                hideOwnershipType: hideOwnershipType,
                showTruthInSavingsDisclosure: showTruthInSavingsDisclosure
            };
            return BankViewDetailsFactory;

            var accountDetailsData = {};
            var i18nBankAccountDetails = {};
            var accountHoldersCardNumber = accountDetailsData;
            var termsAndConditionsUrls = {};
            var isRetailAccount;
            var isRetirementAccount;

            /**
            * Object initialization - post processor
            * @Param accountDetailsData
            * return
            */
            function postConstruct(customerAccountDetailsData, i18nBank){
                accountDetailsData = customerAccountDetailsData;
                i18nBankAccountDetails = i18nBank
                accountHoldersCardNumber = getAccountHolderCardNumber();
                isRetailAccount = BankAccountUtilities.isRetailAccount(accountDetailsData.accountDetails.subCategory);
                isRetirementAccount = accountDetailsData.accountDetails.retirementAccountIndicator;

                termsAndConditionsUrls = {
                '4000': BankEnvironmentConstants.checkingTandCUrl,
                '4600': BankEnvironmentConstants.tccTandCUrl,
                '3000': BankEnvironmentConstants.savingTandCUrl,
                '3300': BankEnvironmentConstants.directMoneyTandCUrl,
                '3400': BankEnvironmentConstants.csaTandCUrl,
                '4300': BankEnvironmentConstants.moneyTandCUrl,
                '3010': BankEnvironmentConstants.ksaTandCUrl,
                '3500': BankEnvironmentConstants.cdTandCUrl,
                'IRA3000': BankEnvironmentConstants.iraSavingTandCUrl,
                'IRA3500': BankEnvironmentConstants.iraCdTandCUrl
              };
            }

            /**
            * Verifies account is Joint / Individual
            *
            * @Param
            * @return boolean - true / false
            */
            function isJointAccount(){
                return (accountDetailsData.accountDetails.ownershipType
                        && accountDetailsData.accountDetails.ownershipType.toUpperCase() === 'JOINT');
            }

            function isTrustAccount(){
                return (accountDetailsData.accountDetails.ownershipType
                    && accountDetailsData.accountDetails.ownershipType.toUpperCase() === 'TRUST');
            }
            /**
            * Verifies OwnershipType field should be shown or not
            *
            * @Param
            * @return boolean - true / false
            */

            function hideOwnershipType() {
              return (accountDetailsData.accountDetails.ownershipType && !(accountDetailsData.accountDetails.ownershipType.toUpperCase() === 'DEPOSITS'));
            }

            /**
            * Verifies account is CD account
            *
            * @Param
            * @return boolean - true / false
            */
            function isCDAccount(){
                return (accountDetailsData.accountDetails.productId == BankConstants.cd ||
                (isRetailAccount && accountDetailsData.accountDetails.category == 'CD'));
            }

            function showTruthInSavingsDisclosure() {
              return accountDetailsData.accountDetails.productId == BankConstants.cd && !isRetailAccount && !isRetirementAccount;
            }

            /**
            * checks account has routing number or routing number has been activated for a newly opened accounts.
            *
            * @Param
            * @return String - Routing Number
            */
            function isRoutingNumberActivated(){
                var routingNumber = accountDetailsData.accountDetails.routingNumber;
                if(routingNumber == null){
                    routingNumber = i18nBankAccountDetails['ease.bank.accountDetails.routingNumber.not.activated'];
                }
                return routingNumber;
            }

            /**
            * verifies account type and return account holder label accordingly.
            *
            * @Param
            * return String - Primary / Secondary
            */
            function accountHolderLabel() {
                return isJointAccount() ? i18nBankAccountDetails['ease.bank.accountDetails.joint.primaryAccountHolder'] : i18nBankAccountDetails['ease.bank.accountDetails.primaryAccountHolder'];
            }

            /**
            * verifies account type and return debit card label accordingly.
            *
            * @Param
            * @return String - PRIMARY / SECONDARY DEBIT CARD NUMBER
            */
            function debitCardLabel(){
                return isJointAccount() ? i18nBankAccountDetails['ease.bank.accountDetails.joint.primaryDebitCardNumber'] : i18nBankAccountDetails['ease.bank.accountDetails.primaryDebitCardNumber'];
            }

            /**
            * Get Primary Account Holders Card Number
            *
            * @Param
            * @return String - Card Number
            */
            function primaryAccountHolderCardNumber() {
                var primaryAccountHolderCardNumber = accountHoldersCardNumber;
                return primaryAccountHolderCardNumber[0];
            }

            /**
            * Get Secondary Account Holders Card Number
            *
            * @Param
            * @return String - Card Number
            */
            function  secondaryAccountHolderCardNumber(){
                var secondaryAccountHolderCardNumber = accountHoldersCardNumber;
                return secondaryAccountHolderCardNumber[1];
            }

            /**
             * Get Primary Account Holder Title
             *
             * @Param
             * @return String - Primary Account Holder Title
             */
            function getPrimaryAccountHolder(){
                var primaryAccountHolder = i18nBankAccountDetails['ease.bank.accountDetails.accountTitle'];

                if(accountDetailsData.accountDetails.primaryAccountTitle) {
                    primaryAccountHolder = accountDetailsData.accountDetails.primaryAccountTitle;
                } else if (accountDetailsData.accountDetails.accountTitle){
                    primaryAccountHolder =  accountDetailsData.accountDetails.accountTitle.accountTitleLine1;
                }

                return primaryAccountHolder;
            }

            /**
             * Get Secondary Account Holder Title
             *
             * @Param
             * @return String - Secondary Account Holder Title
             */
            function getSecondaryAccountHolder(){
                var secondaryAccountHolder;

                if(accountDetailsData.accountDetails.secondaryAccountTitle) {
                    secondaryAccountHolder = accountDetailsData.accountDetails.secondaryAccountTitle;
                } else if (accountDetailsData.accountDetails.accountTitle && accountDetailsData.accountDetails.accountTitle.accountTitleLine2){
                    secondaryAccountHolder =  accountDetailsData.accountDetails.accountTitle.accountTitleLine2;
                }

                return secondaryAccountHolder;
            }

            /**
             * Get Ownership Type
             *
             * @Param
             * @return String - Joint / Individual
             */
            function getOwnerShipType(){
                return isJointAccount() ? i18nBankAccountDetails['ease.bank.accountDetails.joint.text'] : accountDetailsData.accountDetails.ownershipType;
            };

          function viewDisclosures(evt) {
            evt.preventDefault();
            var tandCLink = termsAndConditionsUrls[(isRetirementAccount ? "IRA" + accountDetailsData.accountDetails.productId : accountDetailsData.accountDetails.productId)];
            $window.open(tandCLink);
            }

            function truthInSavingDisclosure() {
                if (accountDetailsData.accountDetails.productId == BankConstants.cd) {
                    $window.location.href = BankEnvironmentConstants.directbankDefaultUrl;
                }
            }

            /**
            * Get Customers Debit Card Numbers (Checking & Money)
            *
            * @Param
            * @return Array - Debit Card Numbers
            */
            function getAccountHolderCardNumber() {
                var bankCards = getCardDetails();
                var primaryAccountHolderCardNumber = i18nBankAccountDetails['ease.bank.accountDetails.notapplicable'];
                var secondaryAccountHolderCardNumber = i18nBankAccountDetails['ease.bank.accountDetails.notapplicable'];
                var ownerType;
                var accountNumbers = [];

                if(isJointAccount()) {
                    var ownershipType = accountDetailsData.accountDetails.ownershipType;
                    ownerType = ownershipType.split("-");
                    if(ownerType.length > 0 && ownerType[1] && ownerType[1].trim() === 'Guardian Primary' && bankCards.length){ //GUARDIAN IS PRMARY
                        secondaryAccountHolderCardNumber = i18nBankAccountDetails['ease.bank.accountDetails.accountno.prefix'] + bankCards[0].cardLastFour;
                    } else if(ownerType.length > 0 && ownerType[1] && ownerType[1].trim() === 'Limited Primary' && bankCards.length){ // TEEN IS PRIMARY
                        primaryAccountHolderCardNumber = i18nBankAccountDetails['ease.bank.accountDetails.accountno.prefix'] + bankCards[0].cardLastFour;
                    } else if(bankCards.length > 1) { // BOTH PRIMARY AND SECONDARY HAS CARDS
                        primaryAccountHolderCardNumber = i18nBankAccountDetails['ease.bank.accountDetails.accountno.prefix'] + bankCards[0].cardLastFour;
                        secondaryAccountHolderCardNumber = i18nBankAccountDetails['ease.bank.accountDetails.accountno.prefix'] + bankCards[1].cardLastFour;
                    } else if(bankCards.length === 1) { // PRIMARY
                        primaryAccountHolderCardNumber = i18nBankAccountDetails['ease.bank.accountDetails.accountno.prefix'] + bankCards[0].cardLastFour;
                    }
                }
                else { //INDIVIDUAL
                    if(bankCards.length > 0){
                        primaryAccountHolderCardNumber = i18nBankAccountDetails['ease.bank.accountDetails.accountno.prefix'] + bankCards[0].cardLastFour;
                    }
                }
                accountNumbers.push(primaryAccountHolderCardNumber, secondaryAccountHolderCardNumber);
                return accountNumbers;
            }

            /**
            * Get Bank Card Details - Only Activated card detail.
            *
            * @Param
            * @return Array - cardDetails
            */
            function getCardDetails() {
                var bankcardDetails = accountDetailsData.accountDetails.bankCardDetails;
                var cardDetails = [];
                angular.forEach(bankcardDetails, function(cardDetail) {
                    if(cardDetail.cardStatus && cardDetail.cardStatus === 'Active'){
                            cardDetails.push(cardDetail);
                    }
                });
                return cardDetails;
            }
  }

    BankDisclosuresFactory.$inject = ['$q', '$sce', 'Restangular', 'BankEnvironmentConstants', 'BankConstants', 'EASEUtilsFactory'];
    function BankDisclosuresFactory ($q, $sce, Restangular, BankEnvironmentConstants, BankConstants, EASEUtilsFactory) {

            var BankDisclosuresFactory = {
                viewDisclosures : viewDisclosures,
                getAgreementsFromOL : getAgreementsFromOL
            };

            return BankDisclosuresFactory;

            var agreementContent = {};

            function viewDisclosures() {
                return $sce.trustAsHtml(agreementContent.currentTermsAndConditionsText);
            }

            function initializeAgreementContent(agreementDetails) {
                agreementContent = agreementDetails;
            }

            function getAgreementsFromOL(accountReferenceId, productId) {
                var deferred = $q.defer();
                var agreementsUri = buildDisclosuresUri(accountReferenceId, productId);
                var agreementsApi = Restangular.all(agreementsUri);
                agreementsApi.get('').then(
                function promiseSuccessfulResolver(data) {
                    initializeAgreementContent(data)
                    deferred.resolve();
                },
                function promiseRejectResolver() {
                    deferred.resolve({});
                });
                return deferred.promise;
            }

            function buildDisclosuresUri(accountReferenceId, productId) {
                var agreementType = getAgreementType(productId)
                var encodedAccountReferenceId = encodeURIComponent(accountReferenceId);
                var uri = "Bank/" + encodedAccountReferenceId + "/agreements/"+agreementType;
                return uri;
            }

            function getAgreementType(productId) {
                var agreementType = null;
                switch(parseInt(productId)) {
                     case BankConstants.checking:
                         agreementType = "360-checking";
                         break;
                     case BankConstants.saving:
                         agreementType = "360-savings";
                         break;
                     case BankConstants.ksa:
                         agreementType = "360-ksa";
                         break;
                     case BankConstants.money:
                         agreementType = "360-money";
                         break;
                     case BankConstants.directMoney:
                         agreementType = "360-directMoney";
                         break;
                     case BankConstants.cd:
                         agreementType = "360-cd";
                         break;
                     default:
                        break;
                 }
                 return agreementType;
            }
    }
});
