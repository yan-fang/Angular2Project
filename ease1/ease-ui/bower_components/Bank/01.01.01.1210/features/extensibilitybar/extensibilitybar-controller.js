define(['angular'], function(angular) {
        'use strict';

        angular
            .module('BankModule')
            .controller('BankExtensibilityBarController', BankExtensibilityBarController);

        BankExtensibilityBarController.$inject = ['$state',
                                                  '$stateParams',
                                                  'BankAccountDetailsFactory',
                                                  'BankExtensibilityBarService',
                                                  'BankPubSubFactory',
                                                  '$timeout',
                                                  '$window',
                                                  'transferState',
                                                  'BankAccountUtilities'];

        function BankExtensibilityBarController($state,
                                                $stateParams,
                                                BankAccountDetailsFactory,
                                                BankExtensibilityBarService,
                                                BankPubSubFactory,
                                                $timeout,
                                                $window,
                                                transferState,
                                                BankAccountUtilities) {

            var accountData = BankAccountDetailsFactory.getAccountDetails();
            var menuItems = BankExtensibilityBarService.getMenu(accountData);

            var options = {
              categories :[],
              extensibilityBarMenuItems : menuItems
            }

            var isRetailAccount = BankAccountUtilities.isRetailAccount(accountData.subCategory);
            var isRetailIraOrCd = ( accountData.retailCategory == 'RTLCD' ||
                                    (accountData.retailCategory == 'RTLSA' && accountData.retirementAccountIndicator) )? true : false;

            var goto = function(evt, destinationTag) {

                // State must be set first, because it mutates the values of the following properties retrieved with getters
                var state = BankExtensibilityBarService.setDestinationUrlAndReturnState(destinationTag),
                    destinationUrl = BankExtensibilityBarService.getLongtailDestinationUrl(),
                    pubSubLabel = BankExtensibilityBarService.getPubSubLabel();

                if (pubSubLabel) {
                  BankPubSubFactory.logTrackAnalyticsClick(pubSubLabel);
                }

                if (destinationTag === 'transfermoney-modal') {

                    transferState.setCurrentLOB('BankDetails.transactions');
                    $state.go(state, BankExtensibilityBarService.getTransferMoneyOptions());
                }
                else if (accountData.billPayLandingEnabled && (destinationTag === 'longtail-paybills' || destinationTag === 'longtail-retailPaybills')) {
                    $state.go('BillPay.PayeeList',{
                        productName: $stateParams.ProductName,
                        accountReferenceId: $stateParams.accountReferenceId,
                        subCategory: $stateParams.accountDetails.subCategory
                    });
                }
                else {

                    if (destinationUrl) {
                      isRetailAccount ? $window.open(destinationUrl, '_blank') : $window.location.href = destinationUrl;
                      evt.stopPropagation();
                    } else {
                      $state.go(state, {
                        returnFocusTo : 'moreServicesLink'
                      });
                    }
                }

            };

            angular.extend(this, {
                menu: menuItems,
                goto: goto,
                options: options,
                isRetailIraOrCd : isRetailIraOrCd
            });

        }
    } //end define module function
); //end define
