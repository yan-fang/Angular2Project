define(['angular'], function(angular) {
  'use strict';

  angular.module('UMMPaymentModule')
    .factory('HomeLoansUtils', ['$location', 'pubsubService','homeLoansAccountDetailsService',function($location, pubsubService,homeLoansAccountDetailsService) {

      var utilityFunctions = {
        isANumber: function(n) {
          return !isNaN(parseFloat(n)) && isFinite(n);
        },
        date_sort_desc_trans: function(a, b) {
          return new Date(a.transactionPostedDate).getTime() - new Date(b.transactionPostedDate).getTime();
        },
        date_sort_desc_payments: function(a, b) {
          return new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime();
        },
        getMonths: function(numMonths) { //TODO: REMOVE AND PLACE IN THE OL
          var years = Math.floor(numMonths/12);
          var monthRemainder = numMonths % 12;
          var remainderString = "";
          var yearPluralityString = " Years";
          var monthPluralityString = "  Months";
          var monthRemainderPluralityString = "  Months";
          
          if (monthRemainder == 1) {
          monthRemainderPluralityString = " Month";
          }
         if (numMonths == 1) {
          monthPluralityString = " Month";
          }
         if (years == 1) {
          yearPluralityString = " Year";
          }

          if (numMonths < 12) {
            return (numMonths + monthPluralityString);
          }
          else {
            if(monthRemainder != 0) {
              remainderString = (", " + monthRemainder + monthRemainderPluralityString);
            }

            return (years + yearPluralityString + remainderString);
          }
        },
        getOriginalAmountLabel: function(accountType) {
          //Consider removing function if HLC/HIL have more differences in HomeLoansProperties.productSplit
          if(accountType == 'HLC') {
            // B-1207406 changed from Original Loan Amount to Credit Line Amount only for HELOC
            return homeLoansAccountDetailsService.getI18n().loanDetails.totalLineOfCreditLimit;
          }
          else {
            return homeLoansAccountDetailsService.getI18n().loanDetails.originalLoanAmount;
          }
        },
        getOriginalAmountValue: function(accountType, homeEquityAccount) {
          //Consider removing function if HLC/HIL have more differences in HomeLoansProperties.productSplit
          if(accountType == 'HLC') {
            // B-1207406 changed from Original Loan Amount to Credit Line Amount only for HELOC
            return homeEquityAccount.loanAccountBalanceInformation.totalLineOfCreditLimit;
          }
          else {
            return homeEquityAccount.loanAccountBalanceInformation.originalLoanAmount;
          }
        },

        showPaymentField: function(field) {
          if (field == 0 || field == null) {
            return false;
          }
          else return true;
        },
        dynamicPaymentLabel: function(paymentOption, paymentOptionsSyntax) {
          if (paymentOption == paymentOptionsSyntax.principalOnly) {
            return 'Principal Amount';
          }
          else if (paymentOption == paymentOptionsSyntax.amountDuePrincipal) {
            return 'Additional Principal Amount';
          }
          else if (paymentOption == paymentOptionsSyntax.partialPayment) {
            return 'Other Amount';
          }
          return "";
        },
        landingPageEvent : function(){
          //TODO refine it to factory method.
          pubsubService.pubsubTrackAnalytics({
        	  taxonomy: {
        	  level1: 'ease',
        	  level2: 'account details',
        	  level3: '',
        	  level4: '',
        	  level5: '',
        	  country: 'us',
        	  language: 'english',
        	  system: 'ease_web'
        	  },
        	  lob: 'home loans'
          });
        },
        pageEvents : function(level2Val, level3Val){
          //TODO refine it to factory method.
          pubsubService.pubsubPageView({
            scDLLevel1: 'ease',
            scDLLevel2: level2Val,
            scDLLevel3: level3Val,
            scDLLevel4: '',
            scDLLevel5: '',
            scDLCountry: 'us',
            scDLLanguage: 'english',
            scDLSystem: 'ease_web',
            scDLLOB: 'home loans'
          });
        },
        analyticsTracking: function(level2Val, level3Val, level4Val) {
          level3Val = level3Val || '';
          level4Val = level4Val || '';
          pubsubService.pubsubTrackAnalytics({
            taxonomy: {
              level1: 'ease',
              level2: level2Val,
              level3: level3Val,
              level4: level4Val,
              level5: '',
              country: 'us',
              language: 'english',
              system: 'ease_web'
            },
            lob: 'home loans'
          });
        },
        buttonAnalytics: function(dataLayer) {
          pubsubService.pubsubTrackAnalytics(dataLayer);
        },
        buttonClicked : function(value){
          pubsubService.pubsubButtonClick({buttonName: value});
        },
        subtractDay : function (nextPaymentDateStr) {
          var parts = nextPaymentDateStr.split('-');
          var pmtDate = new Date(nextPaymentDateStr);
          var day = new Date(parts[0], pmtDate.getMonth() -1, pmtDate.getDate());
          return day.getDate().toString();
        },
        // increase 1 month on the given date string
        addMonth : function (nextPaymentDateStr) {
          nextPaymentDateStr = nextPaymentDateStr.substring(0, 10);
          var parts = nextPaymentDateStr.split('-');
          var month = parseInt(parts[1]) + 1;
          return parts[0]+'-'+this.prepadChar(month,2,'0')+'-'+parts[2];
        },
        // pad zero in front of the numeric value and return string
        prepadChar : function(value, length, padString) {
          var valueStr = '' + value;
          while (valueStr.length < length) {
            valueStr = padString + valueStr;
          }
          return valueStr;
        },
        getSuffixNextDay               : function (nextday, i18n) {
          var suffix = i18n.payment.th;
          if (nextday == '1' || nextday == '21') {
            suffix = i18n.payment.st;
          }
          else if (nextday == '2' || nextday == '22') {
            suffix = i18n.payment.nd;
          }
          else if (nextday == '3' || nextday == '23') {
            suffix = i18n.payment.rd;
          }
          return nextday + suffix;
        },
        // returns formatted frequency string using effective date and payment due date
        getDateValue : function(i18n, recurringPaymentEnabled, nextPaymentDate, scheduledDate, paymentFrequency, datePushed) {
          if (recurringPaymentEnabled) {
            var nextPaymentDateStr = nextPaymentDate;
            if(paymentFrequency !== 'BiWeekly' && datePushed) {
              nextPaymentDateStr = this.addMonth(nextPaymentDate);
            }
            var nextday = this.subtractDay(nextPaymentDateStr);
            var schDay = new Date(scheduledDate);
            var schDate = schDay.getDate();
            var displayVar = '';
            var dayValue = '';
            var mydate = new Date(scheduledDate);
            var nxtPmtDate = new Date(nextPaymentDateStr);
            var timeDiff = Math.abs(nxtPmtDate.getTime() - mydate.getTime());
            var graceDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

            if (paymentFrequency == 'BiWeekly') {
              var suffixDay = this.getSuffixDay(nextPaymentDateStr);
              displayVar = i18n.payment.frequencyDueDate;

              return displayVar;
            }
            else {
              var day = {};
              if (nextday > 13) {
                if (graceDays == 0) {
                  displayVar = i18n.payment.frequencyDueDate;
                }
                else {
                  displayVar = graceDays + ' ' + i18n.payment.daysPastDue;
                }
                return displayVar;
              }
              if (nextday <= 13) {
                if (parseInt(nextday) < 10 && nextday.length > 1) {
                  nextday = nextday.substring(1, nextday.length);
                }
                dayValue = this.getSuffixNextDay(schDate, i18n);
                if (graceDays == 0) {
                  displayVar = i18n.payment.frequencyDueDate + '(' + dayValue + ')';
                }
                else {
                  displayVar = graceDays + ' ' + i18n.payment.daysPastDue + '(' + dayValue + ')';
                }
                return displayVar;
              }
            }
          }
        },
        getSuffixDay : function(nextPaymentDateStr,suffixTh,suffixSt,suffixNd,suffixRd)
        {
            if (nextPaymentDateStr !== undefined && nextPaymentDateStr.length > 10) {

              nextPaymentDateStr = nextPaymentDateStr.substring(0, 10);

              var parts = nextPaymentDateStr.split('-');
              var month =  parseInt(parts[1]) - 1;
              var mydate = new Date(parts[0], month, parts[2]);
              mydate.setDate(mydate.getDate() - 1);
              var nextday = mydate.getDate();

              if (parseInt(nextday) < 10 && nextday.length > 1)  {
                nextday = nextday.substring(1, nextday.length);
              }

              var suffix = suffixTh;

              nextday = parseInt(nextday);

              if (nextday == '1' || nextday == '21') {
                suffix = suffixSt

              }
              else if (nextday == '2' || nextday == '22') {
                suffix = suffixNd;
              }
              else if (nextday == '3' || nextday == '23') {
                suffix = suffixRd;
              }
              nextday = nextday + suffix;

              return nextday;
            }
          },
        returnCalendarDate : function(instantDate)
        {
          console.log("returnCalendarDate:instant date"+instantDate);
          var justDate = instantDate.split("T")[0];
          var parts = justDate.split("-");
          // if its January then include december too.
          console.log("returnCalendarDate:"+parts[0]+"-"+parts[1]+"-"+parts[2]);
          if(parts[1] === 1){
            parts[1] = 12;
            parts[0] = parts[0] -1;
          }
          var date = new Date(parts[0]+"-"+parts[1]+"-"+parts[2]);
          console.log("returnCalendarDate:returned date"+date);
          return date;
        },
        formTheMessage  : function (addressInfo, faxInfo, i18n) {
          var message = null;
          if (addressInfo.name != "") {
            message = i18n.deliveredByEmail +
              i18n.to + " "+addressInfo.name + " " +
              addressInfo.addressLine1;
            if (addressInfo.addressLine2 != "") {
              message = message + " " + addressInfo.addressLine2;
            }
            message = message + " " +addressInfo.cityStateZip;
          }
          if (faxInfo.attention != "") {
            message = i18n.deliveredByFax +
              i18n.to + " "+ faxInfo.faxNumber;
            if(faxInfo.attention != ""){
              message = message + " "+faxInfo.attention;
            }
            if(faxInfo.companyDept != ""){
              message = message + " " + faxInfo.companyDept;
            }
            if(faxInfo.phoneNumber != ""){
              message = message + " " + faxInfo.phoneNumber;
            }
          }
          return message;
        },
        listDocuments: function(requestDocs,i18n){
          var message = i18n.ariaRequestedDocuments +" " + requestDocs.length;
          message = message + "." + i18n.ariaDocumentsAre;
          var i =0; // initializing the variable.
          for(i = 0; i < (requestDocs.length - 1); i++){
            if(i == 0 ){
              message = message + " " + requestDocs[i].name;
            } else {
              message = message + ", " + requestDocs[i].name;
            }
          }
          message = message + i18n.ariaAnd + requestDocs[i].name;
          return message;
        }

      };
      return utilityFunctions;
    }]);
});
