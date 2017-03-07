define(['angular'], function(angular) {
  'use strict';
  var TransferController = angular.module('TransferModule');

  TransferController.controller('TransferIndexCtrl',['$scope', 'easeUIModalService', 'transferState',
    '$state', 'TransferFactory', 'TransferAnalytics', 'easeTemplates', '$stateParams', 'EaseConstant',
  function($scope, easeUIModalService, transferState, $state, TransferFactory, TransferAnalytics, easeTemplates,
           $stateParams, EaseConstant) {
    easeUIModalService.showModal({
      templateUrl: easeTemplates.get('Transfer'),
      controller: 'TransferIndexModalCtrl'
    }).then(function(modal) {
      modal.close.then(function(data) {
        if (data) {
          var TransferMoneyStates = transferState.get();
          if(data.toStateName === EaseConstant.stateNames.transferScheduleUnavailable){
            $state.go(transferState.getCurrentLOB() + '.' + EaseConstant.stateNames.transferScheduleUnavailable, {
              'data' : data
            });
          } else {
            $state.go(TransferMoneyStates.transferSuccess.name, {
              transfer: data
            });
          }
        } else {
          TransferFactory.removePrintClass();
          var currentLOB = transferState.getCurrentLOB();
          TransferAnalytics.trackAnalytics('', TransferFactory.getPageType(currentLOB));
          $state.go(currentLOB);
        }
      });
    });
  }]);

	TransferController.controller('TransferIndexModalCtrl', ['$scope', 'EaseLocalizeService', 'EaseConstant',
      'TransferFactory', 'TransferAnalytics', '$filter', '$state', 'EASEUtilsFactory', 'transferState',
      'featureToggleFactory', '$stateParams', 'TransferConstant', '$timeout', 'close', 'CalendarService',
      function($scope, EaseLocalizeService, EaseConstant, TransferFactory, TransferAnalytics,
               $filter, $state, EASEUtilsFactory, transferState, featureToggleFactory, $stateParams,
               TransferConstant, $timeout, close, CalendarService) {
        var vm = $scope,
          memoPattern = /^[a-z0-9A-Z.,\- ]*$/;

        vm.datePickerImage = EaseConstant.datePickerImg;
        TransferFactory.setPrintClass();
        EaseLocalizeService.get('accountSummary').then(function(response) {
          vm.i18n = response;
          vm.btnCaption = vm.i18n.transfer;
        });
        angular.extend(vm, {
        	closeModal: function(data) {
						if (!vm.loadingClass) {
							vm.close(data);
						}
					},
					close: close,
          upperBound: EaseConstant.kTransferAmountUpperBound,
          lowerBound: EaseConstant.kTransferAmountLowerBound,
          loadingClass: false,
          isTransferToSelected: false,
          from: TransferFactory.getTransferFrom(),
          transferFromType: '',
          to: TransferFactory.getTransferTo(),
          transferToType: '',
          amount: {
            payAmount: undefined,
            isExternalTransfer: false,
            isInputValid: false,
            isAmountEmpty: true,
            errorMessage: false
          },
          date: '',
          todayDate: '',
          arriveOnDate: '',
          transferData: TransferFactory.getTransferData(),
          transferFromList: TransferFactory.getTransferFromList(),
          transferToList: TransferFactory.getTransferToList(),
          errorResponse: TransferFactory.getErrorResponse(),
          item: TransferFactory.getAccItem(),
          minDate: '',
          opened: false,
          on: true,
          isAvailBalUndefined: false,
          helocMinimumAmount: null,
          dailyLimitRemainingAmount: null,
          monthlyLimitRemainingAmount: null,
          showArriveOnDate: false,
          showRemainingLimit: false,
          fromDropdown: {},
          toDropdown: {},
          selectedView: EaseConstant.kTransferViewSelection.kOneTimeTransferView,
          transferSubmitted: false,
          TransferFactory: TransferFactory,
          memo: {
            memoText: ''
          },
          isMemoOpen: false,
          isMemoError: false,
          showWeeks: 'false',
          initClose: false,
          submitted: {
            isSubmitted: false
          },
					options: {},
					isTransferType: 'one-time',
          validateMemofn: function() {
            if (memoPattern.test(vm.memo)) {
              vm.isMemoError = false;
            } else {
              vm.isMemoError = true;
            }
          },
          nextValidDate: function(date) {
            var newSelectDate = new Date(date);
            while (EASEUtilsFactory.validateBankDayOffs(newSelectDate)) {
              newSelectDate.setDate(newSelectDate.getDate() + 1);
            }
            return $filter('date')(new Date(newSelectDate), 'MMM dd, yyyy');
          },
          clear: function() {
            vm.date = null;
          },
          toggleDates: function() {
              CalendarService.getDates()
                  .then(function(dates) {
                      vm.options.min_date = dates.minDate;
                      vm.options.max_date = dates.maxDate;
                      vm.options.customClass = getDayClass;
                      vm.options.isDateDisabled = dateDisabled;
                      vm.date = $filter('date')(dates.minDate, 'MMM dd, yyyy');
                      vm.todayDate = vm.date;
                      vm.serverTime = dates.serverTime;
                  })
                  .catch(function(message) {
                      throw message;
                  });

              function getDayClass(data) {
                  var currentDate = $filter('date')(new Date(data.date), 'MMM dd, yyyy');

                  if (data.selected) {
                      if (currentDate === vm.date) {
                          return { cssClass: '', subLabel: 'SEND' };
                      } else {
                          return { cssClass: '', subLabel: '' };
                      }
                  } else if (currentDate === vm.arriveOnDate) {
                      return { cssClass: 'transfer-arrive-on', subLabel: 'ARRIVE' }
                  } else {
                      return { cssClass: '', subLabel: '' };
                  }
              }

              function dateDisabled(date) {
                  if (vm.transferFromType === 'external' || vm.transferToType === 'external') {
                      return EASEUtilsFactory.validateBankDayOffs(new Date(date));
                  } else {
                      return false;
                  }
              }
          },
          openByKeypress: function(evt) {
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if (charCode === 32 || charCode === 13) {
              vm.open(evt);
            }
          },
          open: function($event) {
            if (!vm.transferSubmitted) {
              var featureToggleData = featureToggleFactory.getFeatureToggleData();
              if (featureToggleData && !featureToggleData[EaseConstant.features.transferScheduledFeature] ||
                !vm.displayCalendarIcon()) {
                var data = {
                  toStateName: EaseConstant.stateNames.transferScheduleUnavailable,
                  referenceId: vm.fromDropdown.referenceId,
                  toReferenceId: vm.toDropdown.referenceId,
                  amount: vm.amount.payAmount,
                  date: vm.date,
                  memo: vm.memo.memoText
                };
                close(data);
              } else {
                TransferAnalytics.trackAnalytics('', 'transfer', 'calendar');
                $event.stopPropagation();
                vm.selectedView = EaseConstant.kTransferViewSelection.kDatePickerView;
              }
            }
          },
          displayCalendarIcon: function() {
            var featureToggleData = featureToggleFactory.getFeatureToggleData();
            var isHelocFeatureToggledOff = featureToggleData &&
              !featureToggleData[EaseConstant.features.enableHELOCScheduled];
            var isHeloc = vm.from.accountType === 'heloc';
            return !(isHeloc && isHelocFeatureToggledOff) && !vm.isTransferInvesting();
          },
          isTransferInvesting: function() {
            return vm.fromDropdown.accountType === 'investing' || vm.toDropdown.accountType === 'investing';
          },
          openMemoField: function(evt) {
            if (!vm.transferSubmitted) {
              vm.isMemoOpen = true;
              $timeout(function() {
                evt.target.nextElementSibling.focus();
              });
              TransferAnalytics.trackAnalyticsByName('add a memo:button');
            }
          },
          displayMemoField: function() {
            return !(vm.from.accountType === 'heloc');
          },
          selectDate: function(dt) {
            var displayDate = $filter('date')(new Date(dt), 'MMM dd, yyyy');
            vm.date = displayDate;
            if (vm.showArriveOnDate) {
              vm.setArriveOnDate();
            }
          },
          isInstantTransfer: function() {
            if ($filter('date')(new Date(vm.date), 'MMM dd yyyy') === $filter('date')(vm.serverTime, 'MMM dd yyyy')) {
              return (!(/external/.test(vm.transferFromType + vm.transferToType)))
            }
            return false;
          },
          setArriveOnDate: function() {
            var transferArriveOnDateLogic = EaseConstant.transferArriveOnDateLogic;
            var arriveOnDateOffSet = 0;
            var todayDate = $filter('date')(new Date(vm.todayDate), 'MMM dd, yyyy');
            var date = $filter('date')(new Date(vm.date), 'MMM dd, yyyy');

            if (todayDate === date) {
              var currentHour = new Date(TransferFactory.getServerTime()).getHours();
              var currentTransferLogic =
                (transferArriveOnDateLogic[vm.transferFromType])[vm.transferToType];
              arriveOnDateOffSet = (currentHour < currentTransferLogic.cutOffHour) ?
                currentTransferLogic.before : currentTransferLogic.after;
            } else {
              arriveOnDateOffSet = (transferArriveOnDateLogic[vm.transferFromType])[vm.transferToType].before;
            }

            var arriveOnDate = new Date(vm.date);
            while (arriveOnDateOffSet) {
              arriveOnDate.setDate(arriveOnDate.getDate() + 1);
              if (!EASEUtilsFactory.validateBankDayOffs(arriveOnDate)) {
                arriveOnDateOffSet--;
              }
            }

            vm.arriveOnDate = $filter('date')(new Date(arriveOnDate), 'MMM dd, yyyy');
          },
          isDisplayGlobalMessagefn: function() {
            vm.errorResponse.globalError = !vm.errorResponse.globalError;
          },
          setTransferSuccessData: function(data) {
            data.accountDetails = {
              fromAccount: vm.fromDropdown.selectedPrimary,
              fromAccountNumber: vm.fromDropdown.selectedSecondary,
              fromAccountType: vm.fromDropdown.accountType,
              toAccount: vm.toDropdown.selectedPrimary,
              toAccountNumber: vm.toDropdown.selectedSecondary,
              toAccountType: vm.toDropdown.accountType,
              payAmount: vm.amount.payAmount,
              instantTransfer: vm.isInstantTransfer(),
              isExternalTransfer: vm.amount.isExternalTransfer,
              transferDate: vm.date,
              arriveOnDate: vm.arriveOnDate,
              message: vm.message,
              isHeloc: (vm.from.accountType === 'heloc')
            };
          },
          datePickerDone: function() {
            vm.selectedView = EaseConstant.kTransferViewSelection.kOneTimeTransferView;
						vm.callback = true;
          },
          onTransferFromSelected: function(transferFrom) {
            vm.transferFromType = transferFrom.accountType;
            vm.resetValues();
            vm.from = transferFrom;
            vm.setDropDownSelected(vm.fromDropdown, transferFrom);
            vm.setCurrentTransferToList(transferFrom);
            vm.setCalendarArriveOnDate();
            vm.helocMinimumAmount =transferFrom.minimumAdvance;
          },
          onTransferToSelected: function(transferTo) {
            vm.setDropDownSelected(vm.toDropdown, transferTo);
            vm.showRemainingLimit = transferTo.showRemainingLimit && !(vm.from.accountType === '360') && !(vm.from.accountType === 'heloc');
            vm.isTransferToSelected = transferTo.referenceId !== '-1';
            if (vm.isTransferToSelected) {
              vm.transferToType = transferTo.accountType;
            }
            vm.dailyLimitRemainingAmount = (vm.transferFromType === 'retail' && vm.transferToType === 'external')
              ? transferTo.dailyTransferLimit : null;
            vm.monthlyLimitRemainingAmount = (vm.transferFromType === 'retail' && vm.transferToType === 'external')
              ? transferTo.monthlyTransferLimit : null;
            vm.setCalendarArriveOnDate();
          },
          resetValues: function() {
            vm.isTransferToSelected = false;
            vm.transferToType = '';
            vm.showRemainingLimit = false;
          },
          setDropDownSelected: function(dropdown, selected) {
            if (dropdown.isOpen) {
              dropdown.isOpen = false;
            }
            dropdown.selectedValue = selected.displayName;
            dropdown.selectedPrimary = selected.displayName;
            dropdown.selectedSecondary = selected.accountNumber;
            dropdown.selectedAccountBalance = selected.displayBalance;
            dropdown.accountType = selected.accountType;
            dropdown.moneyReferenceId = selected.moneyReferenceId;
            dropdown.referenceId = selected.referenceId || selected.externalAccountReferenceId;
            vm.submitted.isSubmitted = false;
            $timeout(function() {
              $scope.$broadcast('TRANSFER-DD-CHANGED');
            });
          },
          setCurrentTransferToList: function(transferFromAccount) {
            vm.resetTransferToDropdown();
            var lengthForData = vm.transferData.length;
            var currentEligibleDebitOffsetAccounts = [];
            for (var i = 0; i < lengthForData; i++) {
              if (transferFromAccount.moneyReferenceId === vm.transferData[i].moneyTransferAccountReferenceId) {
                currentEligibleDebitOffsetAccounts = vm.transferData[i].eligibleDebitOffsetAccounts;
              }
            }
            var lengthForJ = currentEligibleDebitOffsetAccounts.length;
            for (var j = 0; j < lengthForJ; j++) {
              for (var k = 0; k < lengthForData; k++) {
                if (vm.transferData[k].accountType !== 'HELOC' &&
                    currentEligibleDebitOffsetAccounts[j].moneyTransferAccountReferenceId[0] ===
                    vm.transferData[k].moneyTransferAccountReferenceId) {
                  vm.transferToList.list.push(TransferFactory.translateApiResponse(vm.transferData[k],
                      currentEligibleDebitOffsetAccounts[j]));
                }
              }
            }
            TransferFactory.setTransferToList(vm.transferToList.list);
          },
          resetTransferToDropdown: function() {
            vm.transferToList.list.length = 0;
            vm.toDropdown = {};
          },
          showTransfersLimit: function() {
            var accountType = vm.from.rawAccountType;
            accountType = accountType ? accountType.toLowerCase() : '';
            return accountType === 'money market' || accountType.indexOf('savings') !== -1;
          },
          availableBalance: function(selectedAccountBalance) {
            return selectedAccountBalance ?  'Available ' + $filter('currency')(selectedAccountBalance) :  '';
          },
          setCalendarArriveOnDate: function() {
            var featureToggleData = featureToggleFactory.getFeatureToggleData();
            if (vm.isTransferInvesting() || (vm.from.accountType === 'heloc' &&
                featureToggleData && !featureToggleData[EaseConstant.features.enableHELOCScheduled])) {
              vm.date = $filter('date')(new Date(vm.serverTime), 'MMM dd, yyyy');
            }
            if ((vm.transferFromType === 'external' || vm.transferToType === 'external') &&
                EASEUtilsFactory.validateBankDayOffs(new Date(vm.date))) {
              vm.date = $filter('date')(new Date(vm.serverTime), 'MMM dd, yyyy');
            }
            vm.amount.isExternalTransfer = /external/.test(vm.transferFromType + vm.transferToType);
            vm.showArriveOnDate = vm.amount.isExternalTransfer && vm.isTransferToSelected;
            if (vm.todayDate === vm.date && vm.amount.isExternalTransfer) {
              vm.date = vm.nextValidDate(vm.date);
            }
            if (vm.showArriveOnDate) {
              vm.setArriveOnDate();
            } else {
              vm.arriveOnDate = '';
            }
          }
        });

        $scope.$watchCollection(function getValue() {
          return [vm.memo.memoText];
        }, function collectionChanged(newValue, oldValue) {
          if (!memoPattern.test(newValue)) {
            vm.memo.memoText = oldValue;
          }
        });

        $scope.$on('error', function(e, message) {
					vm.loadingClass = false;
          if (message.msgType !== 'missingLabel') {
            vm.close();
          }
        });

        vm.contentData = TransferFactory.getContentData();
        vm.expectedData = TransferConstant.kTransferFormContentLabel;
				vm.toggleDates();

        EASEUtilsFactory.missingContentLabel(vm.expectedData, vm.contentData);
        if (vm.transferFromList && vm.transferFromList.length) {
          var transferFrom = vm.transferFromList[TransferFactory.getSelectedIdx('transferFrom')];
          vm.transferToList.list = [];
          vm.fromDropdown.isOpen = !vm.fromDropdown.isOpen;
          vm.onTransferFromSelected(transferFrom);
          var lob = TransferAnalytics.buildLOB(transferFrom.accountType);
          TransferAnalytics.trackAnalytics(lob, 'transfer');
        }
        vm.isTransferEnable = function() {
          return !vm.toDropdown.selectedPrimary || vm.isMemoError ||
              vm.amount.isAmountEmpty || vm.loadingClass;
        };

        if($stateParams.data.previousStateName === EaseConstant.stateNames.transferScheduleUnavailable){
          vm.date = $stateParams.data.date;
          vm.amount.payAmount = $stateParams.data.amount;
          vm.memo.memoText = $stateParams.data.memo;
          vm.isMemoOpen = $stateParams.data.memo ? true : false;
          if($stateParams.data.toReferenceId){
            vm.onTransferToSelected(vm.transferToList.list[TransferFactory.getSelectedIdx('transferTo', $stateParams.data.toReferenceId)]);
          }
          $stateParams.data = {};
        }
        vm.makePayment = function() {
          if (vm.amount.isInputValid) {
            vm.isTransferToSelected = false;
            vm.loadingClass = true;
            vm.transferSubmitted = true;
            var transferMessage = {
              'customerReferenceId': '',
              'fromAccountDetail': {
                'moneyTransferAccountReferenceId': vm.fromDropdown.moneyReferenceId
              },
              'toAccountDetail': {
                'moneyTransferAccountReferenceId': vm.toDropdown.moneyReferenceId
              },
              'transactionAmount': vm.amount.payAmount.toString(),
              'customerMemo': vm.memo.memoText
            };
            if (!vm.fromDropdown.selectedAccountBalance) {
              vm.isAvailBalUndefined = true;
            }

            if (vm.amount.isExternalTransfer || !vm.isInstantTransfer()) {
              transferMessage['oneTimeTransferDate'] = (new Date(vm.date)).toISOString();
            }
            TransferFactory.transferAmount(transferMessage).then(function(data) {
              vm.loadingClass = false;
              data.accInfo = vm.item;
              if ($stateParams.subCategory) {
                data.accInfo.subCategory = $stateParams.subCategory
              }

              vm.setTransferSuccessData(data);

              if ((data.executionStatus && data.executionStatus.toLowerCase() === 'success') ||
                (data.executionStatus && data.executionStatus.toLowerCase() === 'completed')) {
              	vm.closeModal(data);
              } else if (data.moneyTransferID) {
								vm.closeModal(data);
              } else if (data.easeDisplayError.errorIdString === '202880') {
                // TODO Update the logic after API is updated to handle Errors and minimize the flags.
                vm.amount.isInputValid = false; // To Check for Input Field
                vm.submitted.isSubmitted = true; // For UI Error Handling
                vm.amount.errorMessage = true; // To Display new API Error
                vm.transferSubmitted = false; // To Enable / Disable all the Form Fields.
                vm.isTransferToSelected = true; // To Enable / Disable Transfer Button
              }
            }, function() {
              vm.isTransferToSelected = false;
            });
          } else {
            $timeout(function() {
              vm.submitted.isSubmitted = true;
            }, 200);
          }
        }
      }
    ]);

  TransferController.controller('TransferSuccessCtrl',['easeUIModalService', 'transferState', '$state',
    'TransferFactory', 'TransferAnalytics', 'transferStatusdata', 'easeTemplates',
      function(easeUIModalService, transferState, $state, TransferFactory, TransferAnalytics, transferStatusdata, easeTemplates) {
        easeUIModalService.showModal({
          templateUrl:  easeTemplates.get('Transfer', '', 'success'),
          controller: 'TransferSuccessModalCtrl',
          inputs: {
            data: transferStatusdata
          }
        }).then(function(modal) {
          modal.close.then(function(data) {
            TransferFactory.removePrintClass();
            if (!data) {
              var currentLOB = transferState.getCurrentLOB();
              TransferAnalytics.trackAnalytics('', TransferFactory.getPageType(currentLOB));
              $state.go(currentLOB, {}, {
                reload: true
              });
            }
          });
        });
      }]);

  TransferController.controller('TransferSuccessModalCtrl', ['$scope', '$state', 'EaseLocalizeService',
    'TransferFactory', 'TransferAnalytics', 'EaseModalService', 'EaseConstant', 'TransferConstant', '$filter',
      'EASEUtilsFactory', 'featureToggleFactory','close', 'data', 'transferState', '$q',
      function($scope, $state, EaseLocalizeService, TransferFactory, TransferAnalytics, EaseModalService, EaseConstant,
               TransferConstant, $filter, EASEUtilsFactory, featureToggleFactory, close, data, transferState, $q) {

        var vm = $scope;
				vm.pending = 0;
				var TransferMoneyStates = transferState.get();
        vm.contentData = TransferFactory.getContentData();
        vm.expectedData = TransferConstant.kTransferSuccessContentLabel;
				vm.closeModal = function(data) {
					if (vm.pending === 0) {
						vm.close(data);
					}
				},
        EASEUtilsFactory.missingContentLabel(vm.expectedData, vm.contentData);

        EaseLocalizeService.get('accountSummary').then(function(response) {
          vm.i18n = response;

          // todo task -- we have to remove all these conditions
          var accountDetails = data.transfer.accountDetails;
          if (typeof accountDetails.fromAccount !== 'undefined' &&
            typeof accountDetails.toAccount !== 'undefined' &&
            typeof accountDetails.payAmount !== 'undefined') {
            if (accountDetails.instantTransfer) {
              vm.transferfrom = accountDetails.fromAccount;
              vm.transferto = accountDetails.toAccount;
              vm.transferfromdetails = data.transfer.fromAccountEffectiveBalance;
              vm.transfertodetails = data.transfer.toAccountEffectiveBalance;
              vm.payAmount = accountDetails.payAmount;
              vm.updateMsg = vm.i18n.updateMsg;
            } else {
              vm.transferfrom = vm.i18n.sendOn;
              vm.transferto = vm.i18n.arriveBy;
              vm.updateMsg = '';
              vm.transfertodetails = $filter('date')(new Date(data.transfer.fundsAvailabilityDate),
                'MM/dd/yyyy');
              vm.transferfromdetails = $filter('date')(new Date(data.transfer.effectiveDate),
                'MM/dd/yyyy');
              vm.payAmount = accountDetails.payAmount;
            }
            vm.displayValue = true;
          } else {
            vm.payAmount = (accountDetails.instantTransfer) ? 'The Amount' :
              'Your transfer has been scheduled.';
            vm.displayValue = true;
          }
          var lob = TransferAnalytics.buildLOB(
              vm.transfer.accountDetails.fromAccountType, vm.transfer.accountDetails.toAccountType);
          TransferAnalytics.trackAnalytics(lob, 'transfer', 'confirmation');
        });

        vm.payDate = $filter('date')(new Date(data.transfer.effectiveDate), 'MMM dd yyyy');

        angular.extend(vm, {
        	transfer: data.transfer,
					close: close,
          printConfirmation: function() {
            if (vm.pending === 0) {
              window.print();
            }
          },
          successMsg: TransferFactory.getSuccessData(),
          showManageTransfer: function(details) {
            return (!details.instantTransfer || details.isExternalTransfer) && !details.isHeloc;
          },
          cancelTransfer: function() {
            if (vm.pending === 0) {
							vm.pending++;
              var deferred = $q.defer();
              var promise =  $state.go(TransferMoneyStates.transferCancel.name, {
                'moneyTransferID': vm.transfer.moneyTransferID
              });

              TransferAnalytics.trackAnalyticsByName('cancel transfer:link');
              promise.then(function() {
              	vm.pending--;
								deferred.resolve(vm.closeModal(data));
              }, function(data) {
              	vm.pending--;
								deferred.reject(vm.closeModal(data));
              });
              return deferred.promise;
            }
          },
          editTransfer: function() {
            if (vm.pending === 0) {
							vm.pending++;
							//  vm.disableTransfer();
              var deferred = $q.defer();
              var promise = $state.go(TransferMoneyStates.transferEdit.name, {
                'moneyTransferID': vm.transfer.moneyTransferID
              });
              TransferAnalytics.trackAnalyticsByName('edit transfer:link');
              promise.then(function() {
								vm.pending--;
								deferred.resolve(vm.closeModal(data))
              }, function(data) {
								vm.pending--;
								deferred.reject(vm.closeModal(data));
              });
              return deferred.promise;
            }
          },
          showEditLink: true,
          showCancelLink: true
        });

        $scope.$on('error', function() {
					vm.pending--;
					vm.close();
        });

        var featureToggleData = featureToggleFactory.getFeatureToggleData();
        if (featureToggleData) {
          vm.showEditLink = featureToggleData[EaseConstant.features.transferScheduledEditFeatureName];
          vm.showCancelLink = featureToggleData[EaseConstant.features.transferScheduledCancelFeatureName];
        }
      }
    ]);

  TransferController.controller('TransferEditCtrl',['easeUIModalService', 'transferState', '$state',
    'TransferFactory', 'TransferAnalytics', 'easeTemplates',
    function(easeUIModalService, transferState, $state, TransferFactory, TransferAnalytics, easeTemplates) {
      easeUIModalService.showModal({
        templateUrl:  easeTemplates.get('Transfer', '', 'edit'),
        controller: 'TransferEditModalCtrl'
      }).then(function(modal) {
        modal.close.then(function(data) {
          if (!data) {
            TransferFactory.removePrintClass();
            var currentLOB = transferState.getCurrentLOB();
            TransferAnalytics.trackAnalytics('', TransferFactory.getPageType(currentLOB));
            $state.go(currentLOB);
          }
        });
      });
    }]);

  TransferController.controller('TransferEditModalCtrl', ['$scope', '$state', '$filter', 'transferState', 'TransferFactory', 'TransferAnalytics',
		'EaseConstant', 'EASEUtilsFactory', 'featureToggleFactory', 'close', '$q', 'CalendarService',
    function($scope, $state, $filter, transferState, TransferFactory, TransferAnalytics,
             EaseConstant, EASEUtilsFactory, featureToggleFactory, close, $q, CalendarService) {
      var vm = $scope;
			vm.pending = 0;
			vm.contentData = TransferFactory.getContentData();
      var TransferMoneyStates = transferState.get();
      vm.datePickerImage = EaseConstant.datePickerImg;
      vm.editTransferData = TransferFactory.getEditTransferData();
      TransferFactory.setPrintClass();
      angular.extend(vm, {
				closeModal: function(data) {
					if (vm.pending === 0) {
						vm.close(data);
					}
				},
				close: close,
        selectedView: EaseConstant.kTransferViewSelection.kOneTimeTransferView,
        date: '',
        todayDate: '',
        arriveOnDate: '',
        minDate: '',
        amount: {
          payAmount: vm.editTransferData.transactionAmount,
          isExternalTransfer: !vm.editTransferData.isInternalIndicator,
          isInputValid: false,
          isAmountEmpty: true,
          errorMessage: false
        },
        submitted : {
          isSubmitted: false
        },
        upperBound: EaseConstant.kTransferAmountUpperBound,
        lowerBound: EaseConstant.kTransferAmountLowerBound,
        loadingClass: false,
        isLoading: false,
        transferToType: '',
        dailyLimitRemainingAmount: null,
        monthlyLimitRemainingAmount: null,
        showArriveOnDate : !vm.editTransferData.isInternalIndicator,
        showRemainingLimit: false,
        transferSubmitted: false,
				isTransferType: 'one-time',
				options: {},
        today: function(serverTime) {
          var instantTransfer = checkStatus
            , status;
          vm.serverTime = serverTime;

          instantTransfer().then(function(res) {
            vm.instantTransfer = res;
          });

          function checkStatus() {
            vm.date
							= $filter('date')(new Date(TransferFactory
							.getEditTransferData()
							.oneTimeTransferDate), 'MMM dd, yyyy');
            vm.todayDate = $filter('date')(serverTime, 'MMM dd, yyyy');
            status = ($filter('date')(new Date(vm.date), 'MMM dd yyyy') ===
						$filter('date')(new Date(serverTime), 'MMM dd yyyy'));

            return $q.when(status);
          }

          if (vm.showArriveOnDate) {
            vm.setArriveOnDate();
          }
          var lob = TransferAnalytics.buildLOB(
              vm.editTransferData.fromAccount.accountType, vm.editTransferData.toAccount.accountType);
          TransferAnalytics.trackAnalytics(lob, 'edit transfer');
          vm.showRemainingLimit = (vm.editTransferData.fromAccount.accountType === 'retail' &&
              vm.editTransferData.toAccount.accountType === 'external');
        },
        showWeeks: 'false',
        clear: function() {
          vm.date = null;
        },
        toggleDates: function() {
            var serverTime,
							newServerTime;

					CalendarService.getDates()
            .then(function(dates) {
              if (angular.isObject(dates)) {
                serverTime = dates.serverTime;
                newServerTime = serverTime.setDate(serverTime.getDate() + 1);
                vm.options.min_date =
									vm.isExternalTransfer  ?
										(serverTime instanceof Date ? serverTime : new Date(serverTime)) :
										new Date(newServerTime);
                vm.options.max_date = dates.maxDate;
                vm.options.isDateDisabled = vm.dateDisabled;
                vm.options.customClass = vm.getDayClass;
                vm.today(serverTime);
              } else {
                throw '$calendarService doesn\'t return object';
              }
            })
            .catch(function(msg) {
              throw msg;
            });
        },
				dateDisabled: function(date) {    // call disable the dates
					vm.isDisabledDates = false;
					if (vm.editTransferData.fromAccount.accountType === 'external'
						|| vm.editTransferData.toAccount.accountType  === 'external') {
						vm.isDisabledDates = EASEUtilsFactory.validateBankDayOffs(new Date(date));
						return vm.isDisabledDates;
					} else {
						return vm.isDisabledDates;
					}
				},
				getDayClass: function(data) {   // call Custom class Datepicker
					var currentDate = $filter('date')(new Date(data.date), 'MMM dd, yyyy');
					var selectedClass = { cssClass: '', subLabel: '' };

					if (data.selected) {
						if (currentDate === vm.date) {
							selectedClass = { cssClass: '', subLabel: 'SEND' };
							return selectedClass;
						} else {
							return selectedClass;
						}
					} else if (currentDate === vm.arriveOnDate) {
						selectedClass = { cssClass: 'transfer-arrive-on', subLabel: 'ARRIVE' };
						return selectedClass;
					} else {
						return selectedClass;
					}
				},
        openByKeypress: function(evt) {
          var charCode = (evt.which) ? evt.which : evt.keyCode;
          if (charCode === 32 || charCode === 13) {
            vm.open(evt);
          }
        },
        open: function($event) {
          TransferAnalytics.trackAnalyticsByName('calendar:button');
          if (!vm.transferSubmitted) {
            var featureToggleData = featureToggleFactory.getFeatureToggleData();
            if (featureToggleData && !featureToggleData[EaseConstant.features.transferScheduledFeature]) {
              $scope.$broadcast('Show_Schedule_Transfer_Unavailable');
            } else {
              TransferAnalytics.trackAnalytics('', 'edit transfer', 'calendar');
              vm.selectedView = EaseConstant.kTransferViewSelection.kDatePickerView;
              $event.stopPropagation();
            }
          }
        },
        selectDate: function(dt) {
          vm.instantTransfer =
              ($filter('date')(new Date(dt), 'MMM dd yyyy') === $filter('date')(vm.serverTime, 'MMM dd yyyy'));
          var displayDate = $filter('date')(new Date(dt), 'MMM dd, yyyy');
          vm.date = displayDate;
          if (vm.showArriveOnDate) {
            vm.setArriveOnDate();
          }
        },
        setArriveOnDate: function() {
          var transferArriveOnDateLogic = EaseConstant.transferArriveOnDateLogic;
          var arriveOnDateOffSet = 0;
          var todayDate = $filter('date')(new Date(vm.todayDate), 'MMM dd, yyyy');
          var date = $filter('date')(new Date(vm.date), 'MMM dd, yyyy');

          if (todayDate === date) {
            var currentHour = new Date(TransferFactory.getServerTime()).getHours();
            var currentTransferLogic =
                (transferArriveOnDateLogic[vm.editTransferData.fromAccount.accountType])
                  [vm.editTransferData.toAccount.accountType];
            arriveOnDateOffSet = (currentHour < currentTransferLogic.cutOffHour) ?
              currentTransferLogic.before : currentTransferLogic.after;
          } else {
            arriveOnDateOffSet =
                (transferArriveOnDateLogic[vm.editTransferData.fromAccount.accountType])
                  [vm.editTransferData.toAccount.accountType].before;
          }

          var arriveOnDate = new Date(vm.date);
          while (arriveOnDateOffSet) {
            arriveOnDate.setDate(arriveOnDate.getDate() + 1);
            if (!EASEUtilsFactory.validateBankDayOffs(arriveOnDate)) {
              arriveOnDateOffSet--;
            }
          }
          vm.arriveOnDate = $filter('date')(new Date(arriveOnDate), 'MMM dd, yyyy');
        },
        datePickerDone: function() {
          TransferAnalytics.trackAnalytics('', 'edit transfer');
          vm.selectedView = EaseConstant.kTransferViewSelection.kOneTimeTransferView;
					vm.callback = true;
				},
        setTransferSuccessData: function(data) {
          data.accountDetails = {
            fromAccount: vm.editTransferData.fromAccount.displayName,
            fromAccountNumber: vm.editTransferData.fromAccount.accountNumber,
            fromAccountType: vm.editTransferData.fromAccount.accountType,
            toAccount: vm.editTransferData.toAccount.displayName,
            toAccountNumber: vm.editTransferData.toAccount.accountNumber,
            toAccountType: vm.editTransferData.toAccount.accountType,
            payAmount: vm.amount.payAmount,
            isExternalTransfer: vm.amount.isExternalTransfer,
            transferDate: vm.date,
            arriveOnDate: vm.arriveOnDate
          };
        },
        updateTransfer: function() {
          if (vm.amount.isInputValid) {
						vm.pending++;
						vm.loadingClass = true;
            vm.transferSubmitted = true;
            var editTransferMessage = {
              'moneyTransferReferenceId': TransferFactory.getEditTransferData().moneyTransferReferenceId,
              'fromAccountDetail': {
                'moneyTransferAccountReferenceId':
                  TransferFactory.getEditTransferData().fromAccount.moneyTransferAccountReferenceId
              },

              'toAccountDetail': {
                'moneyTransferAccountReferenceId': TransferFactory.getEditTransferData()
                                                                    .toAccount
                                                                    .moneyTransferAccountReferenceId
              },
              'transactionAmount': vm.amount.payAmount.toString(),
              'currencyCode': 'USD',
              'oneTimeTransferDate' : new Date(vm.date).toISOString()
            };

            TransferFactory.updateTransfer(editTransferMessage).then(function(data) {
							vm.pending--;
							vm.loadingClass = false;
              vm.setTransferSuccessData(data);
              if (data.moneyTransferID || data.moneyTransferReferenceId) {
                $state.go(TransferMoneyStates.transferSuccess.name, {
                  transfer: data
                });
              } else {
                vm.transferSubmitted = false;
              }
              vm.closeModal(data);
            });
          } else {
            vm.submitted.isSubmitted = true;
          }
        },
        cancelEditTransfer: function() {
          if (!vm.transferSubmitted) {
						vm.pending++;
						vm.isLoading = true;
            vm.transferSubmitted = true;
            var deferred = $q.defer();
            var promise =  $state.go(TransferMoneyStates.transferCancel.name, {
              'moneyTransferID':  vm.editTransferData.moneyTransferID
            });
            TransferAnalytics.trackAnalyticsByName('cancel transfer:link');
            promise.then(function(data) {
							vm.pending--;
							vm.transferSubmitted = false;
							vm.isLoading = false;
							deferred.resolve(vm.closeModal(data));
            }, function(data) {
							vm.pending--;
							vm.transferSubmitted = false;
							vm.isLoading = false;
							deferred.reject(vm.closeModal(data));
						});
            return deferred.promise;
          }
        }
      });
      vm.toggleDates();
    }]);

  TransferController.controller('TransferCancelCtrl',['easeUIModalService', 'transferState', '$state',
    'TransferFactory', 'TransferAnalytics', 'easeTemplates',
    function(easeUIModalService, transferState, $state, TransferFactory, TransferAnalytics, easeTemplates) {
      easeUIModalService.showModal({
        templateUrl:  easeTemplates.get('Transfer', '', 'cancel'),
        controller: 'TransferCancelModalCtrl'
      }).then(function(modal) {
        modal.close.then(function(data) {
          TransferFactory.removePrintClass();
          if (!data) {
            var currentLOB = transferState.getCurrentLOB();
            TransferAnalytics.trackAnalytics('', TransferFactory.getPageType(currentLOB));
            $state.go(currentLOB);
          }
        });
      });
    }]);

  TransferController.controller('TransferCancelModalCtrl',
    function($scope, $state, transferState, TransferFactory, TransferAnalytics,
     $stateParams, EaseLocalizeService, close) {
      var vm = $scope;
      vm.contentData = TransferFactory.getContentData();
      var TransferMoneyStates = transferState.get();
      vm.transactionInfo = TransferFactory.getEditTransferData();
      EaseLocalizeService.get('accountSummary').then(function(response) {
        var lob = TransferAnalytics.buildLOB(
            vm.transactionInfo.fromAccount.accountType, vm.transactionInfo.toAccount.accountType);
        TransferAnalytics.trackAnalytics(lob, 'delete transfer');
        vm.i18n = response;
        angular.extend(vm, {
					closeModal: function(data) {
						if (!vm.loadingClass) {
							vm.close(data);
						}
					},
					close: close,
          loadingClass: false,
          confirm: function() {
            vm.loadingClass = true;
            TransferFactory.cancelTransfer(vm.transactionInfo.moneyTransferReferenceId).then(function(data) {
            	vm.loadingClass = false;
              if (data.executionStatus && data.executionStatus.toLowerCase() === 'success') {
                $state.go(TransferMoneyStates.transferCancelConfirm.name, {
                  'moneyTransferID': vm.transactionInfo.moneyTransferID,
                  'data': {
                    'transactionAmount': vm.transactionInfo.transactionAmount,
                    'transactionCurrency': vm.i18n.transferCurrency,
                    'accRefId': vm.transactionInfo.fromAccount.accountReferenceId,
                    'fromAccountType': vm.transactionInfo.fromAccount.accountType,
                    'toAccountType': vm.transactionInfo.toAccount.accountType
                  }
                });
                vm.closeModal(data);
              }
            });
          }
        });
      });
    });

  TransferController.controller('TransferCancelConfirmCtrl',['easeUIModalService', 'transferState', '$state',
    'TransferFactory', 'TransferAnalytics', 'easeTemplates',
    function(easeUIModalService, transferState, $state, TransferFactory, TransferAnalytics, easeTemplates) {
      easeUIModalService.showModal({
        templateUrl:  easeTemplates.get('Transfer', '', 'cancel-confirm'),
        controller: 'TransferCancelConfirmModalCtrl'
      }).then(function(modal) {
        modal.close.then(function(data) {
          TransferFactory.removePrintClass();
          if (!data) {
            var currentLOB = transferState.getCurrentLOB();
            TransferAnalytics.trackAnalytics('', TransferFactory.getPageType(currentLOB));
            $state.go(currentLOB, {}, {
              reload: true
            });
          }
        });
      });
    }]);

  TransferController.controller('TransferCancelConfirmModalCtrl', function($scope, $state, $stateParams,  transferState,
    TransferFactory, TransferAnalytics, EaseLocalizeService, close, $q) {
    var vm = $scope;
    vm.contentData = TransferFactory.getContentData();
    var TransferMoneyStates = transferState.get();
    vm.transactionInfo = $stateParams.data;
    var lob = TransferAnalytics.buildLOB(
        vm.transactionInfo.fromAccountType, vm.transactionInfo.toAccountType);
    TransferAnalytics.trackAnalytics(lob, 'delete transfer', 'cancel confirmed');
    angular.extend(vm, {
			closeModal: function(data) {
				if (!vm.isLoading) {
					vm.close(data);
				}
			},
			close: close,
      isLoading: false,
      startAnotherTransfer: function() {
        vm.isLoading = true;
        var deferred = $q.defer();
        var promise =  $state.go(TransferMoneyStates.transferStart.name, {
          'referenceId': vm.transactionInfo.accountRefId
        });
        TransferAnalytics.trackAnalyticsByName('start another transfer:link');
        promise.then(function(data) {
					vm.isLoading = false;
          deferred.resolve(vm.closeModal(data));
        }, function(data) {
					vm.isLoading = false;
          deferred.reject(vm.closeModal(data));
        });
        return deferred.promise;
      }
    });
  });

  TransferController.controller('TransferErrorCtrl',['easeUIModalService', 'transferState', '$state',
    'TransferFactory', 'TransferAnalytics', 'easeTemplates',
    function(easeUIModalService, transferState, $state, TransferFactory, TransferAnalytics, easeTemplates) {
      easeUIModalService.showModal({
        templateUrl:  easeTemplates.get('Transfer', '', 'error'),
        controller: 'TransferErrorModalCtrl'
      }).then(function(modal) {
        modal.close.then(function(data) {
          TransferFactory.removePrintClass();
          if (!data) {
            var currentLOB = transferState.getCurrentLOB();
            TransferAnalytics.trackAnalytics('', TransferFactory.getPageType(currentLOB));
            $state.go(currentLOB, {}, {
              reload: true
            });
          }
        });
      });
    }]);

  TransferController.controller('TransferErrorModalCtrl', ['$scope', '$state', 'EaseLocalizeService',
    'transferState', '$stateParams', 'TransferFactory', 'close',
    function($scope, $state, EaseLocalizeService, transferState, $stateParams, TransferFactory, close) {
      var vm = $scope;
      vm.contentData = TransferFactory.getContentData();
      EaseLocalizeService.get('accountSummary').then(function(response) {
        vm.i18n = response;
      });

      angular.extend(vm, {
        close:close,
        featureUnavailableMsg: $stateParams.featureUnavailableMsg
      });
    }
  ]);

  TransferController.controller('TransferScheduleUnavailableCtrl',['easeUIModalService', 'transferState', '$state',
    'TransferFactory', 'TransferAnalytics', 'easeTemplates', '$stateParams', 'EaseConstant',
    function(easeUIModalService, transferState, $state, TransferFactory, TransferAnalytics, easeTemplates, $stateParams, EaseConstant) {
      easeUIModalService.showModal({
        templateUrl:  easeTemplates.get('Transfer', '', 'schedule-feature-unavailable'),
        controller: 'TransferScheduleUnavailableModalCtrl'
      }).then(function(modal) {
        modal.close.then(function(data) {
          var TransferMoneyStates = transferState.get();
          TransferFactory.removePrintClass();
          $stateParams.data.toStateName = undefined;
          $stateParams.data.previousStateName = EaseConstant.stateNames.transferScheduleUnavailable;
          $state.go(TransferMoneyStates.transferStart.name, {
            'referenceId': $stateParams.data.referenceId,
            'data': $stateParams.data
          });
        });
      });
    }]);

  TransferController.controller('TransferScheduleUnavailableModalCtrl', ['$scope', 'EaseLocalizeService',
    'TransferFactory', 'close',
    function($scope, EaseLocalizeService, TransferFactory, close) {
      var vm = $scope;
      vm.close = close;
      vm.contentData = TransferFactory.getContentData();

      EaseLocalizeService.get('accountSummary').then(function(response) {
        vm.i18n = response;
      });

      angular.extend(vm, {
        close: function() {
          close();
        },
        openTransferModal: function() {
          close();
        }
      });
    }
  ]);

  return TransferController;
});
