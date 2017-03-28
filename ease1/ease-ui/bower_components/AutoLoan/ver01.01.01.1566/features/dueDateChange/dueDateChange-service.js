define(['angular'], function(angular) {
  'use strict';
  var AutoLoanDueDateChangeModule =  angular.module('AutoLoanDueDateChangeModule');

  AutoLoanDueDateChangeModule.service('autoLoanDueDateChangeService',
    function($state, $q, Restangular, EaseConstantFactory,
             easeExceptionsService,autoLoanModuleService) {

      var self = this;

      self.setEligibleDates = function(data) {
        self.eligibleDates = data;
      };

      self.setSuccessResponse = function(data) {
        var successResponse = {
          isLetterRequired : data.isLetterRequired,
          dueDateChangeRequestId : data.dueDateChangeRequestId,
          dueDateChangeRequiredPaymentAmount : data.dueDateChangeRequiredPaymentAmount
        };
        self.successResponse = successResponse;
      };

      self.setIsLastPersonSigning = function(data) {
        self.isLastPersonSigning = data;
      };

      self.getIsLastPersonSigning = function() {
        return self.isLastPersonSigning;
      };

      self.getSuccessResponse = function() {
        return self.successResponse;
      };

      self.getEligibleDates = function() {
        return self.eligibleDates;
      };

      self.setBalloonPaymentData = function(data) {
        self.balloonPaymentDates = data;
      };

      self.getBalloonPaymentData = function() {
        return self.balloonPaymentDates;
      };


      self.getDueDateChangeLetter = function() {
        return self.dueDateChangeLetter;
      };

      self.setDueDateChangeLetter = function(data) {
        var file = new Blob([data], {type: 'application/pdf'});
        self.dueDateChangeLetter = data;
      };

      self.getDDCHistory = function(accountRefId, ddcHistoryStatusCodes) {
        var url = 'AutoLoan/accounts/' + encodeURIComponent(accountRefId) + '/due-date-change-history';

        if (ddcHistoryStatusCodes) {
          url = url + '?';                          // prepare to take params
          for (var i = 0; i < ddcHistoryStatusCodes.length; i++) {
            url = url + 'dueDateChangeStatusCode=' + ddcHistoryStatusCodes[i] + '&';
          }
          url = url.substring(0, url.length -1);    // trim off the last '&'
        }

        var deferred = $q.defer();
        Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
        var ddcHistory= Restangular.all(url);
        ddcHistory.get('').then(function(data) {
          deferred.resolve(data);
        },function(ex) {
          throw easeExceptionsService.createEaseException({
            'module':'GetDueDateChangeHistoryModule.services',
            'function':'AutoLoanService.getDueDateChangeHistory',
            'message':'ex.statusText',
            'cause':ex
          });
        });
        return deferred.promise;
      };

      function pendingLetterSingnature(entries, index, coBorrowerName) {
        if (('borrowerLetterReceivedDate' in entries[index])
            && ((coBorrowerName)
            && !('coBorrowerLetterReceivedDate' in entries[index]))) {
          self.setHasCoborrowerSigned(false);
          self.setIsLastPersonSigning(true);
        } else if (!('borrowerLetterReceivedDate' in entries[index])
            && ((coBorrowerName)
            && ('coBorrowerLetterReceivedDate' in entries[index]))) {
          self.setHasCoborrowerSigned(true);
          self.setIsLastPersonSigning(true);
        }
      }

      function borrowerPendingMessage(entries, index, coBorrowerName, message, needCoBorrowerSignatureMessage) {
        var needBorrowerOnlySignatureMessage = autoLoanModuleService.getI18n().coaf.dueDateChange
            .ddcBorrowerOnlySignMessage.message.v1;

        if (('borrowerLetterReceivedDate' in entries[index])
            && ((coBorrowerName)
            && !('coBorrowerLetterReceivedDate' in entries[index]))) {
          message = needCoBorrowerSignatureMessage;
        } else if (!('borrowerLetterReceivedDate' in entries[index])
            && ((coBorrowerName)
            && ('coBorrowerLetterReceivedDate' in entries[index]))) {
          message = needBorrowerOnlySignatureMessage;
        } else if ((!('borrowerLetterReceivedDate' in entries[index]))
            && (!(coBorrowerName))) {
          message = needBorrowerOnlySignatureMessage;

        }
        return message;
      }

      self.createDDCHistoryMessage = function(entries) {

        var accountNumber = autoLoanModuleService.getAccountDetailsData().accountDetails.displayAccountNumber;
        var coBorrowerName = autoLoanModuleService.getAccountDetailsData().accountDetails.coBorrowerName;
        var last4LoanCust = accountNumber.substr(accountNumber.length-4, accountNumber.length);
        var completedMessage = autoLoanModuleService.getI18n().coaf.dueDateChange.dueDateChangeCompletedMessage
            .message.v1;
        var incompleteMessage = autoLoanModuleService.getI18n().coaf.dueDateChange.dueDateChangeIncompleteMessage
            .message.v1;
        var pendingMessage = autoLoanModuleService.getI18n().coaf.dueDateChange.dueDateChangePendingMessage
            .message.v1;
        var needCoBorrowerSignatureMessage = autoLoanModuleService.getI18n().coaf.dueDateChange
            .dueDateChangeNeedCoBorrowerSignatureMessage.message.v1;
        var needBothBorrowerSignatureMessage = autoLoanModuleService.getI18n().coaf.dueDateChange
            .ddcBothBorrowersSignMessage.message.v1;
        var needBorrowerOnlySignatureMessage = autoLoanModuleService.getI18n().coaf.dueDateChange
            .ddcBorrowerOnlySignMessage.message.v1;
        var nickName = autoLoanModuleService.getAccountDetailsData().accountDetails.accountNickname;

        var message = pendingMessage;

        for (var i = 0; i < entries.length; i++) {
          switch (entries[i].dueDateChangeStatusCode) {
            case 'Completed' :
              completedMessage = completedMessage.replace('{nickName}', nickName);
              completedMessage = completedMessage.replace('{last4LoanCust}', last4LoanCust);
              completedMessage = completedMessage.replace('{newDueDate}', entries[i].newDueDateOrdinal);
              return completedMessage;
            case 'Incomplete' :
              incompleteMessage = incompleteMessage.replace('{nickName}', nickName);
              incompleteMessage = incompleteMessage.replace('{last4LoanCust}', last4LoanCust);
              incompleteMessage = incompleteMessage.replace('{oldDueDate}', entries[i].oldDueDateOrdinal);
              return incompleteMessage;
            case 'Pending' :
              self.setDueDateChangeRequestId(entries[i].dueDateChangeRequestId);
              self.setNewDueDate(entries[i].newDueDate);
              if (entries[i].isLetterRequired) {
                pendingLetterSingnature(entries, i, coBorrowerName);
                if (!('borrowerLetterReceivedDate' in entries[i])
                    && ((coBorrowerName)
                    && !('coBorrowerLetterReceivedDate' in entries[i]))) {
                  message = needBothBorrowerSignatureMessage;
                }

                if (self.isBorrowerRequested) {
                  message = borrowerPendingMessage(entries, i, coBorrowerName, message, needCoBorrowerSignatureMessage);
                } else {
                  if ('coBorrowerLetterReceivedDate' in entries[i]
                      && !('borrowerLetterReceivedDate' in entries[i])) {
                    message = needCoBorrowerSignatureMessage;
                  } else if ('borrowerLetterReceivedDate' in entries[i]
                      && !('coBorrowerLetterReceivedDate' in entries[i])) {
                    message = needBorrowerOnlySignatureMessage;
                  }
                }
              }
              return message;
          }
        }
      };

      self.navigateToDueDateChange = function(eligibleDates) {

        self.setEligibleDates(eligibleDates);
        var autoLoanReferenceId17Digit = autoLoanModuleService
          .getAccountDetailsData().accountDetails.autoLoanAccountReferenceId;
        self.getBalloonPaymentDates(autoLoanReferenceId17Digit).then(function(data) {
          if (data.notificationMessage) {
            self.setErrorModel({'targetFunction': 'getBalloonPaymentDates',
              'targetState': 'AutoLoanDetails.transactions.dueDateChange'});
            $state.go('AutoLoanDetails.transactions.dueDateChangeError');
          }
          if (data && data.entries) {
            self.setBalloonPaymentData(data.entries);
            $state.go('AutoLoanDetails.transactions.dueDateChange');
          }
        });

      };

      self.getEligibility=function(accountRefId,deferred) {
        var url = 'AutoLoan/accounts/' + encodeURIComponent(accountRefId) + '/ddceligibility';
        var deferred = deferred ? deferred : $q.defer();
        Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
        var getElgblty= Restangular.all(url);
        getElgblty.get('').then(function(data) {
          deferred.resolve(data);
          self.setEligibleDates(data.entries);
        },function(ex) {
          throw easeExceptionsService.createEaseException({
            'module':'GetEligibility.services',
            'function':'AutoLoanService.getEligibility',
            'message':'ex.statusText',
            'cause':ex
          });
        });
        return deferred.promise;
      };

      self.getBalloonPaymentDates=function(accountRefId) {
        var url = 'AutoLoan/accounts/' + encodeURIComponent(accountRefId) + '/due-date-change-paynow-paylater-details';

        var deferred = $q.defer();
        Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
        var balloonPaymentAmounts= Restangular.all(url);
        balloonPaymentAmounts.get('').then(function(data) {
          deferred.resolve(data);
        },function(ex) {
          throw easeExceptionsService.createEaseException({
            'module':'GetBalloonPayment.services',
            'function':'AutoLoanService.getBalloonPaymentDates',
            'message':'ex.statusText',
            'cause':ex
          });
        });
        return deferred.promise;
      };

      self.createOrUpdateDueDateChange = function(accountRefId, dueDateChangeRequest, ddcId) {
        var url = 'AutoLoan/accounts/' + encodeURIComponent(accountRefId) + '/ddcupdate';

        if (ddcId) {
          url = url + '/' + ddcId;
        }

        var deferred = $q.defer();
        Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
        var updateDueDateChange = Restangular.all(url);
        updateDueDateChange.post(dueDateChangeRequest).then(function(data) {
          deferred.resolve(data);
        },function(ex) {
          throw easeExceptionsService.createEaseException({
            'module':'AutoLoanDueDateChangeModule.services',
            'function':'autoLoanDueDateChangeService.updateDueDateChange',
            'message':'ex.statusText',
            'cause':ex
          });
        });
        return deferred.promise;
      };

      self.createDueDateChangeLetter = function(accountRefId, dueDateChangeLetterRequest) {
        var url = 'AutoLoan/accounts/' + encodeURIComponent(accountRefId) + '/getLetter';

        var deferred = $q.defer();
        Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
        var createLetter = Restangular.all(url).withHttpConfig({responseType: 'arraybuffer'});
        createLetter.post(dueDateChangeLetterRequest).then(function(data) {
          deferred.resolve(data);
        },function() {
          var errorHandlerMessage =autoLoanModuleService.getI18n().coaf.dueDateChange.dueDateChangeError;
          easeExceptionsService.displayErrorHadler(errorHandlerMessage.dueDateChangeEdocError.errorHeader.label.v1,
              errorHandlerMessage.dueDateChangeEdocError.errorMessage.label.v1);
        });
        return deferred.promise;
      };

      self.continueToSign = function(accountReferenceId) {
        var dueDateChangeRequest = {'offsetDays': self.offsetDays};
        delete self.dueDateChangeRequestId;
        self.createOrUpdateDueDateChange(accountReferenceId, dueDateChangeRequest).then(function(data) {
          if (data.notificationMessage) {
            self.errorModel = {'targetFunction': 'continueToSign',
                          'targetState': 'AutoLoanDetails.transactions.dueDateChangeEDoc'};
            $state.go('AutoLoanDetails.transactions.dueDateChangeError');
          } else {
            self.setDueDateChangeRequestId(data.dueDateChangeRequestId);
            self.continueToSignWithLetter(accountReferenceId, data.isLetterRequired);
          }
        });
      };

      self.continueToSignWithLetter = function(accountReferenceId,isLetterRequired) {
        var dueDateChangeLetterRequest = {
          'appnID': self.appnId,
          'isBorrowerRequested': self.isBorrowerRequested,
          'isLetterRequired':isLetterRequired
        };
        self.createDueDateChangeLetter(accountReferenceId, dueDateChangeLetterRequest).then(function(data) {
          if (!data || JSON.stringify(data).length <= 0) {
            var errorHandlerMessage = autoLoanModuleService.getI18n().coaf.dueDateChange.dueDateChangeError;
            easeExceptionsService.displayErrorHadler(errorHandlerMessage.dueDateChangeEdocError.errorHeader.label.v1,
                errorHandlerMessage.dueDateChangeEdocError.errorMessage.label.v1);
          } else {
            self.setDueDateChangeLetter(data);
            self.populatePrimaryContactPointInfo();
          }
        });
      };

      self.populatePrimaryContactPointInfo = function() {
        self.getContactPoint().then(function(data) {
          if (data.notificationMessage) {
            self.errorModel = {
              'targetFunction': 'getContactPoint',
              'targetState': 'AutoLoanDetails.transactions.dueDateChangeEDoc'
            };
            $state.go('AutoLoanDetails.transactions.dueDateChangeError');
          } else {
            var contactPoints = data.contactPointDetail;
            for (var i = 0; i < contactPoints.length; i++) {
              var contactPoint = contactPoints[i];
              if (contactPoint.primaryIndicator === true) {
                self.setContactPointId(contactPoint.contactPointId);
                if (contactPoint.contactPointStatus === 'Active') {
                  self.setEmailAddress(contactPoint.emailContactPoint.emailAddress);
                }
                break;
              }
            }
            $state.go('AutoLoanDetails.transactions.dueDateChangeEDoc');
          }
        });
      };

      self.getContactPoint = function() {
        var url = 'AutoLoan/customer/contactpoint';

        var deferred = $q.defer();
        Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
        var getContactPoint = Restangular.all(url);
        getContactPoint.get('').then(function(data) {
          deferred.resolve(data);
        },function(ex) {
          throw easeExceptionsService.createEaseException({
            'module':'AutoLoanDueDateChangeModule.services',
            'function':'autoLoanDueDateChangeService.getContactPoint',
            'message':'ex.statusText',
            'cause':ex
          });
        });
        return deferred.promise;
      };

      self.updateContactPoint = function(contactPointRequest, contactPointId) {
        var url = 'AutoLoan/customer/contactpoint/' + encodeURIComponent(contactPointId);
        var deferred = $q.defer();
        Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
        var changeContactPoint = Restangular.all(url);
        changeContactPoint.post(contactPointRequest).then(function(data) {
          deferred.resolve(data);
        },function(ex) {
          throw easeExceptionsService.createEaseException({
            'module':'AutoLoanDueDateChangeModule.services',
            'function':'autoLoanDueDateChangeService.updateContactPoint',
            'message':'ex.statusText',
            'cause':ex
          });
        });
        return deferred.promise;
      };

      self.changeContactPoint = function() {
        var contactPointRequestBody = {
          'primaryIndicator': true,
          'contactPointStatus': 'Active',
          'emailContactPoint': {
            'emailAddress': self.newEmailAddress,
            'emailMessageFormat': 'HTML'
          }
        };

        self.updateContactPoint(contactPointRequestBody, self.contactPointId).then(function(data) {
          if (data.notificationMessage) {
            self.setEmailAddress('');
            self.errorModel = {
              'targetFunction': 'updateContactPoint',
              'targetState': 'AutoLoanDetails.transactions.dueDateChangeEDoc'
            };
            $state.go('AutoLoanDetails.transactions.dueDateChangeError');
          } else {
            self.setEmailAddress(self.newEmailAddress);
            $state.go('AutoLoanDetails.transactions.dueDateChangeEDoc');
          }
        });
      };


      self.addContactPoint = function() {
        var contactPointRequestBody = {
          'primaryIndicator': true,
          'contactPointStatus': 'Active',
          'emailContactPoint': {
            'emailAddress': self.newEmailAddress,
            'emailMessageFormat': 'HTML'
          }
        };

        self.createContactPoint(contactPointRequestBody).then(function(data) {
          if (data.notificationMessage) {
            self.setEmailAddress('');
            self.errorModel = {
              'targetFunction': 'createContactPoint',
              'targetState': 'AutoLoanDetails.transactions.dueDateChangeEDoc'
            };
            $state.go('AutoLoanDetails.transactions.dueDateChangeError');
          } else {
            self.setEmailAddress(self.newEmailAddress);
            self.populatePrimaryContactPointInfo();
          }
        });
      };

      self.createContactPoint = function(contactPointRequest) {
        var url = 'AutoLoan/customer/contactpoint';
        var deferred = $q.defer();
        Restangular.setBaseUrl(EaseConstantFactory.baseUrl());
        var createContactPoint = Restangular.all(url);
        createContactPoint.post(contactPointRequest).then(function(data) {
          deferred.resolve(data);
        },function(ex) {
          throw easeExceptionsService.createEaseException({
            'module':'AutoLoanDueDateChangeModule.services',
            'function':'autoLoanDueDateChangeService.createContactPoint',
            'message':'ex.statusText',
            'cause':ex
          });
        });
        return deferred.promise;
      };

      self.tryAgain = function(accountReferenceId) {
        if (self.errorModel) {
          if (self.errorModel.targetFunction === 'continueToSign') {
            self.continueToSign(accountReferenceId);
          } else if (self.errorModel.targetFunction === 'getEligibility'
            || self.errorModel.targetFunction === 'getBalloonPaymentDates') {
            self.navigateToDueDateChange(self.getEligibleDates());
          } else if (self.errorModel.targetFunction === 'continueToSignWithLetter') {
            self.continueToSignWithLetter(accountReferenceId);
          } else if (self.errorModel.targetFunction === 'submitDueDateChangeRequest') {
            self.submitDueDateChangeRequest(accountReferenceId);
          } else if (self.errorModel.targetFunction === 'getContactPoint') {
            self.populatePrimaryContactPointInfo();
          } else if (self.errorModel.targetFunction === 'createContactPoint') {
            self.addContactPoint();
          } else if (self.errorModel.targetFunction === 'updateContactPoint') {
            self.changeContactPoint();
          }
        }
      };

      self.submitDueDateChangeRequest = function(accountReferenceId) {
        var dueDateChangeRequest = {
          'dueDateChangeStatusCode': 'Pending',
          'fulfillmentType': 'EMAIL',
          'fulfillmentEmailAddress': self.emailAddress,
          'isBorrowerRequested': (self.isBorrowerRequested === true ? '1' : '0'),
          'eddnSignedDateTime': new Date().setHours(0, 0, 0, 0)
        };
        self.createOrUpdateDueDateChange(accountReferenceId, dueDateChangeRequest,
            self.dueDateChangeRequestId).then(function(data) {
              if (data.notificationMessage) {
                self.errorModel = {'targetFunction': 'submitDueDateChangeRequest',
                  'targetState': 'AutoLoanDetails.transactions.dueDateChangeSuccess'};
                $state.go('AutoLoanDetails.transactions.dueDateChangeError');
              } else {
                self.setSuccessResponse(data);
                $state.go('AutoLoanDetails.transactions.dueDateChangeSuccess');
              }
            });
      };

      self.getErrorModel = function() {
        return self.errorModel;
      };

      self.setErrorModel = function(data) {
        self.errorModel = data;
      };

      self.getOffsetDays = function() {
        return self.offsetDays;
      };

      self.setOffsetDays = function(data) {
        self.offsetDays = data;
      };

      self.getAppnId = function() {
        return self.appnId;
      };

      self.setAppnId = function(data) {
        self.appnId = data;
      };

      self.getNewDueDate = function() {
        return self.newDueDate;
      };

      self.setNewDueDate = function(data) {
        self.newDueDate = data;
      };

      self.getIsBorrowerRequested = function() {
        return self.isBorrowerRequested;
      };

      self.setIsBorrowerRequested = function(data) {
        self.isBorrowerRequested = data;
      };

      self.getEmailAddress = function() {
        return self.emailAddress;
      };

      self.setEmailAddress = function(data) {
        self.emailAddress = data;
      };

      self.getDueDateChangeRequestId = function() {
        return self.dueDateChangeRequestId;
      };

      self.setDueDateChangeRequestId = function(data) {
        self.dueDateChangeRequestId = data;
      };

      self.getNewDueDateOrdinal = function() {
        return self.newDueDateOrdinal;
      };

      self.setNewDueDateOrdinal = function(data) {
        self.newDueDateOrdinal = data;
      };

      self.getOldDueDateOrdinal = function() {
        return self.oldDueDateOrdinal;
      };

      self.setOldDueDateOrdinal = function(data) {
        self.oldDueDateOrdinal = data;
      };


      self.getContactPointId = function() {
        return self.contactPointId;
      };

      self.setContactPointId = function(data) {
        self.contactPointId = data;
      };

      self.getNewEmailAddress = function() {
        return self.newEmailAddress;
      };

      self.setNewEmailAddress = function(data) {
        self.newEmailAddress = data;
      };


      self.getIsAddEmailAddress = function() {
        return self.isAddEmailAddress;
      };

      self.setIsAddEmailAddress = function(data) {
        self.isAddEmailAddress = data;
      };

      self.setHasCoborrowerSigned = function(data) {
        self.hasCoborrowerSigned = data;
      };

      self.getHasCoborrowerSigned = function() {
        return self.hasCoborrowerSigned;
      };

    });

  return AutoLoanDueDateChangeModule;
});
