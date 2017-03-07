define(['angular'], function(angular) {
  'use strict';
  var UMMPaymentController = angular.module('UMMPaymentModule');

  UMMPaymentController.controller('AddExternalAccountCtrl', function($scope, EaseLocalizeService, UmmPaymentFactory,
    EASEUtilsFactory, pubsubService, displayModal, $timeout, ContentConstant, $state, $rootScope,
    appCookie, $interval) {

    var vm = this;
    var accountTypes = {};
    var contentDataAddExtAcct = {};
    //pubsub event
    pubsubService.pubsubTrackAnalytics({ name: 'add payment account:button' });
    pubsubService.pubsubTrackAnalytics({
      taxonomy: {
        level1: 'ease',
        level2: 'add payment account',
        level3: '',
        level4: '',
        level5: '',
        country: 'us',
        language: 'english',
        system: 'ease_web'
      },
      lob: ''
    });

    EaseLocalizeService.get('payment').then(function(response) {
      vm.i18n = response;
    }, function(error) {
      console.log(error);
    });

    vm.contentDataAddExtAcct = UmmPaymentFactory.getContentOneData()[ContentConstant.kCoreAddExternalAccounts + ContentConstant.kLanguagePreferences];

    angular.extend(vm, {
      isAccPreferencesState: $state.current.name === 'AddExtAccount',
      modalType: 'externalPayment',
      populateAccountTypeValues: function(contentDataAddExtAcct) {
        accountTypes = UmmPaymentFactory.populateAccountTypeValues(contentDataAddExtAcct);
        return accountTypes;
      },
      addExternalAccount: function() {
        vm.loadingClass = 'loading';
        var formData = {
          'accountNumberTLNPI': $scope.addExtPayAcct.accountFields.accountNumber,
          'abaNumber': $scope.addExtPayAcct.accountFields.abaNumber,
          'accountType': $scope.addExtPayAcct.accountFields.accountType.value,
          'accountUseDescription': $scope.addExtPayAcct.accountFields.accountType.accountUseDescription
        };

        UmmPaymentFactory.saveExternalAccount(formData).then(function(response) {
          vm.loadingClass = '';
          if (response.easeDisplayError && response.easeDisplayError.displayMessage) {
            if (response.easeDisplayError.severity !== '1') {
              vm.errorText = response.easeDisplayError.displayMessage;
              var el = document.getElementById('errorText');
              el.setAttribute("tabIndex", "-1");
              $timeout(function() {
                el.focus();
              });
            } else {
              vm.deleteModal = true;
              $state.go('customerSettings.settings');
            }
          } else {
            pubsubService.pubsubTrackAnalytics({
              taxonomy: {
                level1: 'ease',
                level2: 'add payment account',
                level3: 'confirmation',
                level4: '',
                level5: '',
                country: 'us',
                language: 'english',
                system: 'ease_web'
              },
              lob: ''
            });
            vm.errorText = "";
            if (vm.isAccPreferencesState) {
              vm.deleteModal = true;
              $scope.$modalCancel();
              displayModal.displayAddExtAccountSuccess();
            } else {
              $rootScope.$broadcast('EXT_ACCOUNT_ADDED', $scope.addExtPayAcct.accountFields);
            }
          }
        }, function(ex) {
          vm.loadingClass = '';
        })
      },
      close: function() {

        var currentParent = $state.current.parent;
        var targetParent = angular.isString(currentParent) ? $state.get(currentParent) : currentParent;
        $state.go(targetParent.name);
      }
    })
  });

  UMMPaymentController.controller('SuccessExtUMMPaymentCtrl',
    function($scope, $state, EaseLocalizeService, UmmPaymentFactory, EaseModalService, pubsubService, contentOneFactory,
      ContentConstant) {

      var vm = this;
      vm.extSuccessContent = contentOneFactory.getContentOneData(ContentConstant.kAddExternalAccount)[ContentConstant.kCoreAddExternalAccounts +
        ContentConstant.kLanguagePreferences];

      EaseLocalizeService.get('accountSummary').then(function(response) {
        vm.i18n = response;
      }, function(error) {
        console.log(error);
      });

      angular.extend(vm, {
        bankName: UmmPaymentFactory.getBankName(),
        close: function() {
          $scope.$modalCancel();
          $state.go('customerSettings.settings', { focusflag: true }, { reload: true });
        },
        modalType: 'successModalExt',
        modalClass: 'icon-check'
      });
    });

  return UMMPaymentController;
})
