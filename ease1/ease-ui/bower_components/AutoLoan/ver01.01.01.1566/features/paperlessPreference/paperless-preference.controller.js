define(['angular'
  ],
  function() {
    'use strict';
    PaperlessPreferenceController.$inject =
      ['$state', 'autoLoanModuleService', 'paperlessPreferenceService', 'AutoLoanPubsubService'];
    function PaperlessPreferenceController($state,
                                           autoLoanModuleService, paperlessPreferenceService, autoLoanPubsubService) {
      autoLoanPubsubService.trackPageView({
        level2: 'account Details',
        level3: 'paperless'
      });

      var vm = this;
      vm.i18n = autoLoanModuleService.getI18n().coaf.paperlessModal;

      var accountReferenceId = autoLoanModuleService.getAccountDetailsData().accountDetails.accountReferenceId;

      paperlessPreferenceService.getPaperlessPreference(accountReferenceId).then(
        function(data) {
          vm.errorMessage = '';
          if (data.notificationMessage) {
            vm.errorMessage = data.notificationMessage.text;
          } else {
            vm.paperlessPref = data;
          }
        },
        function() {
          vm.errorMessage = vm.i18n.errorMessage.label.v1;
        }
      );

      vm.close = function() {
        autoLoanPubsubService.trackPageView({
          level2: 'account Details'
        });
        $state.go('^');

      };

      vm.submit = function() {
        paperlessPreferenceService.putPaperlessPreference(accountReferenceId, vm.paperlessPref.isEnrolled)
          .then(
            function(data) {
              vm.errorMessage = '';
              if (data && data.notificationMessage) {
                vm.errorMessage = data.notificationMessage.text;
              } else {
                $state.go('^');
              }
            },
            function() {
              vm.errorMessage = vm.i18n.errorMessage.label.v1;
            }
          );
      };

    }

    return PaperlessPreferenceController;
  });
