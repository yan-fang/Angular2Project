define([
  'angular'
], function(angular) {
  'use strict';
  angular.module('SessionTimeoutModule', ['easeAppUtils'])
    .controller('SessionTimeoutController', SessionTimeoutController)
    .controller('summaryError', summaryErrorController);

  SessionTimeoutController.$inject = ["$injector", "$scope", "$rootScope", "$interval", "$state",
    "EaseConstant", "EASEUtilsFactory", "Idle", "contentOneFactory", "ContentConstant", "$document"];

  function SessionTimeoutController($injector, $scope, $rootScope, $interval, $state,
    EaseConstant, EASEUtilsFactory, Idle, contentOneFactory, ContentConstant, $document) {
    var vm = this, warningTime = '';
    function closeModal() {
      vm.displayTimeout = '';
      if (vm.pageContent) {
        vm.pageContent.setAttribute('aria-hidden', 'false');
      }
    }
    angular.extend(vm, {
      timeUnit: 'seconds',
      initClose: false,
      isIdle: false,
      contentData:'',
      pageContent: $document[0].getElementById('page-content'),
      signOut: function() {
        $rootScope.$emit('IdleTimeout');
      },
      close: function() {
        closeModal();
      },
      displayTimeout: '',
      modalType: 'timeoutModal'
    });


    $rootScope.$on('IdleStart', function () {
      vm.isIdle = true;
      var data = contentOneFactory.getContentOneData(ContentConstant.kSessionTimeout);
      vm.contentData = data[ContentConstant.kCoreSession + ContentConstant.kLanguagePreferences];
      vm.displayTimeout = '/ease-ui/dist/features/SessionTimeout/html/SessionTimeout-index.html';
      if (vm.pageContent) {
        vm.pageContent.setAttribute('aria-hidden', 'true');
      }

    });

    $rootScope.$on('IdleTimeout', function() {
      closeModal();
      $state.go('logout', {}, {location:false});
    });

    // the user has come back from AFK and is doing stuff. if you are warning them, you can use this to hide the dialog
    $rootScope.$on('IdleEnd', function() {
      $scope.$apply(function(){
        vm.isIdle = false;
      });
    });
  }

  function summaryErrorController($scope, $rootScope, $document, $timeout) {
    var vm = this;
    angular.extend(vm, {
      initClose: false,
      modalType: 'errorModal',
      errorModal: '',
      pageContent: $document[0].getElementById('page-content'),

      close: function() {
        vm.errorModal= '';
        vm.modalType= '';
        if (vm.pageContent) {
          vm.pageContent.setAttribute('aria-hidden', 'false');
        }

				$rootScope.$broadcast('snag', 'closed');
      }
    });
    $rootScope.$on('error', function(event, args) {
      vm.errorMsg = args;
      vm.modalClass = "";
      vm.modalType = 'errorModal';
      vm.errorModal= '/ease-ui/dist/features/AccountSummary/html/partials/error-partial.html';
      $timeout(function() {
        if (vm.pageContent) {
          vm.pageContent.setAttribute('aria-hidden', 'true');
        } else {
					vm.pageContent.setAttribute('aria-hidden', 'false');
				}
      }, 100);
      
    });
  }
  summaryErrorController.$inject = ["$scope", "$rootScope", "$document", "$timeout"];
});
