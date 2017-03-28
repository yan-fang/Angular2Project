define([
  'angular'
], function(angular) {
  'use strict';
  var transferModule = angular.module('TransferModule',
    ['EaseProperties', 'easeAppUtils', 'restangular', 'ngMessages']
  );

  transferModule.provider('transferState',
    ['easeTemplatesProvider', 'easeFilesProvider', 'EaseConstant', '$stateProvider',
    function(easeTemplatesProvider, easeFilesProvider, EaseConstant, $stateProvider) {

      var provider = this,
        currentLineOfBusiness = null,
        transferMoneyStatesArray = {};

      function TransferMoneyStatesModel(parentName, startName, successName, cancelName, cancelConfirmName,
                                        errorName, editName, url) {

        this.transferStart = {
          name: startName,
          url: !url ? EaseConstant.easeURLs.transfer: url,
          params: {
            data: ''
          },
          parent: parentName,
          resolve: {
            'transferService': function($ocLazyLoad, $injector) {
              return $ocLazyLoad.load({
                serie: true,
                files: [easeFilesProvider.get('constants', 'Transfer'),
                  easeFilesProvider.get('services', 'Transfer'),
                  easeFilesProvider.get('controller-index', 'Transfer'),
                  easeFilesProvider.get('controller-success', 'Transfer'),
                  easeFilesProvider.get('controller-error', 'Transfer'),
                  easeFilesProvider.get('controller-unavailable', 'Transfer'),
                  easeFilesProvider.get('directives', 'Transfer')
                ]
              }).then(function() {
                return $injector.get('TransferFactory')
              })
            },
            'transactionAsyncData': function(transferService, $stateParams, featureToggleFactory, EaseConstant,
                                             contentOneFactory, $q) {
              var item = {
                'category': $stateParams.category,
                'accountRefId': $stateParams.data ?
                  $stateParams.data.referenceId :
                  ($stateParams.referenceId ? $stateParams.referenceId : $stateParams.accountReferenceId)
              };
              transferService.setAccItem(item);
              if (!(/transferScheduleUnavailable/.test($stateParams.data.previousStateName))) {
                var promises = [];
                var deferred = $q.defer();
                promises.push(transferService.getTransferInfo());
                promises.push(contentOneFactory.initializeContentOneData('transfer'));
                $q.all(promises).then(function(data) {
                  if ((data[1]) && (data[0].isDisplayData)) {
                    transferService.setContentData(data[1]);
                    deferred.resolve(data[0]);

                  } else {
                    deferred.reject(data);
                  }
                });
                return deferred.promise;
              }
            }
          },
          onEnter: function($state, featureToggleFactory, EaseLocalizeService, EaseConstant) {
            var featureToggleDataPromise = featureToggleFactory.initializeFeatureToggleData();
            featureToggleDataPromise.then(function(featureToggleData) {
              if (featureToggleData && (featureToggleData[EaseConstant.features.transferFeatureName] ===
                false)) {
                EaseLocalizeService.get('accountSummary').then(function(response) {
                  $state.go(errorName, {
                    featureUnavailableMsg: response.transferFeatureUnavailableMsg
                  });
                });
              }

            });
          },
          controller: 'TransferIndexCtrl'
        };

        this.transferSuccess = {
          params: {
            transfer: ''
          },
          name: successName,
          url: '',
          parent: parentName,
          controller: 'TransferSuccessCtrl',
          resolve: {
            transferStatusdata: ['$stateParams',
              function($stateParams) {
                return $stateParams;
              }
            ]
          }
        };

        this.transferEdit = {
          name: editName,
          url: EaseConstant.easeURLs.editTransfer,
          parent: parentName,
          resolve: {
            'transferService': function($ocLazyLoad, $injector) {
              return $ocLazyLoad.load({
                name: 'TransferModule',
                files: [easeFilesProvider.get('constants', 'Transfer'),
                  easeFilesProvider.get('services', 'Transfer')
                ]
              }).then(function() {
                return $injector.get('TransferFactory')
              })
            },
            'transfersDependencies': function($ocLazyLoad) {
              return $ocLazyLoad.load({
                name: 'TransferModule',
                files: [
                  easeFilesProvider.get('controller-success', 'Transfer'),
                  easeFilesProvider.get('controller-edit', 'Transfer'),
                  easeFilesProvider.get('controller-error', 'Transfer'),
                  easeFilesProvider.get('controller-unavailable', 'Transfer'),
                  easeFilesProvider.get('directives', 'Transfer')
                ]
              })
            },
            'transactionAsyncData': function($injector, $stateParams, featureToggleFactory, EaseConstant,
                                             transferService, contentOneFactory, $q, $state, EaseLocalizeService) {
              var moneyTransferID = $stateParams.moneyTransferID;
              var moneyTransferReferenceId = $stateParams.moneyTransferReferenceId;
              var promises = [];
              var deferred = $q.defer();
              promises.push(transferService.getEditTransferInfo(moneyTransferID, moneyTransferReferenceId));
              promises.push(contentOneFactory.initializeContentOneData('transfer'));
              $q.all(promises).then(function(data) {
                if ((data[1]) && (data[0].isDisplayData)) {
                  transferService.setContentData(data[1]);
                  var transfer = data[0];
                  if (transfer.isEditableIndicator) {
                    transferService.setEditTransferData(transfer);
                    deferred.resolve(data[0]);
                  } else {
                    EaseLocalizeService.get('accountSummary').then(function(response) {
                      $state.go(errorName, {
                        featureUnavailableMsg: response.editTransferErr
                      });
                      deferred.reject(data);
                    });
                  }
                }
              });
              return deferred.promise;
            }
          },
          onEnter: function($state, featureToggleFactory, EaseLocalizeService, EaseConstant) {

            var featureToggleDataPromise = featureToggleFactory.initializeFeatureToggleData();
            featureToggleDataPromise.then(function(featureToggleData) {
              if (featureToggleData && (featureToggleData[EaseConstant.features.transferScheduledEditFeatureName] ===
                false)) {
                EaseLocalizeService.get('accountSummary').then(function(response) {
                  $state.go(errorName, {
                    featureUnavailableMsg: response.transferFeatureUnavailableMsg
                  });
                });
              }

            });
          },
          controller: 'TransferEditCtrl'
        };

        this.transferCancel = {
          name: cancelName,
          url: EaseConstant.easeURLs.cancelTransfer,
          parent: parentName,
          params:{
            data: null
          },
          controller: 'TransferCancelCtrl',
          resolve:{
            'transferService': function($ocLazyLoad, $injector) {
              return $ocLazyLoad.load({
                name: 'TransferModule',
                files: [easeFilesProvider.get('constants', 'Transfer'),
                  easeFilesProvider.get('services', 'Transfer')
                ]
              }).then(function() {
                return $injector.get('TransferFactory')
              })
            },
            'transfersDependencies': function($ocLazyLoad) {
              return $ocLazyLoad.load({
                name: 'TransferModule',
                files: [
                  easeFilesProvider.get('controller-cancel', 'Transfer'),
                  easeFilesProvider.get('controller-cancel-confirm', 'Transfer'),
                  easeFilesProvider.get('controller-error', 'Transfer'),
                  easeFilesProvider.get('controller-unavailable', 'Transfer'),
                  easeFilesProvider.get('directives', 'Transfer')
                ]
              })
            },
            'transactionAsyncData': function($injector, $stateParams, featureToggleFactory, EaseConstant,
                                             transferService, contentOneFactory, $q, EaseLocalizeService, $state) {
              var moneyTransferID = $stateParams.moneyTransferID;
              var moneyTransferReferenceId = $stateParams.moneyTransferReferenceId;
              var promises = [];
              var deferred = $q.defer();
              promises.push(transferService.getEditTransferInfo(moneyTransferID, moneyTransferReferenceId));
              promises.push(contentOneFactory.initializeContentOneData('transfer'));
              $q.all(promises).then(function(data) {
                if ((data[1]) && (data[0].isDisplayData)) {
                  transferService.setContentData(data[1]);
                  var transfer = data[0];
                  if (transfer.isCancelableIndicator) {
                    transferService.setEditTransferData(transfer);
                    deferred.resolve(transfer);
                  } else {
                    EaseLocalizeService.get('accountSummary').then(function(response) {
                      $state.go(errorName, {
                        featureUnavailableMsg: response.cancelTransferErr
                      });
                    });
                  }
                } else {
                  deferred.reject(data);
                }
              });
              return deferred.promise;
            }
          },
          onEnter: function($state, featureToggleFactory, EaseLocalizeService, EaseConstant) {
            var featureToggleDataPromise = featureToggleFactory.initializeFeatureToggleData();
            featureToggleDataPromise.then(function(featureToggleData) {
              if (featureToggleData && (featureToggleData[EaseConstant.features.transferScheduledCancelFeatureName] ===
                false)) {
                EaseLocalizeService.get('accountSummary').then(function(response) {
                  $state.go(errorName, {
                    featureUnavailableMsg: response.transferFeatureUnavailableMsg
                  });
                });
              }
            });
          }
        };

        this.transferCancelConfirm = {
          name: cancelConfirmName,
          url: '',
          parent: parentName,
          params:{
            data: null
          },
          controller: 'TransferCancelConfirmCtrl'
        };

        this.transferError = {
          params: {
            featureUnavailableMsg: ''
          },
          name: errorName,
          url: '',
          parent: parentName,
          controller: 'TransferErrorCtrl'
        };

      }

      angular.extend(provider, {
        set: function(parentName, startName, successName, cancelName, cancelConfirmName, errorName, editName,url) {

          var newTransferMoneyState = new TransferMoneyStatesModel(parentName, startName, successName,
            cancelName, cancelConfirmName, errorName, editName, url);
          currentLineOfBusiness = parentName.name;
          transferMoneyStatesArray[parentName.name] = newTransferMoneyState;
          var transferScheduleUnavailable = {
            params: {
              data: null
            },
            name: this.getCurrentLOB() + '.' + EaseConstant.stateNames.transferScheduleUnavailable,
            parent: this.getCurrentLOB(),
            url: '',
            controller: 'TransferScheduleUnavailableCtrl'
          };
          this.addTransferState(transferScheduleUnavailable);
        },
        get: function() {

          return transferMoneyStatesArray[currentLineOfBusiness];
        },
        setCurrentLOB: function(lob) {
          currentLineOfBusiness = lob;
        },
        getCurrentLOB: function() {
          return currentLineOfBusiness;
        },
        addTransferState: function(state) {
          $stateProvider.state(state);
        }
      });

      this.$get = function() {
        return provider;
      };
    }]);

  return transferModule;
})
