define(["angular"],function(e){"use strict";var n=e.module("TransferModule");return n.controller("TransferCancelConfirmCtrl",["easeUIModalService","transferState","$state","TransferFactory","TransferAnalytics","easeTemplates",function(e,n,a,t,r,o){e.showModal({templateUrl:o.get("Transfer","","cancel-confirm"),controller:"TransferCancelConfirmModalCtrl"}).then(function(e){e.close.then(function(e){if(t.removePrintClass(),!e){var o=n.getCurrentLOB(),c={level2:t.getPageType(o)};r.trackAnalytics("",c),a.go(o,{},{reload:!0})}})})}]),n.controller("TransferCancelConfirmModalCtrl",["$scope","$state","$stateParams","transferState","TransferFactory","TransferAnalytics","EaseLocalizeService","close","$q",function(n,a,t,r,o,c,s,l,i){var f=n;f.contentData=o.getContentData();var d=r.get();f.transactionInfo=t.data;var u=c.buildLOB(f.transactionInfo.fromAccountType,f.transactionInfo.toAccountType),g={level2:"delete transfer",level3:"cancel confirmed"};c.trackAnalytics(u,g),e.extend(f,{closeModal:function(e){f.isLoading||f.close(e)},close:l,isLoading:!1,startAnotherTransfer:function(){f.isLoading=!0;var e=i.defer(),n=a.go(d.transferStart.name,{referenceId:f.transactionInfo.accountRefId});return c.trackAnalyticsByName("start another transfer:link"),n.then(function(n){f.isLoading=!1,e.resolve(f.closeModal(n))},function(n){f.isLoading=!1,e.reject(f.closeModal(n))}),e.promise}})}]),n});