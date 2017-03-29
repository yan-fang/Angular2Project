define("AccountDetailModule",["angular"],function(t){"use strict";function e(t,e){}var n=t.module("AccountDetailsModule",["ui.router","restangular","oc.lazyLoad","EaseProperties","easeAppUtils","ngAnimate","filterComponent","angular-lo-dash","ngLocale"]);e.$inject=["EaseConstant","easeFilesProvider"],n.config(e)}),define("AccountDetailServices",["angular"],function(t){"use strict";t.module("AccountDetailsModule").factory("accountDetailService",["EaseConstant","EASEUtilsFactory","$q","Restangular","EaseConstantFactory","$animate","easeExceptionsService","summaryService","featureToggleFactory",function(t,e,n,a,s,o,i,c,r){function l(){var t=n.defer(),e=r.getFeatureToggleData();return _.isEmpty(e)?r.initializeFeatureToggleData().then(function(e){t.resolve(e)}):t.resolve(e),t.promise}function u(n){var a=r.getFeatureToggleData();return!!(n.subCategory&&"retail"===n.subCategory.toLowerCase()&&a&&a[t.features.enableRetailNavigation]&&["DDA","SA","MMA","CD"].indexOf(n.category)!==-1)||0!==["COI"].indexOf(n.category)&&!e.isInActiveProduct(n).isNotClickable}var d={};return d.getAccountPosition=function(t){var e=n.defer();return l().then(function(){c.get().then(function(n){for(var a=n.accounts.filter(u),s=0;s<a.length&&a[s].referenceId!==t;)s++;var o=!0,i=!0,c=s-1,r=s+1;0===s?c=a.length-1:s===a.length-1&&(r=0),o={isLeftNavigable:!1,account:a[c]},i={isRightNavigable:!1,account:a[r]},1===a.length&&(o.isLeftNavigable=!0,i.isRightNavigable=!0),e.resolve({showLeftArrow:o,showRightArrow:i})})}),e.promise},d.getAccountDetailsData=function(t,n){return e.getAccountDetailData(t,n)},d.createUrl=function(t,n){return e.createAccountDetailUrl(t,n)},d.appendMoreTransactions=function(t,e,n){e=this.processTransactions(n,e);for(var a=0;a<e.entries.length;a++)t.entries.push(e.entries[a]);return t},d.getfilterResult=function(t,e){return t=this.processTransactions(e,t)},d}]).factory("productTypeFactory",["EaseConstant","$locale",function(t,e){return{getProductType:function(e,n){return t.partialFilePath[n][0]+t.partialFilePath[n][1]},getTransactionType:function(e){if("undefined"!=typeof e)return t.partialFilePath[e][0]+t.partialFilePath[e][2]},getCreditCardInfo:function(t){return t.substring(t.length-4,t.length)},processAutoLoan:function(t){return t.dteDueDate=new Date(t.dueDate),t.dteDueDateMonth=e.DATETIME_FORMATS.MONTH[t.dteDueDate.getMonth()],t.dteDueDateDay=t.dteDueDate.getDay(),console.log(t.vehicleIdentificationNumber),t.strIDNumber=t.vehicleIdentificationNumber,t}}}])}),define("AccountDetailController",["angular"],function(t){"use strict";function e(e,n,a,s,o,i,c,r,l,u,d){document.body.scrollTop=0,i.sortConstantKeys.kTransactionDate="dteTransactionDate",i.descendingSort.scheduled=!0,i.descendingSort.pending=!0,i.descendingSort.posted=!0,u.get("accountDetails").then(function(t){e.i18n=t},function(t){console.error(t)}),t.extend(e,{accountDetailsData:n,AccountType:s.accountDetails.lineOfBusiness,on:!0,goToTransactions:function(){a.go(i.states.kAccountDetailTransactions,{accountReferenceId:s.accountReferenceId})},goToSettings:function(){a.go(i.states.kAccountDetailSettings)},goToAccountSummary:function(t){l.IsFooterDisplaySet(!1);var e=document.body.querySelector("#transactions");r.addClass(e,"transactionAnimationBack"),r.addClass(document.body.querySelector("[detail-animation]"),"detailAnimationExit",function(){a.go(i.states.kAccountSummary)})},GetImage:function(t){return"/ease-ui"+i.kBuildVersionPath+"/dist/features/AccountSummary/images/"+t+".png"},carouselClick:function(t){e.carouselLoadingClass=i.loading,a.go(i.states.kAccountDetailTransactions,{accountReferenceId:"prev"===t?e.carouselControls.showLeftArrow.accountReferenceId:e.carouselControls.showRightArrow.accountReferenceId,lineOfBusiness:"prev"===t?e.carouselControls.showLeftArrow.lineOfBusiness:e.carouselControls.showRightArrow.lineOfBusiness})},openStatement:function(t){}}),s.accountDetails.lineOfBusiness===i.lineOfBusiness.CreditCard&&null!==e.accountDetailsData.accountDetails?(e.accountDetailsData.accountDetails.displayBalanceDollarAmt=Math.abs(n.accountDetails.presentBalanceDollorAmt),e.accountDetailsData.accountDetails.displayBalanceCentsAmt=Math.abs(n.accountDetails.presentBalanceCentsAmt),e.accountDetailsData.accountDetails.displayAvailableCredit=Math.abs(n.accountDetails.availableCredit),e.accountDetailsData.accountDetails.creditLimit=Math.abs(n.accountDetails.creditLimit)):s.accountDetails.lineOfBusiness===i.lineOfBusiness.AutoLoan&&typeof e.accountDetailsData.accountDetails.vehicleType!==i.kUndefined&&(e.accountDetailsData.accountDetails=o.processAutoLoan(e.accountDetailsData.accountDetails)),e.InitilizeTemplate=function(){c.getAccountPosition(s.accountReferenceId).then(function(t){e.carouselControls={showLeftArrow:t.showLeftArrow,showRightArrow:t.showRightArrow}});var t=l.SelectDetailsTransaction(s.accountDetails).lobType;e.productType=d.get("template",t,"detail"),e.transactionType=d.get("template",t,"transactions")}}function n(e,n,a,s,o,i,c,r,l,u,d){d.get("accountDetails").then(function(t){n.i18n=t},function(t){console.error(t)}),t.extend(n,{items:[{id:30,name:"Show Last 30 Days"},{id:60,name:"Show Last 60 Days"},{id:90,name:"Show Last 90 Days"}],posted:s.transactions.entries?s.transactions.entries:[],pending:s.transactions.pending?s.transactions.pending:[],scheduled:s.transactions.scheduled?s.transactions.scheduled:[],sortType:{sortDateDesc:!0,sortMerchantDesc:!0,sortCategoryDesc:!0,sortDescriptionDesc:!0,sortAmountDesc:!0,sortBalanceDesc:!0},filterText:"",searchProps:[]}),t.extend(n,{item:n.items[0],displayTransactionsList:!!(n.posted.length||n.pending.length||n.scheduled.length),displayTransactions:u.mapSort(n.posted,r.sortConstantKeys.kTransactionDate,r.descendingSort.posted),pendingTransactions:u.mapSort(n.pending,r.sortConstantKeys.kTransactionDate,r.descendingSort.pending),scheduledTransactions:u.mapSort(n.scheduled,r.sortConstantKeys.kTransactionDate,r.descendingSort.scheduled),sortIndex:c.dateDescending,accDetailSorter:function(t,e){n.sortIndex===c[t+"Descending"]?(n.displayTransactions=u.mapSort(n.posted,r.sortConstantKeys.kTransactionDate,r.descendingSort.posted),n.pendingTransactions=u.mapSort(n.pending,r.sortConstantKeys.kTransactionDate,r.descendingSort.pending),n.scheduledTransactions=u.mapSort(n.scheduled,r.sortConstantKeys.kTransactionDate,r.descendingSort.scheduled),n.sortIndex=c[t+"Ascending"],n.sortType[e+"Asc"]=!1,n.sortType[e+"Desc"]=!0):(n.displayTransactions=u.mapSort(n.posted,r.sortConstantKeys.kTransactionDate,!r.descendingSort.posted),n.pendingTransactions=u.mapSort(n.pending,r.sortConstantKeys.kTransactionDate,!r.descendingSort.pending),n.scheduledTransactions=u.mapSort(n.scheduled,r.sortConstantKeys.kTransactionDate,!r.descendingSort.scheduled),n.sortIndex=c[t+"Descending"],n.sortType[e+"Asc"]=!0,n.sortType[e+"Desc"]=!1)},changeItem:function(t){var e=t.id,a={filter:e,type:r.urlPostFixerTransactions,ProductCategory:o.accountDetails.lineOfBusiness};n.$parent.transactionsloadingClass=r.loading,l.getAccountDetailsData(a,o.accountReferenceId).then(function(t){n.$parent.transactionsloadingClass="",n=l.getfilterResult(t,o.accountDetails.lineOfBusiness),n.displayTransactions=u.mapSort(n.posted,r.sortConstantKeys.kTransactionDate,r.descendingSort.posted),n.pendingTransactions=u.mapSort(n.pending,r.sortConstantKeys.kTransactionDate,r.descendingSort.pending),n.scheduledTransactions=u.mapSort(n.scheduled,r.sortConstantKeys.kTransactionDate,r.descendingSort.scheduled),n.sortIndex=c.dateDescending})},loadMoreTransactions:function(){var t={type:r.urlPostFixerTransactions,ProductCategory:o.accountDetails.lineOfBusiness};n.moreTransactionsloadingClass=r.loading,l.getAccountDetailsData(t,n.nextURL.href).then(function(t){n.moreTransactionsloadingClass="",n=l.appendMoreTransactions(n,t,o.accountDetails.lineOfBusiness),n.displayTransactions=u.mapSort(n.posted,r.sortConstantKeys.kTransactionDate,r.descendingSort.posted),n.pendingTransactions=u.mapSort(n.pending,r.sortConstantKeys.kTransactionDate,r.descendingSort.pending),n.scheduledTransactions=u.mapSort(n.scheduled,r.sortConstantKeys.kTransactionDate,r.descendingSort.scheduled),n.sortIndex=c.dateDescending,typeof t.nextURL===r.kUndefined?n.nextURL=!1:n.nextURL=t.nextURL,u.IsFooterDisplaySet(!0)})},haveSearchResults:function(){var t=e(n.pendingTransactions,n.filterText,n.searchProps),a=e(n.displayTransactions,n.filterText,n.searchProps);return t.length>0||a.length>0}})}t.module("AccountDetailsModule").controller("AccountDetailsParentController",e).controller("AccountDetailsTransactionController",n).controller("AccountDetailsSettingsController",["$scope","$stateParams",function(t,e){}]).constant("sortConstant",{dateAscending:0,dateDescending:1,merchantAscending:2,merchantDescending:3,categoryAscending:4,categoryDescending:5,amountAscending:6,amountDescending:7,balanceAscending:8,balanceDescending:9,descriptionAscending:10,descriptionDescending:11}),e.$inject=["$scope","accountDetailsData","$state","$stateParams","productTypeFactory","EaseConstant","accountDetailService","$animate","EASEUtilsFactory","EaseLocalizeService","easeTemplates"],n.$inject=["filterTransactionsFilter","$scope","$rootScope","accountDetailsData","$stateParams","_","sortConstant","EaseConstant","accountDetailService","EASEUtilsFactory","EaseLocalizeService"]}),define("AccountDetailDirectives",["angular"],function(t){"use strict";t.module("AccountDetailsModule").directive("sampleDirective",["EASEUtilsFactory",function(t){return{scope:{controllerFunction:"&callbackFn"},link:function(t,e,n){t.controllerFunction({arg1:1})}}}]).directive("accountDetailsNextAcct",["EaseConstant","$state","EASEUtilsFactory","pubsubService",function(t,e,n,a){return{restrict:"AE",template:'<div><button aria-label="{{i18n.nextAriaLabel}}" class="next_prev next_acct"ng-hide="carouselControls.showRightArrow.isRightNavigable"><img src="{{::nextButtonImg}}"  alt="{{i18n.nextImageAltText}}" ></button></div>',link:function(s,o){s.nextButtonImg=t.nextButtonImg,o.bind("click",function(){a.pubsubCarouselClicked({name:"next:carousel"}),s.carouselLoadingClass=t.loading;var o=s.carouselControls.showRightArrow.account,i=n.getStateDetailsObject(o);e.go(n.SelectDetailsTransaction(o).lobType+"Details.transactions",i)})}}}]).directive("accountDetailsPrevAcct",["EaseConstant","$state","EASEUtilsFactory","pubsubService",function(t,e,n,a){return{restrict:"AE",template:'<div><button aria-label="{{i18n.prevAriaLabel}}" class="next_prev prev_acct"  ng-hide="carouselControls.showLeftArrow.isLeftNavigable"><img src="{{::prevButtonImg}}"  alt="{{i18n.prevImageAltText}}" ></button></div>',link:function(s,o){s.prevButtonImg=t.prevButtonImg,o.bind("click",function(){a.pubsubCarouselClicked({name:"previous:carousel"}),s.carouselLoadingClass=t.loading;var o=s.carouselControls.showLeftArrow.account,i=n.getStateDetailsObject(o);e.go(n.SelectDetailsTransaction(o).lobType+"Details.transactions",i)})}}}]).directive("transactionDate",["dateFilter",function(t){return{restrict:"AE",template:'<span class="right-col month">{{month}}</span><span class="right-col day">{{day}}</span>',link:function(e,n,a){e.month=t(a.transactionDate,"MMM"),e.day=t(a.transactionDate,"dd")}}}])}),define("AccountDetailFilters",["angular","c1Date"],function(t){"use strict";t.module("AccountDetailsModule").filter("filterTransactions",["$locale",function(e){return function(n,a,s,o){var i=[];if(n)if(o&&o.start&&o.end)for(var c,r=c1Date(o.start),l=c1Date(o.end),u=0;u<n.length;u++)c=n[u].displayDate?c1Date(n[u].displayDate):c1Date(n[u].paymentDate),(c.isBetween(r,l)||c.isBetween(l,r))&&i.push(n[u]);else i=n;var d=s&&s.length>0?s:["transactionDate","merchantName","category","transactionAmount","accountBalance"];return i.length>0&&a&&(i=i.filter(function(n){"..."===a.substr(0,3)&&(a=a.substr(3));var s=!0,o=a.toLowerCase(),i=d;return s=s&&i.some(function(a){for(var s=n,i=a.split("."),c=0;c<i.length;c++)if(s=s[i[c]],!s)return!1;if(a.toLowerCase().indexOf("date")!==-1){var r=new Date(s),l=r.getMonth(),u=r.getDate(),d=u<10?"0"+u:u,g=r.getFullYear(),D=r.getDay(),p=e.DATETIME_FORMATS.MONTH[l].toLowerCase(),f=e.DATETIME_FORMATS.SHORTMONTH[l].toLowerCase(),h=e.DATETIME_FORMATS.SHORTDAY[D].toLowerCase();l=l<9?"0"+(l+1):l+1;var T=l+"/"+u+"/"+g,m=l+"/"+d+"/"+g,A=h+", "+f+" "+u+", "+g,y=h+", "+f+" "+d+", "+g,C=h+", "+p+" "+u+", "+g,S=h+", "+p+" "+d+", "+g;return t.isDefined(s)&&(T.indexOf(o)!==-1||m.indexOf(o)!==-1||A.indexOf(o)!==-1||y.indexOf(o)!==-1||C.indexOf(o)!==-1||S.indexOf(o)!==-1)}if(a.toLowerCase().indexOf("amount")!==-1||a.toLowerCase().indexOf("balance")!==-1){var v,b;if("number"==typeof s){var x=Math.abs(s).toFixed(2);v="-$"+x,b="$-"+x}else v="-$"+s,b="$-"+s;return t.isDefined(s)&&(v.indexOf(o)!==-1||b.indexOf(o)!==-1)}return t.isDefined(s)&&s.toString().toLowerCase().indexOf(o)!==-1})})),i}}])}),define("AccountDetailBundle",["AccountDetailModule","AccountDetailServices","AccountDetailController","AccountDetailDirectives","AccountDetailFilters"],function(){}),require(["AccountDetailBundle"]);