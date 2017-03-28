define(["angular"],function(e){"use strict";var a=e.module("UMMPaymentModule");return a.directive("addacctCompareTo",function(){return{require:"ngModel",scope:{otherModelValue:"=addacctCompareTo"},link:function(e,a,t,n){n.$validators.addacctCompareTo=function(a){return a?a==e.otherModelValue:!1},e.$watch("otherModelValue",function(){n.$validate()})}}}),a.directive("getBankDetails",["UmmPaymentFactory",function(e){return{link:function(a,t,n){t.on("blur",function(t){var n=new RegExp("^[0-9]+$");a.bankDetails;var r=a.bankName;t.target.value&&9===t.target.value.length&&n.test(t.target.value)?t.target.value!==a.extPay.abaNumber.$$lastCommittedViewValue?e.getBankDetails(t.target.value).then(function(t){t.easeDisplayError&&t.easeDisplayError.displayMessage?(a.extPay.abaNumber.$invalid=!0,a.extPay.abaNumber.$pristine=!1,a.extPay.abaNumber.$dirty=!0,a.extPay.abaNumber.$valid=!1,a.bankName=""):(a.bankName=t.bankName,e.setBankName(t.bankName))},function(e){a.bankName=""}):a.bankName=r:a.bankName=""})}}}]),a.directive("highlightTextbox",function(){return{restrict:"A",require:"ngModel",link:function(a,t,n,r){var i=document.getElementById("abaNumber"),u=document.getElementById("bankName");r.$validators;t.on("focus",function(t){"abaNumber"===t.target.name?r.$invalid&&!r.$pristine?e.element(u).addClass("inputError"):(e.element(u).removeClass("inputError"),e.element(u).addClass("inputBorder")):"bankName"===t.target.name&&(a.extPay.abaNumber.$invalid&&!a.extPay.abaNumber.$pristine?e.element(i).addClass("inputError"):(e.element(i).removeClass("inputError"),e.element(i).addClass("inputBorder")))}),t.on("blur",function(t){"abaNumber"===t.target.name?r.$valid&&r.$pristine||e.element(u).removeClass("inputBorder"):"bankName"===t.target.name&&(a.extPay.abaNumber.$invalid&&!a.extPay.abaNumber.$pristine||e.element(i).removeClass("inputBorder"))})}}}),a});