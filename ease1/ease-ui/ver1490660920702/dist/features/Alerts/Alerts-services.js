define(["angular"],function(e){"use strict";function t(e,t,r,n,o,s,c){function a(t){c.$broadcast("error",{msgHeader:t.headerMessage?t.headerMessage:e.getAccSummaryI18().errorSnag.snagHeader,msgBody:t.displayMessage})}function i(e){var r=t.defer();return o.get().then(function(t){var n=s.filter(t.accounts,{category:e});r.resolve(n)},function(e){r.reject(e)}),r.promise}function u(e){return e.substring(e.length-4,e.length)}function l(o,s){var c=t.defer(),a=encodeURIComponent(o.referenceId),i="coaf"===s?"":"&type="+o.accountUseType;return e.clearCustomerActivityHeader(),e.setCustomerActivityHeader("50091"),r.setBaseUrl(n.baseUrl),r.one("customer/alerts/"+s+"?accountReferenceId="+a+i).get().then(function(e){if("coaf"===s&&e.entries&&e.entries.alertSubscription){var t=f(e.entries.alertSubscription);c.resolve(t)}else c.resolve(e)},function(e){c.reject(e)}),c.promise}function d(o,s,c){var a=t.defer(),i=encodeURIComponent(o.referenceId);return e.clearCustomerActivityHeader(),e.setCustomerActivityHeader("50094"),r.setBaseUrl(n.baseUrl),s=s?"/"+s:"",r.one("customer/alerts"+s+"?accountReferenceId="+i).customPOST(c).then(function(e){a.resolve(e)},function(e){a.reject(e)}),a.promise}function f(e){return s.forEach(e,function(e){e.sendToContactPoints&&e.sendToContactPoints.contactPointSummary.length>0?e.subscribedIndicator=!0:e.subscribedIndicator=!1}),e}function m(e){return e[0].eligibleContactPoints?1===s.filter(e[0].eligibleContactPoints.contactPointSummary,{destinationType:"EML"}).length:!1}function g(o){var s=t.defer(),c={alertSubscription:o};e.clearCustomerActivityHeader(),e.setCustomerActivityHeader("50094"),r.setBaseUrl(n.baseUrl);var a=r.all("customer/alerts");return a.post(c).then(function(e){s.resolve(e)},function(e){s.reject(e)}),s.promise}return{getAccountsWithAlerts:i,trimAccountNumber:u,getAlerts:l,postAlerts:d,updateAlertSubscriptions:g,showSnag:a,showSendToPrimEmailText:m}}var r=e.module("AlertsModule");return r.factory("alertsFactory",t),t.$inject=["EASEUtilsFactory","$q","Restangular","EaseConstant","summaryService","_","$rootScope"],r});