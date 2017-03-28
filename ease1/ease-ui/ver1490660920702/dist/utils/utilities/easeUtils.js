define(['require', 'angular'], function(require, angular) {
  'use strict';
  var easeUtilsModule = angular.module('easeAppUtils', ['restangular', 'ngStorage', 'ngSanitize', 'oc.lazyLoad',
    'LogOutLinks', 'CreditCardCosLink', 'EaseLocalizeModule'
  ]);

  easeUtilsModule.provider('easeModules', ['EaseConstant', function(EaseConstant) {
    var _this = this;

    angular.extend(this, {
      get: function(module) {
        return '/ease-ui' + EaseConstant.kBuildVersionPath + '/dist/features/' + module + '/' + module +
          '-module.js';
      }
    });
    this.$get = function() {
      return _this;
    };
  }]).provider('easeTemplates', [function() {
    var _this = this;

    angular.extend(this, {
      get: function(template, category, type) {
        type = (type) ? type : 'index';
        switch (template) {
          case 'template':
            return '/ease-ui/bower_components/' + category + '/partials/' + category + '-' + type +
              '.html';
          case 'PersonalInformation':
          case 'MessagesAlerts':
          case 'Settings':
            return '/ease-ui/dist/features/CustomerSettings/' + template + '/html/' + template + '-' +
              type + '.html';
          case 'AccountServices':
            return '/ease-ui/dist/partials/account-services.html';
          default:
            return '/ease-ui/dist/features/' + template + '/html/' + template + '-' + type + '.html';
        }
      },
      getFeatureTemplate: function(category, feature, type) {
        return '/ease-ui/bower_components/' + category + '/features/' + feature + '/partials/' +
          feature + '-' +
          type + '.html';
      }
    });

    this.$get = function() {
      return _this;
    };
  }]).provider('easePartials', function() {
    var _this = this;

    angular.extend(this, {
      get: function(feature, partial) {
        return '/ease-ui/dist/features/' + feature + '/html/partials/' + partial + '-partial.html';
      }
    });

    this.$get = function() {
      return _this;
    };
  }).provider('easeFiles', ['EaseConstant', function(EaseConstant) {
    var _this = this;

    angular.extend(this, {
      get: function(type, category, feature) {
        var lob = ['AutoLoan', 'Bank', 'CreditCard', 'HomeLoans', 'BillPay', 'Debit'];
        var regEx, featurePath, featureArray;
        if (lob.indexOf(category) !== -1) {
          if (typeof feature === 'string') {
            featureArray = [feature];
            feature = featureArray;
          }
          regEx = /,/gi;
          featurePath = (feature !== undefined) ? 'features/' + feature.toString().replace(regEx, '/') +
            '/' +
            feature[feature.length - 1] : category;
          return '/ease-ui/bower_components/' + category + '/' + featurePath + '-' + type + '.js';
        } else {
          if (typeof category === 'string') {
            var categoryArray = [category];
            category = categoryArray;
          }
          regEx = /,/gi;
          featurePath = category.toString().replace(regEx, '/');
          return '/ease-ui' + EaseConstant.kBuildVersionPath + '/dist/features/' + featurePath + '/' +
            category[category.length - 1] + '-' + type + '.js';
        }
      }
    });
    this.$get = function() {
      return _this;
    };
  }]).provider('easeEvent', function() {
    var _this = this;

    var trackingEvent;
    //Todo: Integrate Pub/Sub stuff

    angular.extend(this, {
      entering: function(event) {
        trackingEvent = event;
      },
      exiting: function(event) {
        trackingEvent = event;
      }
    });

    this.$get = function() {
      return _this;
    };
  }).provider('addAccountState', ['$stateProvider', 'easeFilesProvider', 'easeTemplatesProvider', 'EaseConstant',
    function providerFn($stateProvider, easeFilesProvider, easeTemplatesProvider, EaseConstant) {
      var provider = this;

      function addAccount(stateName, parentState) {
        $stateProvider.state(stateName, {
          url: EaseConstant.easeURLs.addExtPayAcct,
          parent: parentState,
          resolve: {
            extPaymentContentData: ['$ocLazyLoad', '$q', '$injector', 'contentOneFactory', 'ContentConstant',
              'languagePreferencesFactory', 'featureToggleFactory',
              function($ocLazyLoad, $q, $injector, contentOneFactory, ContentConstant,
                languagePreferencesFactory, featureToggleFactory) {
                return $ocLazyLoad.load({
                  serie: true,
                  files: [easeFilesProvider.get('services', 'UMMPayment'),
                    easeFilesProvider.get('controller', 'UMMPayment'),
                    easeFilesProvider.get('directives', 'UMMPayment')
                  ]
                }).then(function thenFn() {
                  var UmmPaymentFactory = $injector.get('UmmPaymentFactory');
                  var deferred = $q.defer();
                  contentOneFactory.initializeContentOneData(ContentConstant.kAddExternalAccount, null,
                    languagePreferencesFactory.currentLocale).then(function(data) {
                      UmmPaymentFactory.setContentOneData(data);
                      featureToggleFactory.getFeatureToggleDataByGroup(EaseConstant.features.groups.moneymovement)
                      .then(function(result) {
                        deferred.resolve(result);
                        UmmPaymentFactory.setFeatToggleData(result);
                      });
                    });
                  return deferred.promise;
                }, function errFn(error) {
                  console.log('Failed to load UMMPaymentDependencies: ' + error);
                });
              }
            ]
          },
          onEnter: ["EaseModalService", "easeTemplates", function onEnterFn(EaseModalService, easeTemplates) {
            EaseModalService(easeTemplates.get('UMMPayment', '', 'addExternalAcc'), {});
          }]
        });
      }
      angular.extend(provider, {
        set: function(stateName, parentNameState) {
          addAccount(stateName, parentNameState);
        }
      });
      this.$get = function() {
        return provider;
      };
    }

  ]).provider('editAccountState', ['$stateProvider', 'easeFilesProvider', 'easeTemplatesProvider', 'EaseConstant',
    function providerFn($stateProvider, easeFilesProvider, easeTemplatesProvider, EaseConstant) {
      var provider = this;

      function editAccount(stateName, parentState) {
        $stateProvider.state(stateName, {
          parent: parentState,
          resolve: {
            extPaymentContentData: ['$ocLazyLoad', '$q', '$injector', 'contentOneFactory', 'ContentConstant',
              'languagePreferencesFactory', 'featureToggleFactory',
              function($ocLazyLoad, $q, $injector, contentOneFactory, ContentConstant,
                languagePreferencesFactory, featureToggleFactory) {
                return $ocLazyLoad.load({
                  serie: true,
                  files: [easeFilesProvider.get('services', 'UMMPayment'),
                    easeFilesProvider.get('controller', 'UMMPayment'),
                    easeFilesProvider.get('directives', 'UMMPayment')
                  ]
                }).then(function thenFn() {
                  var UmmPaymentFactory = $injector.get('UmmPaymentFactory');
                  var deferred = $q.defer();
                  var promises = [];
                  contentOneFactory.initializeContentOneData(ContentConstant.kAddExternalAccount, null,
                    languagePreferencesFactory.currentLocale).then(function(data) {
                      deferred.resolve(data);
                      UmmPaymentFactory.setContentOneData(data);
                    });
                  promises.push(deferred.promise);
                  var deferredFT = $q.defer();
                  featureToggleFactory.getFeatureToggleDataByGroup(EaseConstant.features.groups.moneymovement)
                  .then(function(data) {
                    deferredFT.resolve(data);
                    UmmPaymentFactory.setFeatToggleData(data);
                  });
                  promises.push(deferredFT.promise);
                  $q.all(promises).then(function() {
                    return deferred.promise;
                  });
                }, function errFn(error) {
                  console.log('Failed to load UMMPaymentDependencies: ' + error);
                });
              }
            ]
          },
          onEnter: ["easeUIModalService", "easeTemplates", function onEnterFn(easeUIModalService, easeTemplates) {
            easeUIModalService.showModal({
              templateUrl: easeTemplates.get('UMMPayment', '', 'editExternalAcc'),
              controller: 'editExternalAccountCtrl'
            }).then(function(modal) {
              modal.close.then(function() {

              });
            });
          }]
        });
      }
      angular.extend(provider, {
        set: function(stateName, parentNameState) {
          editAccount(stateName, parentNameState);
        }
      });
      this.$get = function() {
        return provider;
      };
    }

  ]).factory('EASEUtilsFactory', ["$http", "$q", "$state", "$location", "$sessionStorage", "$rootScope", "$animate", "$window", "$document", "$timeout", "$injector", "Restangular", "EaseConstantFactory", "EaseConstant", "easeExceptionsService", "EaseLocalizeService", "CreditCardCosLink", "LogOutLinks", "ContentConstant", "prefetchFactory", "pubsubService", function($http, $q, $state, $location, $sessionStorage, $rootScope, $animate,
    $window, $document, $timeout, $injector, Restangular, EaseConstantFactory, EaseConstant, easeExceptionsService,
    EaseLocalizeService, CreditCardCosLink, LogOutLinks, ContentConstant, prefetchFactory,pubsubService) {
    function getPaymentDueDate(product) {
      var dueDate = new Date(product.notification);
      var todayDate = new Date();
      var timeDiff = Math.abs(todayDate.getTime() - dueDate.getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return diffDays;
    }

    String.prototype.format = function() {
      var formatted = this;
      for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
      }
      return formatted;
    };

    String.prototype.shuffle = function() {
      var a = this.split(''),
        n = a.length;

      for (var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
      }
      return a.join('');
    };

    function addGlobalAttributeToObject(data, attribute, value) {
      for (var i = 0; i < data.length; i++) {
        data[i][attribute] = value;
      }
      return data;
    }

    var MediaQueryListener = function() {
      this.afterElement = $window.getComputedStyle ? $window.getComputedStyle($document[0].body, ':after') :
        false;
      this.currentBreakpoint = '';
      this.lastBreakpoint = '';
      this.init();
    };

    MediaQueryListener.prototype = {
      init: function() {
        var self = this;
        if (!self.afterElement) {
          // If the browser doesn't support window.getComputedStyle just return
          return;
        }
        self._resizeListener();
      },
      _resizeListener: function() {
        var self = this;
        angular.element($window).on('resize orientationchange load', function() {
          self.currentBreakpoint = self.afterElement.getPropertyValue('content');
          if (self.currentBreakpoint !== self.lastBreakpoint) {
            angular.element($window).triggerHandler('breakpoint-change', self.currentBreakpoint);
            self.lastBreakpoint = self.currentBreakpoint;
          }
        });
      }
    };

    parent.mediaqueryListener = parent.mediaqueryListener || new MediaQueryListener();

    return {
      missingContentLabel: function(expectedObject, contentObject) {
        for (var key in expectedObject) {
          if (!contentObject.hasOwnProperty(key)) {
            EaseLocalizeService.get('contentErrorSnag').then(function(response) {
              $rootScope.$broadcast('error', {
                msgHeader: response.snagHeader,
                msgBody: response.snagBody,
                msgType: 'missingLabel'
              });
            });
          }
        }
      },

      getFocusForEscapeHatch: function() {
        var featureToggleFactory = $injector.get('featureToggleFactory');

        featureToggleFactory.initializeFeatureToggleData(EaseConstant.features.enableEscapeHatch).then(
          function(data) {
            angular.element(document).ready(function() {
              var focus = '';
              if (data[EaseConstant.features.enableEscapeHatch]) {
                document.getElementById('escapeHatchLink') && document.getElementById('escapeHatchLink')
                  .focus();
              } else {
                document.getElementById('caplogo') && document.getElementById('caplogo').focus();
              }
            });
          });
      },

      calculateCurBalanceAndPaymentDueAndSassName: function(entries) {
        var me = this;
        entries.forEach(function(entry) {
          if (typeof entry.displayBalance !== 'undefined') {
            var balanceDollarAmount = '';
            if (entry.displayBalance < 0) {
              balanceDollarAmount = Math.ceil(entry.displayBalance);
              entry.negativeBalance = true;
              entry.amountSign = '-';
            } else {
              balanceDollarAmount = Math.floor(entry.displayBalance);
              entry.negativeBalance = false;
              entry.sign = '';
            }
            var absDollarAmount = Math.abs(balanceDollarAmount);
            entry.dollarAmount = me.commaFormattedFixedByCurrency(absDollarAmount, entry.currencyCode);
            entry.cents = Math.abs(Math.round(entry.displayBalance * 100) % 100);
          }
          entry.cents = entry.cents || '0';
          if (entry.cents.toString().length === 1) {
            entry.cents = '0' + entry.cents.toString();
          }

          if ((entry.displayBalance === 0) ||
            (entry.displayBalance && entry.displayBalance.toString().trim() !== '' &&
              entry.displayBalance !== '')) {
            entry.showPrimaryData = true;
          } else {
            entry.showPrimaryData = false;
          }

          if (entry.category === 'HLC' || entry.category === 'HIL') {
            var helocData = {};
            helocData = me.getMultiHeloc(entry);
            entry.showPrimaryData = helocData.showPrimaryData;

            if (helocData.primaryData < 0) {
              balanceDollarAmount = Math.ceil(helocData.primaryData);
              entry.negativeBalance = true;
            } else {
              balanceDollarAmount = Math.floor(helocData.primaryData);
              entry.negativeBalance = false;
            }

            var absDollarAmount = Math.abs(balanceDollarAmount);
            entry.dollarAmount = me.commaFormattedFixedByCurrency(absDollarAmount, entry.currencyCode);
            entry.cents = Math.abs(Math.round(helocData.primaryData * 100) % 100);
            entry.cents = entry.cents || '0';

            if (entry.cents.toString().length === 1) {
              entry.cents = '0' + entry.cents.toString();
            }
            entry.primaryDisplayData = helocData.primaryDisplayData;
          }

          entry.sassName = '_lob_' + entry.category;
          if ((entry.category === EaseConstant.lineOfBusiness.checking ||
              entry.category === EaseConstant.lineOfBusiness.saving ||
              entry.category === EaseConstant.lineOfBusiness.cd ||
              entry.category === EaseConstant.lineOfBusiness.moneyMarket) && entry.subCategory) {
            entry.sassName += entry.subCategory;
          } else if (entry.subCategory && entry.subCategory.toLowerCase() === 'retail') {
            entry.sassName += entry.subCategory;
          }
        });
      },
      isHighDensityScreen: function() {
        var mediaQuery = '(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), ' +
          '(-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx)';
        if ($window.devicePixelRatio >= 1.5) {
          return true;
        }
        return $window.matchMedia && $window.matchMedia(mediaQuery).matches;
      },

      getMultiHeloc: function(accountSummaryData) {
        var helocData = {};
        if (parseFloat(accountSummaryData.availableBalance) > 0 &&
          (accountSummaryData.availableBalance == 0 || accountSummaryData.availableBalance)) {
          helocData = {
            primaryDisplayData: 'Available Balance',
            primaryData: accountSummaryData.availableBalance,
            showPrimaryData: true
          };

        } else if ((parseFloat(accountSummaryData.availableBalance) <= 0 ||
            accountSummaryData.availableBalance === "" ||
            (accountSummaryData.availableBalance &&
              accountSummaryData.availableBalance.toString().trim() === "") ||
            (!accountSummaryData.availableBalance)) && (accountSummaryData.displayBalance === 0 ||
            (accountSummaryData.displayBalance && accountSummaryData.displayBalance.toString().trim() !== "")
          )) {
          helocData = {
            primaryDisplayData: 'Principal Balance',
            primaryData: accountSummaryData.displayBalance,
            showPrimaryData: true
          };
          //From backend, getting "null". Need to remove this condition in future
        } else if ((accountSummaryData.availableBalance === "null" && accountSummaryData.displayBalance) ||
          (accountSummaryData.displayBalance === 0 || (accountSummaryData.displayBalance &&
            accountSummaryData.displayBalance.toString().trim() !== ""))) {
          helocData = {
            primaryDisplayData: 'Principal Balance',
            primaryData: accountSummaryData.displayBalance,
            showPrimaryData: true
          };
        } else {
          helocData = {
            primaryData: '',
            primaryDisplayData: '',
            showPrimaryData: false
          };
        }
        return helocData;
      },
      createAccountDetailUrl: function(urlParams, accountDetailsRefId) {
        var productCategory = urlParams.ProductCategory;
        var filter = urlParams.filter;
        var type = urlParams.type;
        var urlPrefixer = '';

        switch (productCategory) {
          case EaseConstant.lineOfBusiness.checking:
          case EaseConstant.lineOfBusiness.checking360:
          case EaseConstant.lineOfBusiness.saving:
          case EaseConstant.lineOfBusiness.saving360:
          case EaseConstant.lineOfBusiness.moneyMarket:
          case EaseConstant.lineOfBusiness.CreditCard:
          case EaseConstant.lineOfBusiness.AutoLoan:
          case EaseConstant.lineOfBusiness.HomeLoans:
          case EaseConstant.lineOfBusiness.HomeLoansHil:
          case EaseConstant.lineOfBusiness.HomeLoansHlc:
          case EaseConstant.lineOfBusiness.HomeLoansILA:
            {
              urlPrefixer = 'customer/account/' + productCategory + '/' + accountDetailsRefId +
              '/transactions';
              break;
            }
          case EaseConstant.lineOfBusiness.cd:
            {
              urlPrefixer = EaseConstant.urlPrefixerCDDeposits + accountDetailsRefId + type +
              EaseConstant.urlQueryFilter + filter;
              break;
            }
          default:
            {
              urlPrefixer = 'customer/account/' + productCategory + '/' + accountDetailsRefId +
              '/transactions';
              break;
            }
        }
        return urlPrefixer;
      },
      commaFormattedFixedByCurrency: function(amount, currencyCode) {
        var rtnValue = '';
        currencyCode = currencyCode || 'USD';
        if (currencyCode === 'USD') {
          rtnValue = numeral(parseFloat(amount)).format('0,0');
        } else {
          //TODO: what happens with other currencies - I18N ??
        }
        //Return a default USD Format
        return rtnValue;
      },
      commaFormattedMoneyByCurrency: function(amount, currencyCode) {
        var rtnValue = '';
        currencyCode = currencyCode || 'USD';
        if (parseFloat(amount) < 0) {
          amount = Math.abs(amount);
        }
        if (currencyCode === 'USD') {
          rtnValue = numeral(amount).format('$0,0.00');
        } else {
          //TODO: what happens with other currencies - I18N ??
        }
        return isNaN(amount) ? '' : rtnValue;
      },
      formatGlobalAmountValue: function(value) {
        return this.getAmountFromValue(value) + '.' + this.getCentsFromValue(value);
      },
      getAmountFromValue: function(value, currencyFormat) {
        var me = this;
        if (value.toString().indexOf('.') !== -1) {
          return me.commaFormattedFixedByCurrency(value.toString().split('.')[0], currencyFormat);
        } else {
          return me.commaFormattedFixedByCurrency(value.toString(), currencyFormat);
        }
      },
      getCentsFromValue: function(value) {
        if (value.toString().indexOf('.') !== -1) {
          value = (Math.round(value * 100) / 100);
          return parseFloat(value).toFixed(2).toString().split('.')[1];
        } else {
          return '00';
        }
      },

      redirectURLS: function(summaryData, location) {
        // I am adding 2 times decodeURIComponent because ui-router do 2 times encoding on browser and to bring
        // it back we have to decode 2 times
        var params = decodeURIComponent(location).replace('/ease-ui/#', '').split('/');
        var decodedURL = decodeURIComponent(location);
        var decodedParams = decodedURL.split('/');
        var stateObject, element, cardURL, cardParams;
        summaryData.accounts.forEach(function(account) {
          if (params[1].toLowerCase() === account.originalProductName.replace(/\s+/g, '').toLowerCase()) {
            stateObject = {
              accountReferenceId: decodeURIComponent(params[2]),
              ProductName: account.originalProductName.replace(/\s+/g, ''),
              //accountDetails: {lineOfBusiness: account.category, url:location }
              accountDetails: {
                lineOfBusiness: account.category,
                subCategory: account.subCategory,
                isRefreshState: true,
                url: location
              }
            }

            if (account.productId) {
              stateObject.accountDetails.productId = account.productId;
            }

            element = account;
          } else if (account.category === 'CC' && (params[1] !== 'accountSummary')
                      && (account.referenceId === decodeURIComponent(params[2]) ||
              (decodedURL.indexOf(
                '/ease-ui/#') === 0 && account.referenceId === decodeURIComponent(decodedParams[4])))) {
            // TODO: this is a temp fix for Card return URL; to be removed after July release
            // EOS return URL: /ease-ui/#/CreditCardDetails/{acct_ref_id}
            // COS return URL: /ease-ui/#/Card/{acct_ref_id}
            cardURL = decodedURL.indexOf('/ease-ui/#') === 0 ? decodedURL.replace('/ease-ui/#', '').replace(
              'CreditCardDetails', 'Card') : location;
            // cardURL in format of /Card/{acct_ref_id}
            cardParams = cardURL.split('/');
            stateObject = {
              accountReferenceId: decodeURIComponent(cardParams[2].replace('%252F', '%2F')),
              ProductName: 'Card',
              accountDetails: {
                lineOfBusiness: account.category,
                subCategory: account.subCategory,
                isRefreshState: true,
                url: cardURL
              }
            }
            element = account;
          }
        })
        if (element) {
          element.stateObject = stateObject;
          return element;
        } else {
          return '';
        }
      },
      redirectLinking: function(message) {
        if (!message.internalToEase && message.overRideType === "INT_COS") {
          $window.open(CreditCardCosLink.cosUrl + message.path, '_self');
        } else if (!message.internalToEase) {
          $window.open(message.path, '_blank');
        } else {
          var self = this;
          var accounts = this.getSummaryData().accounts;
          for (var i = 0; i < accounts.length; i++) {
            var indexat = message.path.indexOf(accounts[i].referenceId);
            if (indexat > -1) {
              var newAcctRefId = accounts[i].referenceId.replace(/\//g, '%252F');
              message.path = message.path.replace(accounts[i].referenceId, newAcctRefId);
              break;
            }
          }
          var element = this.redirectURLS(this.getSummaryData(), message.path);
          if (element) {
            self.navigateToDest(element);
          } else {
            // TODO: this is a temp fix, Clean up the code after ui router upgrade
            //Decoding once for account which have '/' in the account referrence id.
            if(message.path.indexOf('%252F')){
              message.path = message.path.replace('%252F', '%2F');
            }
            $location.path(message.path);
          }
        }
      },
      // default function to handle refresh
      defaultHandler: function(summaryService) {
        var self = this;
        if (self.getSummaryData().accounts) {
          var element = self.redirectURLS(self.getSummaryData(), $location.url());
          self.navigateToDest(element);
        } else {
          summaryService.set().then(function(element) {
            var element = self.redirectURLS(self.getSummaryData(), $location.url());
            self.navigateToDest(element);
          });
        }
      },
      navigateToDest: function(element) {
        if (element) {
          EaseConstant.isRefreshState = true;
          $state.go(this.SelectDetailsTransaction(element).lobType + 'Details.transactions', element.stateObject);
        } else {
          $state.go('accountSummary');
        }
      },
      SelectDetailsTransaction: function(params) {
        var type = undefined,
          lob_PubSub = undefined,
          rtrn = {};
        type = params.category || params.lineOfBusiness;
        if (params.subCategory) {
          lob_PubSub = params.subCategory.toLowerCase();
        }
        var lobObj = {
          'SA': {
            lobType: 'Bank',
            pubSubLob: lob_PubSub
          },
          'DDA': {
            lobType: 'Bank',
            pubSubLob: lob_PubSub
          },
          'CD': {
            lobType: 'Bank',
            pubSubLob: lob_PubSub
          },
          'MMA': {
            lobType: 'Bank',
            pubSubLob: lob_PubSub
          },
          'AL': {
            lobType: 'AutoLoan',
            pubSubLob: 'coaf'
          },
          'CC': {
            lobType: 'CreditCard',
            pubSubLob: 'card'
          },
          'MLA': {
            lobType: 'HomeLoans',
            pubSubLob: 'home loans'
          },
          'HLC': {
            lobType: 'HomeLoans',
            pubSubLob: 'home loans'
          },
          'HIL': {
            lobType: 'HomeLoans',
            pubSubLob: 'home loans'
          },
          'ILA': {
            lobType: 'HomeLoans',
            pubSubLob: 'home loans'
          },
          'LOC': {
            lobType: 'HomeLoans',
            pubSubLob: 'home loans'
          },
          'COI': {
            lobType: 'investing',
            pubSubLob: 'investing'
          }
        };
        if (type) {
          rtrn = lobObj[type.toUpperCase()];
        } else {
          rtrn = { lobType: '', pubSubLob: '' };
        }
        return rtrn;
      },
      getLobFromUrl: function(hash) {
        var that = this;
        var lob, params = {},
          arrayUrl, lengthArray;
        if (hash.indexOf('/') === 0) {
          arrayUrl = hash.split('/');
          lengthArray = arrayUrl.length;
          lob = arrayUrl[1];

          if (lob.indexOf('Details') > 0) {
            lob = lob.substr(0, lob.indexOf('Details'));
            if (lob === 'Bank') {
              params.category = arrayUrl[lengthArray - 2];
              params.subCategory = arrayUrl[lengthArray - 1];
            } else {
              params.category = arrayUrl[lengthArray - 1];
            }
            lob = that.SelectDetailsTransaction(params).pubSubLob;
          } else if (lob === 'AutoLoan') {
            //here the URL for AutoLoan doesn't have Details
            //  '/AutoLoan/:accountReferenceId/:businessLine/:lineOfBusiness’
            params.category = arrayUrl[lengthArray - 1];
            lob = that.SelectDetailsTransaction(params).pubSubLob;
          } else {
            // lob === 'login' || lob === 'accountSummary' || lob === 'customerSettings'
            lob = undefined;
          }
        }
        return lob;
      },
      getPubsubState: function(parentName, hash) {
        var pubsub = {};
        var level2, level3, psLevel2, psLevel3, arrayStateName;
        parentName = (typeof parentName === 'object') ? parentName.name : parentName;
        arrayStateName = parentName.split(".");
        level2 = arrayStateName[0];
        level3 = arrayStateName[1];

        if (level2 == "login") {
          pubsub.psLevel2 = level2;
        } else if (level2 == "accountSummary") {
          pubsub.psLevel2 = (level2.split(/(?=[A-Z])/).join(" ")).toLowerCase();
        } else if (level2.substr(0, level2.indexOf('Details'))) {
          pubsub.psLevel2 = EaseConstant.pubsub.accountdetailState;
        } else if (level2 == "customerSettings") {
          pubsub.psLevel2 = EaseConstant.pubsub.customersettingState;
        } else {
          pubsub.psLevel2 = "";
        }
        if (level3 == "mfa") {
          pubsub.psLevel3 = EaseConstant.pubsub.mfaL3State;
        } else if (level3 == "fraudLocked") {
          pubsub.psLevel3 = EaseConstant.pubsub.fraudlockL3State;
        } else if (level3 == "collectSecQuestions") {
          pubsub.psLevel3 = EaseConstant.pubsub.collectquL3State;
        } else if (level2 == "customerSettings") {
          pubsub.psLevel3 = (level3.split(/(?=[A-Z])/).join(" ")).toLowerCase();
        } else {
          pubsub.psLevel3 = "";
        }
        pubsub.lob = typeof(this.getLobFromUrl(hash)) !== 'undefined' ? this.getLobFromUrl(hash) : "";
        return pubsub;
      },
      IsFooterDisplayValue: false,
      IsFooterDisplaySet: function(value) {
        var self = this;

        if ($rootScope.$root.$$phase !== '$apply' && $rootScope.$root.$$phase !== '$digest') {
          $rootScope.$apply(function() {
            self.IsFooterDisplayValue = value;
          });
        } else {
          self.IsFooterDisplayValue = value;
        }
      },
      getProfileImage: function() {
        if (this.customerSummary.profilePictureData) {
          EaseConstant.profileImage = 'data:image/png;base64,' + this.customerSummary.profilePictureData;
        } else {
          EaseConstant.profileImage = '/ease-ui' + EaseConstant.kBuildVersionPath +
            '/dist/features/CustomerSettings/images/profileIcon.png';
        }
        return EaseConstant.profileImage;
      },
      setProfileImage: function(value) {
        if ($rootScope.$root.$$phase !== '$apply' && $rootScope.$root.$$phase !== '$digest') {
          $rootScope.$apply(function() {
            EaseConstant.profileImage = 'data:image/png;base64,' + value;
          });
        } else {
          EaseConstant.profileImage = 'data:image/png;base64,' + value;
        }
        this.customerSummary.profilePictureData = value;
      },
      setGreetingName: function(value) {
        this.customerSummary.greetingName = value;
      },
      setCustomerTitle: '',
      setCustomerTitleData: function(data) {
        this.setCustomerTitle = data;
      },
      getCustomerTitleData: function() {
        return this.setCustomerTitle;
      },
      summaryData: {},
      setSummaryData: function(data) {
        this.summaryData = data;
      },
      getSummaryData: function() {
        return this.summaryData;
      },
      displayTooltip: false,
      tooltipmsg: '',
      DisplayTooltip: function(value, msg) {
        var self = this;
        if ($rootScope.$root.$$phase !== '$apply' && $rootScope.$root.$$phase !== '$digest') {
          $rootScope.$apply(function() {
            self.displayTooltip = value;
            self.tooltipmsg = msg;
          });
        } else {
          self.displayTooltip = value;
          self.tooltipmsg = msg;
        }
      },
      mapSort: function(array, key, reverse) {
        if (reverse) {
          return _.map(_.sortBy(array, key)).reverse();
        } else {
          return _.map(_.sortBy(array, key));
        }
      },
      getLOB: function(category) {
        for (var item in EaseConstant.lineOfBusiness) {
          if (EaseConstant.lineOfBusiness[item] === category) {
            return item;
          }
        }
      },
      isTypeOfArray: function(value) {
        var s = false;
        if (typeof value === 'object' && Object.prototype.toString.call(value) === '[object Array]') {
          s = true;
        }
        return s;
      },
      clearSession: function() {
        var self = this;
        try {
          $window.sessionStorage.clear();
          console.log('Clear the window.sessionStorage');
        } catch (error) {
          console.log('Cannot Clear the window.sessionStorage');
        };
        $sessionStorage.$reset();
        self.clearStoredObjects();
      },
      clearStoredObjects: function() {
        var self = this;
        EaseConstant.profileImage = '';
        self.customerSummary = {};
        self.summaryData = {};
      },
      redirectTo360Summary: function() {
        $window.location.href = LogOutLinks.url360Summary;
      },
      redirectToLogoutCentral: function() {
        $window.location.href = LogOutLinks.logoutUrl;
      },
      logout: function() {
        var self = this;
        $rootScope.$broadcast('logout');
        self.setIsLoggingOut(true);
        self.setCustomerActivityHeader('50075');
        Restangular.setBaseUrl(EaseConstant.baseUrl);
        return Restangular.all(EaseConstant.kLogoutUrl).remove().finally(function() {
          self.clearSession();
        });
      },
      isLoggingOut: false,
      setIsLoggingOut: function(value) {
        this.isLoggingOut = value;
      },
      getIsLoggingOut: function() {
        return this.isLoggingOut;
      },
      getCustomerReferenceID: function() {
        return this.getSummaryData().customerReferenceId;
      },
      isInActiveProduct: function(product) {
        var category = product.category;
        if (product.subCategory && product.subCategory.toLowerCase() === 'retail') {
          if (product.accountMessage && product.accountMessage.length > 0 && ['critical', 'restricted',
              'closed',
              'togglerestricted'
            ].indexOf(product.accountMessage[0].level) !== -1) {
            if (product.accountMessage[0].level === 'critical') {
              return { isNotClickable: true, category: category };
            } else {
              return { isNotClickable: true, category: product.accountMessage[0].level };
            }
          } else {
            return { isNotClickable: true, category: category };
          }
        } else if (product.category && ['ila'].indexOf(product.category.toLowerCase()) !== -1) {
          return { isNotClickable: true, category: category };
        } else if (product.isDisplayAccount !== undefined && !product.isDisplayAccount) {
          return { isNotClickable: true, category: product.accountMessage[0].level };
        } else if (product.accountMessage !== undefined && product.accountMessage.length > 0 && ['critical',
            'restricted',
            'closed', 'togglerestricted'
          ].indexOf(product.accountMessage[0].level) !== -1) {
          if (product.accountMessage[0].level === 'critical') {
            return { isNotClickable: !product.navigable, category: category };
          } else {
            return { isNotClickable: !product.navigable, category: product.accountMessage[0].level };
          }
        }
        return { isNotClickable: false, category: category };
      },
      getFullMonthText: function(index) {
        var _monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return _monthNames[index];
      },
      isValidStatus: function(code) {
        var _validStatusCodes = /^[2][0-9][0-9]$/;
        return _validStatusCodes.test(code);
      },
      currentBusinessSyncId: null,
      setCurrentBusinessSyncId: function() {
        this.currentBusinessSyncId = this.getSyncId();
      },
      getCurrentBusinessSyncId: function() {
        return this.currentBusinessSyncId;
      },
      getSyncId: function() {
        var sync = (new Date).getTime().toString().shuffle();
        return sync;
      },
      setCustomerActivityHeader: function(businessEventId, syncID) {
        Restangular.setDefaultHeaders({
          'BUS_EVT_ID': businessEventId,
          'EVT_SYNCH_TOKEN': syncID || this.getSyncId()
        });
        return;
      },
      clearCustomerActivityHeader: function() {
        Restangular.setDefaultHeaders({});
      },
      justCallAccountSummary: function() {
        var deferred = $q.defer();
        if (this.summaryData['accounts']) {
          deferred.resolve(this.summaryData);
        } else {
          this.clearCustomerActivityHeader();
          Restangular.setBaseUrl(EaseConstant.baseUrl);
          this.setCustomerActivityHeader('50000', this.getCurrentBusinessSyncId());
          var accountsummaryCall = Restangular.one(EaseConstant.kAccountSummaryRetrieveUrl);
          accountsummaryCall.get().then(function successResolve(data) {
            deferred.resolve(data);
          }).catch(function(ex) {
            deferred.reject();
            throw easeExceptionsService.createEaseException({
              'module': 'easeUtils',
              'function': 'justCallAccountSummary',
              'cause': ex
            });
          });
        }
        return deferred.promise;
      },
      msgPubsubAnalytics: [],
      setMsgAnalytics: function(msgPubsubAnalytics) {
       this.msgPubsubAnalytics = msgPubsubAnalytics;
      },
      getMsgAnalytics: function() {
        return this.msgPubsubAnalytics;
      },
      pubsubTrackAnalyticswithMsg: function(taxonomyVal, lob, action) {
        var messageAnalytics = [], messageAnalyticsString, self = this, interactionMessage = '', display = '';
        messageAnalyticsString = (self.getMsgAnalytics()).toString().replace(/,/g, '');
        if(messageAnalyticsString) {
          display = (self.getMsgAnalytics()).join('|') ;
          interactionMessage = {display: display};
          pubsubService.pubsubTrackAnalytics({taxonomy: taxonomyVal,lob: lob, interactionMessage: interactionMessage, accountAction: action});
        } else {
          pubsubService.pubsubTrackAnalytics({taxonomy: taxonomyVal,lob: lob, accountAction: action});
        }
      },
      customerSummary: {},
      setCustomerSummary: function() {
        var self = this,
          url = EaseConstant.kProfilePreferences,
          customer = {};
        Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
        self.setCustomerActivityHeader('50000', self.getCurrentBusinessSyncId());
        customer = Restangular.all(url);
        customer.get('').then(function(data) {
          self.customerSummary = data;
          self.setCustomerPreferencesDirty(true);
          $rootScope.$broadcast('customerSummaryLoaded', data);
        });
        this.clearCustomerActivityHeader();
      },
      getCustomerSummary: function() {
        return this.customerSummary;
      },
      getMoneyMovementAccounts: function(busEvtId, pathParamObj) {
        var headers = {};
        if(busEvtId) {
          headers['BUS_EVT_ID'] = busEvtId;
          headers['EVT_SYNCH_TOKEN'] = this.getSyncId();
        } else {
          throw easeExceptionsService.createEaseException({
            'module': 'settingsModule',
            'function': 'settingsModule.getMoneyMovementAccounts',
            'message': EaseConstant['busEvtExceptionMesage'],
            'cause': EaseConstant['busEvtExceptionCause']
          });
        }

        if(!pathParamObj){
          pathParamObj = '';
        }
        var serviceUrl = Restangular.all(EaseConstant.kRetrieveMoneyMovementAccounts);
        Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
        var deferred = $q.defer();

        serviceUrl.get('', pathParamObj, headers).then(function (data) {
          deferred.resolve(data);
          return deferred.promise;
        }, function (ex) {
          deferred.reject(ex);
          throw easeExceptionsService.createEaseException({
            'module': 'settingsModule',
            'function': 'settingsModule.getMoneyMovementAccounts',
            'message': ex.statusText,
            'cause': ex
          });
        });
        return deferred.promise;
      },
      customerPreferencesDirty: false,
      setCustomerPreferencesDirty: function(dirtyCheck) {
        this.customerPreferencesDirty = dirtyCheck;
      },
      isCustomerPreferencesDirty: function() {
        return this.customerPreferencesDirty;
      },
      AccSummaryI18: {},
      setAccSummaryI18: function(value) {
        this.AccSummaryI18 = value;
      },
      getAccSummaryI18: function() {
        return this.AccSummaryI18;
      },
      extParams: {},
      setEditExtParam: function(data) {
        this.extParams = {
          'moneyMovActRefId': data.moneyMovActRefId,
          'isPrimaryAct': data.isPrimaryAct,
          'bankName': data.bankName,
          'isDepositAct': data.isDepositAct,
          'bankNameWithNum': data.bankNameWithNum
          };
      },
      getEditExtParam: function() {
        return this.extParams;
      },
      globalHeaderContentData: {},
      dropdownContentData: {},
      setglobalHeaderContentData: function(value) {
        this.globalHeaderContentData = value;
      },
      getglobalHeaderContentData: function() {
        return this.globalHeaderContentData;
      },
      setdropdownContentData: function(value) {
        this.dropdownContentData = value;
      },
      getdropdownContentData: function() {
        return this.dropdownContentData;
      },
      validateBankDayOffs: function(dt_date) {
        // check simple dates (month/date - no leading zeroes)
        var n_date = dt_date.getDate(),
          n_month = dt_date.getMonth() + 1,
          n_wday = dt_date.getDay();
        var s_date1 = n_month + '/' + n_date;

        if (n_wday === 6 || n_wday === 0) { //Disable all weekends
          return true;
        };

        if ((s_date1 == '12/31' && n_wday === 5) //New Year's Holiday on Friday because New Years is on Saturday
          || s_date1 == '1/1' // New Year's Day
          || (s_date1 == '1/2' && n_wday === 1) //New Year's Holiday on Monday because New Years is on Sunday
          || (s_date1 == '7/3' && n_wday === 5) // Independence Day Holiday on Friday because Independence Day is on Saturday
          || s_date1 == '7/4' // Independence Day
          || (s_date1 == '7/5' && n_wday === 1) // Independence Day Holiday on Monday because Independence Day is on Sunday
          || (s_date1 == '11/10' && n_wday === 5) // Veterans Day Holiday on Friday because Veterans Day is on Saturday
          || s_date1 == '11/11' // Veterans Day
          || (s_date1 == '11/12' && n_wday === 1) // Veterans Day Holiday on Monday because Veterans Day is on Sunday
          || (s_date1 == '12/24' && n_wday === 5) // Christmas Day Holiday on Friday because Christmas Day is on Saturday
          || s_date1 == '12/25' // Christmas Day
          || (s_date1 == '12/26' && n_wday === 1) // Christmas Day Holiday on Monday because Christmas Day is on Sunday
        ) { return true; }

        // weekday from beginning of the month (month/num/day)
        var n_wnum = Math.floor((n_date - 1) / 7) + 1;
        var s_date2 = n_month + '/' + n_wnum + '/' + n_wday;

        if (s_date2 == '1/3/1' // Birthday of Martin Luther King, third Monday in January
          || s_date2 == '2/3/1' // Washington's Birthday, third Monday in February
          || s_date2 == '9/1/1' // Labor Day, first Monday in September
          || s_date2 == '10/2/1' // Columbus Day, second Monday in October
          || s_date2 == '11/4/4' // Thanksgiving Day, fourth Thursday in November
        ) { return true; }

        // weekday number from end of the month (month/num/day)
        var dt_temp = new Date(dt_date);
        dt_temp.setDate(1);
        dt_temp.setMonth(dt_temp.getMonth() + 1);
        dt_temp.setDate(dt_temp.getDate() - 1);
        n_wnum = Math.floor((dt_temp.getDate() - n_date - 1) / 7) + 1;
        var s_date3 = n_month + '/' + n_wnum + '/' + n_wday;

        if (s_date3 == '5/1/1' // Memorial Day, last Monday in May
        ) { return true; }

        return false;
      },
      getStateDetailsObject: function(element) {
        var stateObject = {
          accountReferenceId: element.referenceId,
          ProductName: element.originalProductName.replace(/\s+/g, ''),
          accountDetails: { lineOfBusiness: element.category, accountNumber: element.accountNumberTLNPI }
        }

        if (element.category == "CC") {
          stateObject.ProductName = "Card"
        }

        if (element.subCategory) {
          stateObject.accountDetails.subCategory = element.subCategory;
        }

        if (element.productId) {
          stateObject.accountDetails.productId = element.productId;
        }

        return stateObject;
      },

      // below is dependent on accountMessage and level (manipulated in above lines)
      preFetchLOB: function(dataAccounts) {
        var prefetchCreditCard = false;
        var AccRefIdsAL = [];
        var AccRefIdsHL = [];
        var AccRefIdsBank = [];
        var self = this;

        dataAccounts.forEach(function(item) {
          if ('CC' === item.category && typeof item.accountMessage === 'undefined') {
            prefetchCreditCard = true;
          } else if ('AL' === item.category && typeof item.accountMessage === 'undefined') {
            AccRefIdsAL.push(encodeURIComponent(item.referenceId));
          } else if (['MLA', 'HLC', 'HIL'].indexOf(item.category) !== -1 && typeof item.accountMessage ===
            'undefined') {
            AccRefIdsHL.push(encodeURIComponent(item.referenceId));
          } else if (('360'.indexOf(item.subCategory) !== -1) && typeof item.accountMessage ===
            'undefined') {
            AccRefIdsBank.push(encodeURIComponent(item.referenceId));
          }
        });
        if (prefetchCreditCard) {
          self.setCustomerActivityHeader('50330');
          prefetchFactory.initializePrefetch(EaseConstant.prefetchCreditCard);
        }
        if (AccRefIdsBank.length > 0) {
          self.setCustomerActivityHeader('50310');
          prefetchFactory.initializePrefetch(EaseConstant.prefetchBank, AccRefIdsBank);
        }
        if (AccRefIdsAL.length > 0) {
          self.setCustomerActivityHeader('50300');
          prefetchFactory.initializePrefetch(EaseConstant.prefetchAutoLoan, AccRefIdsAL);
        }
        if (AccRefIdsHL.length > 0) {
          self.setCustomerActivityHeader('50320');
          prefetchFactory.initializePrefetch(EaseConstant.prefetchHomeLoans, AccRefIdsHL);
        }
      },
      isAlertsClosed: function(item) {
        if (item.category === 'CC' || item.category === 'AL') {
          return !/Closed/i.test(item.accountStatus);
        } else {
          return false;
        }
      },
      isShowAlerts: function(featureToggleData, lobs) {
        var showAlerts = false;
        var data = this.getSummaryData();
        if (data.accounts) {
          showAlerts = data.accounts.some(this.isAlertsClosed);
        }

        if (showAlerts && featureToggleData[EaseConstant.features.enableDisplayAlerts]) {
          var hasCard = _.includes(lobs, 'card');
          var hasCoaf = _.includes(lobs, 'coaf');

          if ((featureToggleData[EaseConstant.features.enableDisplayCardAlerts] && hasCard) ||
              (featureToggleData[EaseConstant.features.enableDisplayCoafAlerts] && hasCoaf)) {
            showAlerts = true;
          } else {
            showAlerts = false;
          }
        } else {
          showAlerts = false;
        }
        return showAlerts;
      }
    }
  }]).service('summaryService', ['$http', '$q', 'Restangular', 'EaseConstant', 'EASEUtilsFactory',
    'easeExceptionsService', 'contentOneFactory', 'ContentConstant', 'featureToggleFactory', '$rootScope', '_', '$log',
    function($http, $q, Restangular, EaseConstant, EASEUtilsFactory, easeExceptionsService, contentOneFactory,
      ContentConstant, featureToggleFactory, $rootScope, _, $log) {

    var self = this;
    self.summary = null;
    self.lobArray = [];
    var nicknametoggledata = {};

    this.getLobFromProduct = function(product) {
      var category = product.category.toUpperCase();
      switch (category) {
        case 'SA':
        case 'DDA':
          if (product.subCategory === '360') {
            return '360';
          } else {
            return 'retail';
          }
        case 'CD':
        case 'MMA':
          return 'retail';
        case 'AL':
          return 'coaf';
        case 'MLA':
        case 'HLC':
        case 'HIL':
        case 'ILA':
          return 'home loans';
        case 'CC':
          return 'card';
        case 'COI':
          return 'investing';
        default:
          return 'unknown';
      }
    };

    function filterAccountSummaryProducts(product) {
      var lob = '';
      if (product.category === 'CC') {
        product.NumberOfDueDays = getPaymentDueDate(product);
      }
      if (product.accountNickname) {
        product.displayName = product.accountNickname;
      } else {
        product.displayName = product.originalProductName;
      }
      lob = self.getLobFromProduct(product);
      if (!_.includes(self.lobArray, lob)){
        self.lobArray.push(lob);
      }
      return true;
    }

    function getPaymentDueDate(product) {
      var dueDate = new Date(product.notification);
      var todayDate = new Date();
      var timeDiff = Math.abs(todayDate.getTime() - dueDate.getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return diffDays;
    }

    this.set = function(accSummaryFlag) {
      var deferred = $q.defer();
      Restangular.setBaseUrl(EaseConstant.baseUrl);
      EASEUtilsFactory.setCurrentBusinessSyncId();
      EASEUtilsFactory.setCustomerActivityHeader('50000', EASEUtilsFactory.getCurrentBusinessSyncId());
      var accountsummary = Restangular.one(EaseConstant.kAccountSummaryRetrieveUrl);
      accountsummary.get().then(function (data) {
        if ((!data.accounts && !_.isEmpty(data.easeDisplayError)) ||
          (data.accounts && data.accounts.length === 0)) {
          data.isDisplayData = false;
          $log.warn('accountSummary is empty');
          deferred.reject(data);
        } else {
          EASEUtilsFactory.setSummaryData(data);
          data.status = 'pass';
          data.accounts = data.accounts.filter(filterAccountSummaryProducts);
          data.accounts.forEach(function (item, i) {
            if (item.accountMessage) {
              if (item.accountMessage.level) {
                item.accountMessage.level = item.accountMessage.level.toLowerCase();
              }
              if (['unavailable', 'restricted', 'closed', 'critical', 'togglerestricted'].indexOf(item.accountMessage
                  .level) !== -1) {
                var value = new Array();
                item.accountMessage.priority = 0;
                value.push(item.accountMessage);
                item.accountMessage = value;
              } else {
                delete item.accountMessage;
              }
            }
          });
          contentOneFactory.initializeContentOneData(ContentConstant.kSessionTimeout);
          EASEUtilsFactory.calculateCurBalanceAndPaymentDueAndSassName(data.accounts);
          self.summary = data;
          deferred.resolve(data);
          EASEUtilsFactory.setCustomerSummary();
          if (self.lobArray.length > 1) {
            self.lobArray.sort();
          }
        }
        $rootScope.$broadcast('summaryLoaded');
      }, function (ex) {
        var data = {};
        data.status = 'fail';
        data.accounts = [];
        EASEUtilsFactory.setSummaryData(data);
        console.log(ex);
        if (ex && (ex.statusCode == '503' || ex.statusCode == '504')) {
          $rootScope.$broadcast('error', {
            msgHeader: EaseConstant.defaultErrorMessage.msgHeader,
            msgBody: EaseConstant.defaultErrorMessage.msgBody
          });
        }
        deferred.resolve(data);
      });
      EASEUtilsFactory.clearCustomerActivityHeader();
      return deferred.promise;
    };

    this.get = function() {
      var deferred = $q.defer();
      if (self.summary) {
        deferred.resolve(self.summary);
      } else {
        var removeListener = $rootScope.$on('summaryLoaded', function() {
          deferred.resolve(self.summary);
          removeListener();
        });
      }
      return deferred.promise;
    };

    this.getLobArray = function getLobArray() {
      return self.lobArray;
    }
  }])
    .factory('NotifyingService', ['$rootScope', '$http', '$q', 'Restangular', 'EaseConstant', 'EASEUtilsFactory',
      'easeExceptionsService',
      function($rootScope, $http, $q, Restangular, EaseConstant, EASEUtilsFactory, easeExceptionsService) {

        function updateCache(eventName, callback) {

          var promises =[], jsonData = {
            };

          var eventMap = EaseConstant.cacheRefresh[eventName];

          for(var i=0, length=eventMap.length; i < length; i++) {
            var testURL= eventMap[i];
            Restangular.setBaseUrl(EaseConstant.baseUrl);

            var serviceUrl = Restangular.all(testURL);
            var promise= serviceUrl.post(jsonData);
            promises.push(promise);

          }
          $q.all(promises).then(
            function(results) {
              // Success callback. Do nothing for success call at the moment.
              callback();
            }, function(ex) {
            throw easeExceptionsService.createEaseException({
              'module': 'CacheRefresh',
              'message': ex.statusText,
              'cause': ex
            });
            }
          );
        }
        return {
          subscribe: function(eventName, callback) {
            console.log('eventName eventName ' + eventName);
            //TODO callback registration goes in here.
          },
          notify: updateCache
        };
      }])
    .factory('appCookie', function() {
    var create = function(name, value, days) {
        var date = new Date(),
          expires = '';
        if (days > 0) {
          date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
          expires = '; expires=' + date.toGMTString();
        }
        document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/; domain=.capitalone.com';
      },
      read = function(name) {
        var nameEQ = name + '=',
          ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
          }
          if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
          }
        }
        return null;
      },
      erase = function(name) {
        create(name, '', -1);
      },
      deleteCookie = function(name) {
        document.cookie = name + '=; path=/; domain=.capitalone.com; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      }

    return {
      create: create,
      read: read,
      erase: erase,
      deleteCookie: deleteCookie
    };
  }).factory('deviceInfoCookie', ['$window', function($window) {
    var setCookie = function() {
      'createRSACookies_encode' in $window && $window.createRSACookies_encode();
    };
    return {
      setCookie: setCookie
    };
  }]);
  return easeUtilsModule;
});
