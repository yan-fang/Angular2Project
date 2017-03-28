define(['angular'], function(angular) {
  angular.module('easeAppUtils')
    .factory('displayModal', ["$q", "$ocLazyLoad", "EaseModalService", "easeTemplates", "easeFiles", "pubsubService", function($q, $ocLazyLoad, EaseModalService, easeTemplates, easeFiles, pubsubService) {
      return {
        addExternalPayment: function() {
          $ocLazyLoad.load([easeFiles.get('controller', 'UMMPayment'),
              easeFiles.get('services', 'UMMPayment'),
              easeFiles.get('directives', 'UMMPayment')
            ])
            .then(function(path) {
              pubsubService.pubsubTrackAnalytics({ name: 'add payment account:button' });
              EaseModalService(easeTemplates.get('UMMPayment', '', 'addExternalAcc'), {});
            })
        },
        displayAddExtAccountSuccess: function() {
          EaseModalService(easeTemplates.get('UMMPayment', '', 'addExternalAccSuccess'), {});
        }
      }
    }])
});
