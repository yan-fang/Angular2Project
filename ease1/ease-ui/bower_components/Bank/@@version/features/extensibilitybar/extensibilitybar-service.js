define(['angular'], function(angular) {
        'use strict';

        angular
            .module('BankModule')
            .service('BankExtensibilityBarService', BankExtensibilityBarService);

        BankExtensibilityBarService.$inject = ['$location', 'BankEnvironmentConstants', 'BankAccountUtilities', 'RetailAccountLinks'];
        function BankExtensibilityBarService($location, BankEnvironmentConstants, BankAccountUtilities, RetailAccountLinks) {

            //Extensibility Bar menu items class
            function MenuItemClass(listElemClass, anchorTagId, anchorTagClick, anchorText, iconClass, anchorMobileText) {
                this.icon = iconClass;
                this.title = anchorText;
                this.shortTitle = anchorMobileText;
                this.attrs = [
                  { key : 'id', val : anchorTagId },
                  { key : 'class', val : listElemClass},
                  { key : 'data-ng-click', val : 'bankextensbar.goto($event, "'+ anchorTagClick +'")' }
                ];
            }

            function MenuClass(accountType, menuItems) {

                this.accountType = accountType;
                this.menu = menuItems;

            }

            var transferMoney = new MenuItemClass('transfer-money','transferMoneyLink','transfermoney-modal', '{{::BankDetails.i18nExtBar.transferMoney.title}}','icon-cycle', '{{::BankDetails.i18nExtBar.transferMoney.short}}' );
            var transferMoneyRetail = new MenuItemClass('transfer-money-retail','transferMoneyLink', 'transfermoney-modal','{{::BankDetails.i18nExtBar.transferMoney.title}}','icon-cycle','{{::BankDetails.i18nExtBar.transferMoney.short}}');
            var payBills = new MenuItemClass( 'paybills','payBillsLink','longtail-paybills','{{::BankDetails.i18nExtBar.payBills.short}}', 'icon-calendar','{{::BankDetails.i18nExtBar.payBills.short}}');
            var retailPayBills = new MenuItemClass('retailPaybills', 'retailPayBillsLink', 'longtail-retailPaybills', '{{::BankDetails.i18nExtBar.payBills.short}}', 'icon-calendar', '{{::BankDetails.i18nExtBar.payBills.short}}');
            var mySavingsGoals = new MenuItemClass('savings-goal', 'mySavingsGoalsLink', 'longtail-mysavingsgoals', '{{::BankDetails.i18nExtBar.savingGoals.title}}', 'icon-moneybag', '{{::BankDetails.i18nExtBar.savingGoals.short}}');
            var checkingStatements = new MenuItemClass('checking-statements', 'eStatementsLink', 'statements-modal', '{{::BankDetails.i18nExtBar.statements.title}}', 'icon-print', '{{::BankDetails.i18nExtBar.statements.short}}');
            var savingsStatements = new MenuItemClass('savings-statements', 'eStatementsLink', 'statements-modal', '{{::BankDetails.i18nExtBar.statements.title}}', 'icon-print', '{{::BankDetails.i18nExtBar.statements.short}}');
            var retailStatements = new MenuItemClass('retail-statements', 'eStatementsLink', 'statements-modal', '{{::BankDetails.i18nExtBar.statements.title}}', 'icon-print', '{{::BankDetails.i18nExtBar.statements.short}}');
            var cdMaturityOptions = new MenuItemClass('cd-maturity-options', 'cdMaturityOptionsLink', 'longtail-default', '{{::BankDetails.i18nExtBar.maturityOptions.title}}', 'icon-file-hand', '{{::BankDetails.i18nExtBar.maturityOptions.short}}');
            var cdStatements = new MenuItemClass('cd-statements', 'cdStatementsLink', 'statements-modal', '{{::BankDetails.i18nExtBar.statements.title}}', 'icon-print', '{{::BankDetails.i18nExtBar.statements.short}}');
            var cdDocuments = new MenuItemClass('cd-documents', 'cdDocumentsLink', 'longtail-default', '{{::BankDetails.i18nExtBar.documents.title}}', 'icon-document', '{{::BankDetails.i18nExtBar.documents.short}}');
            var moreServices = new MenuItemClass('more-services', 'moreServicesLink', 'moreservices-modal', '{{::BankDetails.i18nExtBar.moreAccountServices.title}}', 'icon-circle-add', '{{::BankDetails.i18nExtBar.moreAccountServices.short}}');
            var moreServicesRetail = new MenuItemClass('more-services-retail', 'moreServicesLink', 'longtail-retailMoreServices', '{{::BankDetails.i18nExtBar.moreAccountServices.title}}', 'icon-circle-add', '{{::BankDetails.i18nExtBar.moreAccountServices.short}}');
            var retailMessageCenter = new MenuItemClass('retailMessageCenter', 'retailMessageCenterLink', 'longtail-retailMessageCenter', '{{::BankDetails.i18nExtBar.messageCenter.title}}', 'icon-envelope', '{{::BankDetails.i18nExtBar.messageCenter.short}}');
            var iraDocuments = new MenuItemClass('ira-documents', 'iraDocumentsLink', 'longtail-default', '{{::BankDetails.i18nExtBar.documents.title}}', 'icon-document', '{{::BankDetails.i18nExtBar.documents.short}}');
            var iraTransferMoney = new MenuItemClass('ira-transfer-money', 'iraTransferMoneyLink', 'longtail-default', '{{::BankDetails.i18nExtBar.contributionDistribution.title}}', 'icon-cycle', '{{::BankDetails.i18nExtBar.contributionDistribution.short}}');
            var emptyItem = new MenuItemClass('', '', '', '', 'icon-circle-add', '');
                emptyItem.attrs = [ { key : 'ng-hide', val : 'true' }];

            var checkingAccountMenu = new MenuClass('4000', [transferMoney, payBills, checkingStatements, moreServices, emptyItem]);
            var tccAccountMenu = new MenuClass('4600', [transferMoney, payBills, checkingStatements, moreServices, emptyItem]);
            var csaAccountMenu = new MenuClass('3400', [transferMoney, savingsStatements, mySavingsGoals, moreServices, emptyItem]);
            var savingsAccountMenu = new MenuClass('3000', [transferMoney, savingsStatements, mySavingsGoals, moreServices, emptyItem]);
            var directMoneyAccountMenu = new MenuClass('3300', [transferMoney, mySavingsGoals, savingsStatements, moreServices, emptyItem]);
            var moneyAccountMenu = new MenuClass('4300', [transferMoney, mySavingsGoals, savingsStatements, moreServices, emptyItem]);
            var kidsavingsAccountMenu = new MenuClass('3010', [transferMoney, mySavingsGoals, savingsStatements, moreServices, emptyItem]);
            var cdAccountMenu = new MenuClass('3500', [cdMaturityOptions, cdDocuments, cdStatements, moreServices, emptyItem]);
            var iraSavingsAccountMenu = new MenuClass('IRA3000', [iraTransferMoney, iraDocuments, savingsStatements, moreServices, emptyItem]);
            var iraCdAccountMenu = new MenuClass('IRA3500', [cdMaturityOptions, iraDocuments, cdStatements, moreServices, emptyItem]);
            var retailCheckingMenu = new MenuClass('RTLDDA', [transferMoneyRetail, retailPayBills, retailStatements, moreServicesRetail, emptyItem]);
            var retailSavingsMenu = new MenuClass('RTLSA', [transferMoneyRetail, retailMessageCenter, retailStatements, moreServicesRetail, emptyItem]);
            var retailMoneyMenu = new MenuClass('RTLMMA', [transferMoneyRetail, retailMessageCenter, retailStatements, moreServicesRetail, emptyItem]);
            var retailCDMenu = new MenuClass('RTLCD', [retailMessageCenter, retailStatements, moreServicesRetail, emptyItem]);
            var retailIraSavingsMenu = new MenuClass('IRARTLSA',[retailMessageCenter, retailStatements, moreServicesRetail, emptyItem]);
            var retailIraCDMenu = new MenuClass('IRARTLCD', [retailMessageCenter, retailStatements, moreServicesRetail, emptyItem]);

            var destination = null;
            var pubSubLabel = null;
            var transferMoneyOptions = null;

            var extensibilitybarUrls = {

                'longtail-paybills': {
                    'longtailUrl': BankEnvironmentConstants.payBillsUrl,
                    'state': null
                },
                'longtail-retailPaybills': {
                    'longtailUrl': BankEnvironmentConstants.retailBillpayUrl,
                    'state': null
                },
                'longtail-mysavingsgoals': {
                    'longtailUrl': BankEnvironmentConstants.mySavingsGoalsUrl,
                    'state': null
                },
                'statements-modal': {
                    'longtailUrl': null,
                    'state': 'BankDetails.statementOpen'
                },
                'longtail-default': {
                    'longtailUrl': BankEnvironmentConstants.directbankDefaultUrl,
                    'state': null
                },
                'transfermoney-modal': {
                    'longtailUrl': null,
                    'state': 'BankDetails.transfer'
                },
                'moreservices-modal': {
                    'longtailUrl': null,
                    'state': 'BankDetails.moreServices',
                    'pubSubLabel': 'more account services:link' // BANK-4.00
                },
                'longtail-retailMoreServices': {
                    'longtailUrl': null,
                    'state': 'BankDetails.moreServices',
                    'pubSubLabel': 'more account services:link'
                },
                'longtail-retailMessageCenter': {
                  'longtailUrl': BankEnvironmentConstants.retailMessageCenter,
                  'state': null
                }
            };

            var extensibilitybarMenus = {

                '4000': checkingAccountMenu,
                '4600': tccAccountMenu,
                '3400': csaAccountMenu,
                '3000': savingsAccountMenu,
                '3300': directMoneyAccountMenu,
                '4300': moneyAccountMenu,
                '3010': kidsavingsAccountMenu,
                '3500': cdAccountMenu,
                'IRA3000': iraSavingsAccountMenu,
                'IRA3500': iraCdAccountMenu,
                'RTLDDA': retailCheckingMenu,
                'RTLSA': retailSavingsMenu,
                'RTLMMA': retailMoneyMenu,
                'RTLCD': retailCDMenu,
                'IRARTLSA': retailIraSavingsMenu,
                'IRARTLCD' : retailIraCDMenu
            }

          var getAccountTypeToDisplay = function(accountData) {
            var displayMenu = _.findKey(extensibilitybarMenus, function(menu) {
              var accountType = BankAccountUtilities.isRetailAccount(accountData.subCategory) ? accountData.retailCategory :
                accountData.productId;
              return menu.accountType === (accountData.retirementAccountIndicator ? "IRA" + accountType : accountType);
            });
            return displayMenu;
          };

            //These are the internal functions that will be exposed via a service ojbect
            function isEligibleForExtensibility(accountData) {
                var validAccount = getAccountTypeToDisplay(accountData);
                return (typeof(validAccount) !== "undefined"  || BankAccountUtilities.isRetailAccount(accountData.subCategory)) ? true : false;
            };

            function getMenu(accountData) {

                var displayMenu = getAccountTypeToDisplay(accountData);
                return extensibilitybarMenus[displayMenu].menu;

            };

            /**
             * Sets the destination URL and pubsub event label, returning the target state.
             *
             * @public
             * @method setDestinationUrlAndReturnState
             *
             * @param  {String} urlTag  The key to look up, which is actually the anchorTagClick param from the MenuItemClass constructed
             *
             * @return {String}  The eventual target state for the user's click
             */
            function setDestinationUrlAndReturnState(urlTag) {

                var linkData = _.get(extensibilitybarUrls, urlTag);

                destination = linkData.longtailUrl;
                pubSubLabel = linkData.pubSubLabel;

                return linkData.state;
            }

            function getLongtailDestinationUrl() {

                return destination;
            }

            /**
             * Gets the label currently set for pubSub tracking (the name of the click event in SiteCatalyst).
             *
             * @public
             * @method getPubSubLabel
             *
             * @return {String}  The click event label for the pubSub call
             */
            function getPubSubLabel() {
              return pubSubLabel;
            }

            function setTransferMoneyOptions(categoryName,refId){

                transferMoneyOptions = {
                    category: categoryName,
                    referenceId: refId
                }
            }

            function getTransferMoneyOptions(){

                return transferMoneyOptions;
            }

            // This is the service object that is exposed
            return {

                isEligibleForExtensibility: isEligibleForExtensibility,
                getMenu: getMenu,
                setDestinationUrlAndReturnState: setDestinationUrlAndReturnState,
                getLongtailDestinationUrl: getLongtailDestinationUrl,
                getTransferMoneyOptions: getTransferMoneyOptions,
                setTransferMoneyOptions: setTransferMoneyOptions,
                getPubSubLabel: getPubSubLabel
            }
        }

    } //end define module function
); //end define
