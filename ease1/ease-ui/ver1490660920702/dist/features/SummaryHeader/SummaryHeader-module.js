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
            if (!target) {
              target = document.querySelector(attrs.slideToggle);
            }
            if (!content) {
              content = target.querySelector('.slideable_content');
            }
            var menuNode = angular.element(target);
            var profileLink = angular.element(document.getElementById('profileLink'));
            if (menuNode.hasClass('slideup')) {
              menuNode.removeClass('slideup');
              element.attr('aria-expanded', 'true');
              menuNode.addClass('slidedown');
              profileLink.addClass('clicked');
              addAccessibiityMenu(true, menuNode);
              scope.anchorNodes[scope.itemIdxFocus].focus();
            } else {
              menuNode.removeClass('slidedown');
              element.attr('aria-expanded', 'false');
              menuNode.addClass('slideup');
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

              if (headerElems.contains(event.target) || (linksElems && linksElems.contains(event.target))) {
                IshideNavBar = true;
              }

              if (IshideNavBar) {
                return;
              } else {
                var ele = angular.element(linksElems);
                if (ele.hasClass('slidedown')) {
                  $timeout(function() {
                    ele.removeClass('slidedown');
                    ele.attr('aria-expanded', 'false');
                    ele.addClass('slideup');
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
    'EaseLocalizeService', 'ContentConstant', 'featureToggleFactory',
    'summaryService', '$scope', '_', '$timeout'
  ];

  function easeHeaderController($rootScope, $state, EASEUtilsFactory, EaseConstant, pubsubService,
    EaseLocalizeService, ContentConstant, featureToggleFactory, summaryService,
    $scope, _, $timeout) {

    var vm = this;
		vm.pending = false;

    // models
    angular.extend(vm, {
      headerOptions: EaseConstant.easeHeaderOptions,
      loadingBack: '',
      enableDisplayAlerts : false,
      contentData: _.isEmpty(EASEUtilsFactory.getglobalHeaderContentData()) ?
        ContentConstant.kCoreGlobalHeaderData : EASEUtilsFactory.getglobalHeaderContentData(),
      dropdownContentData: _.isEmpty(EASEUtilsFactory.getdropdownContentData()) ?
        ContentConstant.kCoreProfileDropdownData : EASEUtilsFactory.getdropdownContentData()
    });

		var destroyDisable = $rootScope.$on('disable', function(evt, args) {
			vm.pending = args;
		});

    // destroy disable event
    $scope.$on('$destroy', destroyDisable);

    // methods
    angular.extend(vm, {
      getProfileImage: function() {
        return EASEUtilsFactory.getProfileImage();
      },
			navigateTo: function(slug) {
      	if (vm.pending) {
      		return;
				}
				$state.go(slug);
			},
      goBack: function() {
				vm.pending = true;
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
      }
    });

    var removeHeaderContentListener = $rootScope.$on('headerContentLoaded', function() {
      vm.contentData = _.isEmpty(EASEUtilsFactory.getglobalHeaderContentData()) ?
        ContentConstant.kCoreGlobalHeaderData : EASEUtilsFactory.getglobalHeaderContentData();
      vm.dropdownContentData = _.isEmpty(EASEUtilsFactory.getdropdownContentData()) ?
        ContentConstant.kCoreProfileDropdownData : EASEUtilsFactory.getdropdownContentData();
      removeHeaderContentListener();
    });

    $rootScope.$on('$stateChangeSuccess',
      function(event, toState) {
				vm.pending = false;
        vm.isBackButton = !(/logout/.test(toState.name) || /welcome/.test(toState.name) || /verify/.test(toState.name) ||
        /accountSummary/.test(toState.name) || /payment/.test(toState.name) ||
        /SummAccPrefAddExtAccount/.test(toState.name) || /escid/.test(toState.name));
        vm.isProfile = vm.isFeedBackButton = !(/logout/.test(toState.name) || /welcome/.test(toState.name) || /verify/.test(toState.name) ||
        /escid/.test(toState.name));
        vm.loadingBack = '';
        angular.element(document.getElementById('profileLink')).removeClass('clicked')
      });

    $rootScope.$on('logout', function() {
      vm.isFeedBackButton = vm.isBackButton = vm.isProfile = false;
    });

    $rootScope.$on('error', function($state) {
      var state = $state.currentScope.$state.current;
      vm.isBackButton = !(/logout/.test(state.name) || /accountSummary/.test(state.name) || /welcome/.test(state.name) || /verify/.test(state.name));
    });

    function summaryLoadedHandler() {
      var featureToggleDataPromise = featureToggleFactory.initializeFeatureToggleData();
      featureToggleDataPromise.then(function(featureToggleData) {
        if(featureToggleData) {
          vm.enableDisplayAlerts = EASEUtilsFactory.isShowAlerts(featureToggleData, summaryService.getLobArray());
        } else {
          vm.enableDisplayAlerts = false;
          console.error(error);
        }
      });
    }

    var unbindFeatureToggleReadyListener = $rootScope.$on('featureToggleReady', summaryLoadedHandler);
    $scope.$on('$destroy', unbindFeatureToggleReadyListener);

    var unbindSummaryLoadedListener = $rootScope.$on('summaryLoaded', summaryLoadedHandler);

    $scope.$on('$destroy', unbindSummaryLoadedListener);

    EaseLocalizeService.get('header').then(function(response) {
      vm.i18n = response;
    }, function(error) {
      console.error(error);
    });
  }

});
