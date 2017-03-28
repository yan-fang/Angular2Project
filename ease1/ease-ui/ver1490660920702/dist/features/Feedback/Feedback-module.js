define([
  'angular'
], function(angular) {
  'use strict';
  angular.module('feedbackModule', ['easeAppUtils', 'ui.router', 'EaseModalModule'])
    .controller('feedbackController',
      ['$scope', '$state', '$q', 'Restangular', 'EaseConstantFactory', 'easeExceptionsService', 'EaseConstant',
        'EaseModalService', 'pubsubService', 'EASEUtilsFactory', '$injector', 'featureToggleFactory', 'feedbackState',
        'feedbackSuccessModal', '$rootScope', feedbackFormController]);

  function feedbackFormController($scope, $state, $q, Restangular, EaseConstantFactory, easeExceptionsService,
                                  EaseConstant, EaseModalService, pubsubService, EASEUtilsFactory, $injector,
                                  featureToggleFactory, feedbackState, feedbackSuccessModal, $rootScope) {
    var vm = this, location, locationUrl;
    vm.focusId = 'closeModal';
    var charCount = {
      run: function() {
        if (charCount.alreadyRun === false) {
          charCount.setup();
          charCount.alreadyRun = true;
        }
        if (document.getElementById('character-count') != null) {
          charCount.count();
        }
      },
      setup: function() {
        var textareas = document.getElementsByTagName('textarea');
        if (textareas.length > 0) {
          textareas[0].insertAdjacentHTML('afterend', '<span id="character-count">500</span>');
        }
      },
      count: function() {
        var characterCounter = document.getElementById('character-count');
        if (vm.model.feedbackDescription && vm.model.feedbackDescription.length > 0) {
          charCount.maxFeedback = vm.model.feedbackDescription.slice(0, charCount.maxChars);
          charCount.characters = Math.max(0, charCount.maxChars - vm.model.feedbackDescription.length);
          characterCounter.innerHTML = charCount.characters;
          if (charCount.characters <= 0) {
            characterCounter.className = 'error';
            vm.model.feedbackDescription = charCount.maxFeedback;
          } else {
            characterCounter.className = '';
            charCount.isValid = true;
          }
        } else {
          charCount.characters = 0;
          characterCounter.innerHTML = '500';
        }
      },
      maxChars: 500,
      characters: 0,
      isValid: true,
      alreadyRun: false,
      maxFeedback: ''
    };
    vm.charCount = charCount;

    //event is thrown from featureToggleUtils.js
    $rootScope.$on('featureToggleFeedback', function() {
      vm.featureToggleDat = featureToggleFactory.getFeatureToggleDataSingle('ease.core.feedback.v1');
      vm.isFeedbackButtonDisplay = vm.featureToggleDat[EaseConstant.features.feedbackFeature];
    });
    location = $injector.get('$location');
    locationUrl = location.url();
    if ($state.current.url === EaseConstant.easeURLs.feedback) {
      locationUrl = locationUrl.substr(0, locationUrl.lastIndexOf('/'));
      var pubSubValue = {
        taxonomy: {
          level1 : 'ease',
          level2 : 'feedback',
          level3 : '',
          level4 : '',
          level5 : '',
          country :'us',
          language : 'english',
          system : 'ease_web'
        }
      };
      var lob = EASEUtilsFactory.getLobFromUrl(locationUrl);
      if (typeof lob !== 'undefined') {
        pubSubValue.lob = lob;
      }
      document.getElementById('footer').setAttribute('aria-hidden', true);
      document.getElementById('footer').setAttribute('tabindex', '-1');
      pubsubService.pubsubTrackAnalytics(pubSubValue);
    }
    angular.extend(vm, {
      model: {
        feedbackType: undefined,
        feedbackDescription: undefined,
        feedbackRate: undefined,
        emailField: undefined
      },
      feedbackFields: [
        {
          name: 'feedbackType',
          key: 'feedbackType',
          type: 'radio',
          id: 'feedbackType',
          ngModelElAttrs: {
            'tabindex': '0'
          },
          templateOptions: {
            label: EaseConstant.feedbackForm.typeField,
            options: [{
              name: 'Idea',
              value: 'Idea'
            }, {
              name: 'Problem',
              value: 'Problem'
            }, {
              name: 'Praise',
              value: 'Praise'
            }]
          }
        },
        {
          name: 'feedbackDescription',
          key: 'feedbackDescription',
          type: 'textarea',
          id: 'feedbackDescription',
          templateOptions: {
            label: EaseConstant.feedbackForm.descriptionField,
            placeholder: EaseConstant.feedbackForm.descriptionField,
            required: true,
            rows: 2,
            tabindex: 0
          },
          expressionProperties: {
            'templateOptions.onkeyup': function() {
              vm.charCount.run();
            }
          }
        },
        {
          name: 'feedbackRate',
          key: 'feedbackRate',
          type: 'radio',
          id: 'feedbackRate',
          ngModelElAttrs: {
            'tabindex': '0'
          },
          templateOptions: {
            label: EaseConstant.feedbackForm.ratingField,
            options: [{
              name: 'Very Negative',
              value: '1'
            }, {
              name: 'Negative',
              value: '2'
            }, {
              name: 'Neutral',
              value: '3'
            }, {
              name: 'Positive',
              value: '4'
            }, {
              name: 'Very Positive',
              value: '5'
            }]
          }
        },
        {
          name: 'emailAddress',
          key: 'emailField',
          type: 'input',
          id: 'emailAddress',
          templateOptions: {
            label: EaseConstant.feedbackForm.emailField,
            type: 'email',
            tabindex: 0
          }
        }],
      loadingClass: '',
      displayError: '',
      feedbackModalType: 'feedbackModal',
      feedbackModalClass: 'icon-megaphone',
      feedbackSucessClass: 'icon-check',
      feedbackSuccessType: 'successFeedbackModal',
      initClose: false,
      closeForm: function(isSucess) {
        vm.charCount.alreadyRun = false;
        vm.model = {};
        vm.displayError = '';
        if (isSucess) {
          $state.go($state.current.parent);
          feedbackSuccessModal.feedbackSuccess();
        } else {
          var pubsubLevel = EASEUtilsFactory.getPubsubState($state.current.parent, locationUrl);
          var pubSubValue = {
            taxonomy: {
              level1 : 'ease',
              level2 : pubsubLevel.psLevel2,
              level3 : pubsubLevel.psLevel3,
              level4 : '',
              level5 : '',
              country :'us',
              language : 'english',
              system : 'ease_web'
            },
            lob: pubsubLevel.lob
          };
          pubsubService.pubsubTrackAnalytics(pubSubValue);
          document.getElementById('footer').removeAttribute('tabindex');
          document.getElementById('footer').removeAttribute('aria-hidden');
          $state.go($state.current.parent);
        }
      },
      openFeedback: function() {
        $state.go($state.current.name+'.feedback');
      },
      close: function() {
        var pubsubLevel = EASEUtilsFactory.getPubsubState($state.current.name, locationUrl);
        var pubSubValue = {
          taxonomy: {
            level1: 'ease',
            level2: pubsubLevel.psLevel2,
            level3: pubsubLevel.psLevel3,
            level4: '',
            level5: '',
            country: 'us',
            language: 'english',
            system: 'ease_web'
          },
          lob: pubsubLevel.lob
        };
        pubsubService.pubsubTrackAnalytics(pubSubValue);
        vm.charCount.alreadyRun = false;
        document.getElementById('footer').removeAttribute('aria-hidden');
        document.getElementById('footer').removeAttribute('tabindex');
        $scope.$modalCancel();
      },
      submit: function() {
        if (typeof vm.model.feedbackType === 'undefined' ||
          typeof vm.model.feedbackDescription === 'undefined' || typeof vm.model.feedbackRate === 'undefined') {
          vm.displayError = '* Please fill in all the fields!';
          return null;
        } else {
          var feedbackRequestData = {
            'feedbackType': vm.model.feedbackType,
            'description': vm.model.feedbackDescription,
            'rate': vm.model.feedbackRate,
            'email': vm.model.emailField
          };
          var deferred = $q.defer();
          var url = 'customer/feedback';
          pubsubService.pubsubTrackAnalytics({ name : 'feedBack submit:button' });
          Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
          var feedbackUrl = Restangular.all(url);
          feedbackUrl.post(feedbackRequestData).then(function(data) {
            vm.closeForm(true);
            deferred.resolve(data);
          }, function() {
            vm.displayError = EaseConstant.feedbackForm.displayError;
            deferred.reject();
          }, function(ex) {
            throw easeExceptionsService.createEaseException({
              'module': 'FeedbackModule',
              'function': 'FeedbackController.sendFeedback',
              'message': ex.statusText,
              'cause': ex
            });
          });
          return deferred.promise;
        }
      }
    });
  }
});
