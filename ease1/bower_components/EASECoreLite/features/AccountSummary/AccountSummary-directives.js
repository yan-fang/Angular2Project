define(['angular'], function(angular) {
  'use strict';
  var summaryModule = angular.module('summaryModule');

  summaryModule.directive('accountMessage', accountMessage);

  function accountMessage(TemplateSelectionFactory, EASEUtilsFactory, messagingService, $filter, featureToggleFactory,
                          EaseConstant, $state, pubsubService, SingleProdService) {
    return {
      restrict: 'AE',
      transclude: true,
      scope: {
        selected: '=selected',
        index: '=idx',
        element: '=obj',
        nbrOfAccount: '=nbrOfAccount'
      },
      templateUrl: '/ease-ui/dist/features/AccountSummary/html/directives/accountMessage.html',
      link: linker
    };

    function validAsOfTimestamp(scope) {
      if (scope.element && scope.element.validAsOfTimestamp && (_.isEqual(scope.element.category, 'CC'))) {
        var asOfDate = new Date(scope.element.validAsOfTimestamp);
        scope.messageObj = {
          type: 'GENERAL',
          level: 'critical',
          message: 'Your account details were last updated ' + $filter('date')(asOfDate, "MMM d 'at' HH:mm a") +
            '.'
        };
      }
    }

    function linker(scope, elem) {
      scope.element.checkAmountDigits = function() {
        var balanceAmount = parseFloat(scope.element.dollarAmount.replace(/,/g, ''));
        if (balanceAmount > 999999) {
          var amountElems = document.getElementsByClassName('amount');
          amountElems[scope.index].classList.add('million');
        }
      }

      /**
       * set the focus to either the escape-hatch or capitalone logo.
       */
      EASEUtilsFactory.getFocusForEscapeHatch();

      var contentData = TemplateSelectionFactory.getContentData();
      scope.loading = '';
      scope.alertIcon = contentData['ease.core.acctsummary.alert.image'];

      elem.bind('click', function() {
        if (!scope.element.isNotClickable && !scope.element.hasNoLoadingClass) {
          this.childNodes[0].style.height = this
            .childNodes[0].clientHeight + 'px';
          scope.loading = 'loading';
        }
      });
      var showSecondaryData = function() {
        if (scope.nbrOfAccount >= 1) {
          return;
        } else {
          var objSecondaryData =
            TemplateSelectionFactory.getSecondaryDataForLob(
              scope.element, scope.messageObj, scope.nbrOfAccount
            );
          var isFindMessage = false;
          if (objSecondaryData !== null && scope.nbrOfAccount >= 1) {
            if (objSecondaryData.attrVal !== null && scope.element[objSecondaryData.attrVal] !== undefined) {
              scope.messageObj = {
                type: 'SecondaryData',
                level: '',
                message: objSecondaryData.message + EASEUtilsFactory.commaFormattedMoneyByCurrency(
                  scope.element[objSecondaryData.attrVal], 'USD'
                )
              };
              isFindMessage = true;
            } else {
              scope.messageObj = objSecondaryData;
              if (!isFindMessage) {
                scope.messageObj = {
                  type: 'SecondaryData',
                  level: '',
                  message: (objSecondaryData[0]) ?
                    objSecondaryData[0].message : ''
                };
              }
              isFindMessage = true;
            }
          }
          if (!isFindMessage) {
            if (typeof objSecondaryData[0] !== 'undefined') {
              scope.messageObj = {
                type: 'SecondaryData',
                level: '',
                message: objSecondaryData[0].message
              };
            }
          }
        }
      };
      if (scope.element.contentImage) {
        var cdnLink = 'https://content.capitalone.com';
        if (EASEUtilsFactory.isHighDensityScreen()) {
          scope.element.bground = cdnLink + scope.element.contentImage.hiRes.tileBackground;
          scope.element.imagePath = scope.element.contentImage.hiRes.logo ? cdnLink +
            scope.element.contentImage.hiRes.logo : "";
        } else {
          scope.element.bground = cdnLink + scope.element.contentImage.lowRes.tileBackground;
          scope.element.imagePath = scope.element.contentImage.lowRes.logo ? cdnLink +
            scope.element.contentImage.lowRes.logo : "";
        }
      }

      if (scope.element.showPrimaryData && (scope.element.category === 'HIL' || scope.element.category === 'HLC')) {
        if (parseFloat(scope.element.availableBalance) > 0 &&
          (scope.element.availableBalance == 0 || scope.element.availableBalance)) {
          scope.element.primaryDisplayData = contentData['ease.core.acctsummary.availbal.label'];
        } else if ((parseFloat(scope.element.availableBalance) <= 0 || scope.element.availableBalance === '' || (
            scope.element.availableBalance && scope.element.availableBalance.toString().trim() === '') || (!scope
            .element.availableBalance)) && (scope.element.displayBalance === 0 || (scope.element.displayBalance &&
            scope.element.displayBalance.toString().trim() !== ''))) {
          scope.element.primaryDisplayData = contentData['ease.core.acctsummary.principal.label'];
        } else if ((scope.element.availableBalance === 'null' && scope.element.displayBalance) ||
          (scope.element.displayBalance === 0 ||
            (scope.element.displayBalance && scope.element.displayBalance.toString().trim() !== ''))) {
          scope.element.primaryDisplayData = contentData['ease.core.acctsummary.principal.label'];
        }
      }



      if (scope.element.accountMessage) {
        if (scope.element.accountMessage[0].message) {
          scope.messageObj = scope.element.accountMessage[0];
        } else {
          scope.element.accountMessage[0].message = "";
          scope.messageObj = scope.element.accountMessage[0];
          validAsOfTimestamp(scope);
        }
      } else {
        showSecondaryData();
        validAsOfTimestamp(scope);
      }
      scope.closeMessage = function(e) {
        showSecondaryData();
        e.preventDefault();
        e.stopPropagation();
      };
      scope.navigateToMudFlapLink = function(e, accountMessage) {
        if (accountMessage.msgLink.path) {
          EASEUtilsFactory.redirectLinking(accountMessage.msgLink);
          pubsubService.pubsubTrackAnalytics({ name: 'mudflap:button',
            interactionMessage: { click : accountMessage.messageAnalyticsTracker}});
          if (accountMessage.responseUrlHref) {
            messagingService.responseMessageApi(accountMessage.responseUrlHref, 'ACCEPT');
          }
        }
        e.stopPropagation();
      };
      scope.getStateMessageClass = function() {
        var returnClass = '';
        if (scope.selected !== scope.index && scope.messageObj !== undefined && scope.messageObj.message !==
          undefined) {
          if (scope.messageObj.message !== '' && scope.messageObj.level === 'open') {
            returnClass += 'info';
          } else {
            returnClass += scope.messageObj.level ? scope.messageObj.level : 'info';
          }
        }
        if (scope.nbrOfAccount === 1) {
          if (scope.messageObj) {
            if (scope.messageObj.level === 'togglerestricted' && returnClass === '') {
              returnClass += 'togglerestricted';
            }
          }
          returnClass += ' singleProdView';
        }
        return returnClass.trim();
      };

      scope.showStateMessage = function() {
        var featureToggleData = featureToggleFactory.getFeatureToggleData();
        if (featureToggleData[EaseConstant.features.enableMudFlap] === false && scope.messageObj !== undefined &&
          scope.messageObj.article !==
          undefined) {
          return true;
        } else {
          var emptyMessage = typeof scope.messageObj === 'undefined' || typeof scope.messageObj.message ===
            'undefined' || scope.messageObj
            .message === '';
          return (scope.selected === scope.index || (scope.messageObj !== undefined && ['togglerestricted',
            'unavailable',
            'restricted', 'closed'
          ].indexOf(scope.messageObj.level) !== -1) || emptyMessage);
        }
      };

      scope.getTruncatedMessage = function() {
        if (scope.messageObj !== undefined && (scope.messageObj.level === 'critical')) {
          return scope.messageObj.message;
        }
      };
      scope.showIconMessage = function() {
        if (scope.messageObj) {
          return (['critical', 'closed', 'restricted'].indexOf(scope.messageObj.level) !== -1);
        }
      };
      scope.showCloseIcon = function() {

      };

      scope.service = messagingService;
      scope.$watch('service.messagingReferenceId', function(newValue, oldValue) {
        if (!newValue && newValue !== oldValue) {
          return;
        }
        messagingService.messages.forEach(function(data) {
          if (scope.element.referenceId === data.messagingReferenceId) {
            if (!scope.element.accountMessage) {
              scope.element.accountMessage = [];
            }
            if (scope.element.accountMessage.length === 0) {
              var len = data.flapMessages.length;
              if (!scope.element.validAsOfTimestamp) {
                if (len > 0) {
                  for (var k = 0; k < len; k++) {
                    if (data.flapMessages[k].message !== '') {
                      scope.element.accountMessage.push(data.flapMessages[k]);
                      break;
                    }
                  }
                }
                if (scope.element.accountMessage.length > 0) {
                  scope.messageObj = scope.element.accountMessage[0];
                }
              }
            }
            if (data.buttonMessage) {
              scope.element.actionButton = data.buttonMessage;
            } else {
              var buttonMessage = {
                action: EaseConstant.defaultBtnAction,
                buttonText: EaseConstant.defaultBtn,
                messageAnalyticsTracker: '',
                pubsub: 'default'
              }
              scope.element.actionButton = buttonMessage;
            }
          }
        });
      });
    }
  }
  accountMessage.$inject = ["TemplateSelectionFactory", "EASEUtilsFactory", "messagingService", "$filter", "featureToggleFactory", "EaseConstant", "$state", "pubsubService", "SingleProdService"];
});
