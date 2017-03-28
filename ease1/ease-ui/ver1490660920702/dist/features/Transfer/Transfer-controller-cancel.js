define(["angular"],function(n){"use strict";var e=n.module("TransferModule");return e.controller("TransferCancelCtrl",["easeUIModalService","transferState","$state","TransferFactory","TransferAnalytics","easeTemplates",function(n,e,t,a,r,o){n.showModal({templateUrl:o.get("Transfer","","cancel"),controller:"TransferCancelModalCtrl"}).then(function(n){n.close.then(function(n){if(a.removePrintClass(),!n){var o=e.getCurrentLOB(),c={level2:a.getPageType(o)};r.trackAnalytics("",c),t.go(o)}})})}]),e.controller("TransferCancelModalCtrl",["$scope","$state","transferState","TransferFactory","TransferAnalytics","$stateParams","EaseLocalizeService","close",function(e,t,a,r,o,c,s,f){var l=e;l.contentData=r.getContentData();var i=a.get();l.transactionInfo=r.getEditTransferData(),s.get("accountSummary").then(function(e){var a=o.buildLOB(l.transactionInfo.fromAccount.accountType,l.transactionInfo.toAccount.accountType),c={level2:"delete transfer"};o.trackAnalytics(a,c),l.i18n=e,n.extend(l,{closeModal:function(n){l.loadingClass||l.close(n)},close:f,loadingClass:!1,confirm:function(){l.loadingClass=!0,r.cancelTransfer(l.transactionInfo.moneyTransferReferenceId).then(function(n){l.loadingClass=!1,n.executionStatus&&"success"===n.executionStatus.toLowerCase()&&(t.go(i.transferCancelConfirm.name,{moneyTransferID:l.transactionInfo.moneyTransferID,moneyTransferReferenceId:l.transactionInfo.moneyTransferReferenceId,data:{transactionAmount:l.transactionInfo.transactionAmount,transactionCurrency:l.i18n.transferCurrency,accountRefId:l.transactionInfo.fromAccount.accountReferenceId,fromAccountType:l.transactionInfo.fromAccount.accountType,toAccountType:l.transactionInfo.toAccount.accountType}}),l.closeModal(n))})}})})}]),e});