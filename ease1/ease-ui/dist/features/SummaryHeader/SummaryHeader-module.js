define(['angular'], function(angular) {
  'use strict';
  angular.module('SummaryHeaderModule', ['ngAria', 'ngAnimate', 'ui.router', 'ContentProperties'])
    .directive('slideToggle', ['pubsubService', '$document', '$timeout', function(pubsubService, $document, $timeout) {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {

          //TODO [YS]: We need to revisit this code and use attrs instead.
          var target, content;
          scope.anchorNodes = [];
          var moveFocusItem = function(way) {
            if (way === 'up') {
              scope.itemIdxFocus -= 1;
            } else if (way === 'down') {
              scope.itemIdxFocus += 1;
            }
            if (scope.itemIdxFocus < 0) {
              scope.itemIdxFocus = scope.anchorNodes.length - 1;
            } else if (scope.itemIdxFocus >= scope.anchorNodes.length) {
              scope.itemIdxFocus = 0;
            }
            scope.anchorNodes[scope.itemIdxFocus].focus();
          };
          var addAccessibiityMenu = function(toggle, menuNode) {
            var nameDrop = angular.element(document.getElementById('name_drop'));
            if (scope.anchorNodes.length === 0) {
              scope.anchorNodes = nameDrop.find('a');
            }
            scope.itemIdxFocus = 0;
            if (toggle) {
              nameDrop.on('keydown', function(evt) {
                var keyCode = evt.which || evt.keyCode || evt.charCode;
                if (keyCode === 13) {
                  document.activeElement.click();
                  showHideMenu(angular.element(evt.target));
                } else {
                  if (keyCode === 27 || keyCode === 9) {
                    showHideMenu(angular.element(menuNode));
                  } else if (keyCode === 38) { //moveFocusItem('up');
                    moveFocusItem('up');
                  } else if (keyCode === 40) { //moveFocusItem('down');
                    moveFocusItem('down');
                  } else {
                    return true;
                  }
                  evt.stopPropagation();
                  evt.preventDefault();
                  return false;
                }
              });
            } else {
              nameDrop.off('keydown');
            }
          }
          var showHideMenu = function(menuNode) {
            if (menuNode[0] && menuNode[0].id !== 'signOut') {
              pubsubService.pubsubNavClick({ navName: 'nav:customer preferences' });
            }
            if (!target) {
              target = document.querySelector(attrs.slideToggle);
            }
            if (!content) {
              content = target.querySelector('.slideable_content');
            }
            var menuNode = angular.element(target);
            var profileLink = angular.element(document.getElementById('profileLink'));
            if (menuNode.hasClass('headerslideup')) {
              menuNode.removeClass('headerslideup');
              element.attr('aria-expanded', 'true');
              menuNode.addClass('headerslidedown');
              profileLink.addClass('clicked');
              addAccessibiityMenu(true, menuNode);
              scope.anchorNodes[scope.itemIdxFocus].focus();
            } else {
              menuNode.removeClass('headerslidedown');
              element.attr('aria-expanded', 'false');
              menuNode.addClass('headerslideup');
              profileLink.removeClass('clicked');
              addAccessibiityMenu(false, menuNode);
              element[0].focus();
            }
          }
          attrs.expanded = false;
          angular.element(element[0].parentNode).bind('keydown', function(evt) {
            if (evt.keyCode === 13 || evt.keyCode === 40) {
              showHideMenu(angular.element(evt.target.firstElementChild));
            } else {
              return true;
            }
            evt.stopPropagation();
            evt.preventDefault();
            return false;
          });

          element.bind('click', function(evt) {
            showHideMenu(angular.element(evt.target));
          });

          $document.on('click', function(event) {
            if (element[0].id === 'navLinks') {
              var headerElems = element[0].parentNode;
              var linksElems = document.getElementById('name_drop');
              var IshideNavBar = false;

              if (headerElems.contains(event.target) || linksElems.contains(event.target)) {
                IshideNavBar = true;
              }

              if (IshideNavBar) {
                return;
              } else {
                var ele = angular.element(linksElems);
                if (ele.hasClass('headerslidedown')) {
                  $timeout(function() {
                    ele.removeClass('headerslidedown');
                    ele.attr('aria-expanded', 'false');
                    ele.addClass('headerslideup');
                    ele.off('keydown');
                    angular.element(document.getElementById('profileLink')).removeClass('clicked');
                  }, 200);
                }
              }
            }
          });
        }
      };
    }])
    .directive('easeHeader', function() {
      return {
        restrict: 'E',
        scope: {},
        templateUrl: '/ease-ui/dist/features/SummaryHeader/html/SummaryHeader-index.html',
        controller: 'easeHeaderController',
        controllerAs: 'headerCtrl'
      }
    })
    .controller('easeHeaderController', easeHeaderController);

  easeHeaderController.$inject = ['$rootScope', '$state', 'EASEUtilsFactory', 'EaseConstant', 'pubsubService',
    'EaseLocalizeService', '$sessionStorage', 'ContentConstant', 'featureToggleFactory'
  ];

  function easeHeaderController($rootScope, $state, EASEUtilsFactory, EaseConstant, pubsubService,
    EaseLocalizeService, $sessionStorage, ContentConstant, featureToggleFactory) {

    var vm = this;

    // models
    angular.extend(vm, {
      headerOptions: EaseConstant.easeHeaderOptions,
      loadingBack: ''
    });

    // methods
    angular.extend(vm, {
      getProfileImage: function() {
        return EASEUtilsFactory.getProfileImage();
      },
      goBack: function() {
        vm.loadingBack = 'loading';
        pubsubService.pubsubButtonClick({ buttonName: 'back' });
        $state.go(EaseConstant.states.kAccountSummary);
      },
      logout: function() {
        pubsubService.pubsubLinkClick({ linkName: 'sign out' });
        $state.go('logout', {}, { location: false });
      },
      displayUserName: function() {
        return EASEUtilsFactory.getCustomerSummary().greetingName;
      },
      clickSneakPeekLink: function() {
        pubsubService.pubsubTrackAnalytics({
          name: 'sneak peek:link'
        });
      },
      sendButtonEvent: function() {
        pubsubService.pubsubTrackAnalytics({ name: 'capitalone:button' });
      },
      contentData: function() {
        return {
          "ease.core.global.header.back.label":"Back",
          "ease.core.global.header.back.aria.label":"Click Here to go back",
          "ease.core.global.header.sneakpeak.link":"http://www.capitalone.com/sneakpeek/",
          "ease.core.global.header.loading.alttext.label":"Loading",
          "ease.core.global.header.aria.label":"Header",
          "ease.core.global.header.capone.logo.label":"Capital One",
          "ease.core.global.header.sneakpeek.aria.label":"Sneak Peek",
          "ease.core.global.header.browsertab":"Capital One",
          "ease.core.global.header.sneakpeek.image.aria.label":"Click the sneak peek icon to see the sneak peek page",
          "ease.core.global.header.browsertab.label":"Capital One",
          "ease.core.global.header.capone.logo.aria.label":"Capital One Home button. Click to go to the home page.",
          "ease.core.global.header.sneakpeek.label":"Sneak Peek",
          "ease.core.global.header.capone.logo.link":"http://www.capitalone.com/"
        }
      }
    });

    $rootScope.$on('$stateChangeSuccess',
      function(event, toState) {
        vm.isBackButton = !(/logout/.test(toState.name) || /welcome/.test(toState.name) || /migrate/.test(toState.name) ||
        /accountSummary/.test(toState.name) || /payment/.test(toState.name) ||
        /SummAccPrefAddExtAccount/.test(toState.name) || /escid/.test(toState.name));
        vm.isProfile = vm.isFeedBackButton = !(/logout/.test(toState.name) || /welcome/.test(toState.name) || /migrate/.test(toState.name) ||
        /escid/.test(toState.name));
        vm.loadingBack = '';
        angular.element(document.getElementById('name_drop')).removeClass('headerslidedown').addClass('headerslideup');
        angular.element(document.getElementById('profileLink')).removeClass('clicked')
      });

    $rootScope.$on('logout', function() {
      vm.isFeedBackButton = vm.isBackButton = vm.isProfile = false;
    });

    $rootScope.$on('error', function($state) {
      var state = $state.currentScope.$state.current;
      vm.isBackButton = !(/logout/.test(state.name) || /accountSummary/.test(state.name) || /welcome/.test(state.name) || /migrate/.test(toState.name));
    });


    EaseLocalizeService.get('header').then(function(response) {
      vm.i18n = response;
    }, function(error) {
      console.error(error);
    });

    vm.dropdownContentData = {
      'ease.core.profiledropdown.signout.aria.label': 'Click here to Sign Out',
      'ease.core.profiledropdown.accountprefs.label': 'Settings',
      'ease.core.profiledropdown.messagesalerts.label': 'Alerts',
      'ease.core.profiledropdown.accountprefs.target.label': '/Settings',
      'ease.core.profiledropdown.signout.action.label': 'logout',
      'ease.core.profiledropdown.accountprefs.aria.label': 'Click here to view your Account Settings',
      'ease.core.profiledropdown.peronalinfo.aria.label': 'Click here to view your Profiile Information',
      'ease.core.profiledropdown.messagesalerts.target.label': '/Alerts',
      'ease.core.profiledropdown.securitysettings.target.label': '/Security',
      'ease.core.profiledropdown.profile.target.label': '/Profile',
      'ease.core.profiledropdown.messagesalerts.aria.label': 'Click here to manage your Alerts',
      'ease.core.profiledropdown.profile.label': 'Profile',
      'ease.core.profiledropdown.peronalinfo.target.label': '/personalInformation',
      'ease.core.profiledropdown.securitysettings.aria.label': 'Click here to view Security Settings',
      'ease.core.profiledropdown.securitysettings.label': 'Security',
      'ease.core.profiledropdown.personalinfo.label': 'Personal Information',
      'ease.core.profiledropdown.signout.label': 'Sign Out'
    };

    featureToggleFactory.initializeFeatureToggleData().then(function(data) {
      vm.enableDisplayAlerts = data[EaseConstant.features.enableDisplayAlerts];
    },function(error) {
      vm.enableDisplayAlerts = false;
      console.error(error);
    })

  }

});
