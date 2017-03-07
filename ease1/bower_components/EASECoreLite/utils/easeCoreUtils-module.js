define('EaseProperties',['angular'], function(angular) {
  'use strict';
  angular.module('EaseProperties', []).constant('EaseConstant', {
    baseUrl: '/ease-app-web',
    kBuildVersion: '',
    kBuildVersionPath: '' ? '/ver' : '',
    env: {
      type: 'dev',
      source: '/ease-ui/dist'
    },
    nextButtonImg: '/ease-ui/dist/features/AccountDetail/images/btn-next.svg',
    prevButtonImg: '/ease-ui/dist/features/AccountDetail/images/btn-prev.svg',
    datePickerImg: '/ease-ui/dist/images/date-picker.png',
    cautionImg: '/ease-ui/dist/images/modal-icon-caution.svg',
    kIdleTime: 540, //Timer for user idle duration
    kTimeoutTime: 60, //Timer for the countdown on session timeout modal
    kPrefetchCallTimeout:500, //Timeout set for prefetch call
    keepaliveInterval: 10 * 60,
    moduleName: 'summary',
    kUndefined: 'undefined',
    states: {
      kWelcome: 'welcome',
      kAccountSummary: 'accountSummary',
      kEscid: "escid",
      kAccountDetailTransactions: 'accountDetails.transactions',
      kAccountDetailSettings: 'accountDetails.settings',
      kAccountPreferences: 'customerSettings.settings',
      kCreditCardDeepLink: 'ChooseAccount',
      kCreditCardDeepLinkUrl: '/Card/ChooseAccount',
      kMigrate: 'migrate'
    },
    kInitMessageCacheUrl: 'customer/messages/initMessagesCache',
    kAccountSummaryRetrieveUrl: 'customer/accountsummary',
    kGetMessageUrl: 'customer/messages/retrieveMessage',
    kLogoutUrl: 'customer/logout',
    kGetResponseMessageUrl: 'customer/messages/respondToMessage',
    kProfileAddEmail: 'customer/contact-points/emails',
    kAcctPreferencesUpdateNickName: 'customer/updateNickname',
    kAcctPreferencesRetrievePaymentAccounts: 'customer/retrievePaymentAccounts',
    kUmmMakeTransfer: 'customer/transfer/submitMoneyTransfer',
    kUmmUpdateMoneyTransfer: 'customer/transfer/updateTransferDetails',
    kUmmCancelTransfer: 'customer/transfer/deleteScheduledTransfer',
    kUmmTransferGetAccounts: 'customer/transfer/getAccounts',
    kUmmTransferGetDetails: 'customer/transfer/getTransferDetails',
    kbankDetailsUrl: 'customer/getBankDetails/',
    kSaveExtBankUrl: 'customer/addPaymentAccounts',
    kDeleteExtBankUrl: 'customer/deletePaymentAccounts',
    keepaliveUrl: '/customer/keepalive',
    kGetEmailUrl: 'customer/contact-points/emails',
    kDeleteEmailUrl: 'customer/contact-points/emails/delete',
    kDeletePhoneUrl: 'customer/phone',
    kGetPhoneNumbersUrl: 'customer/phones',
    kPutPhoneNumbersUrl: 'customer/phone',
    kplatformVerificationUrl: 'customer/verify',
    defaultServiceCallTimeout: 1000,
    profileImage: '',
    kTransferAmountUpperBound: "999999.99",
    kTransferAmountLowerBound: "0.01",
    kchangePassword: 'customer/security/password',
    kTransferViewSelection: {
      kOneTimeTransferView: 'one-time',
      kDatePickerView: 'date-picker'
    },
    cookies: {
      kRsaCookie: 'C1_ABC',
      kCoreCache: 'EASE_CORE',
      kBankCache: 'EASE_BANK_CACHE_COOKIE',
      kNavigation: 'C1_TARGET'
    },
    statusCode: {
      k200: '200',
      k403: '403',
      k401: '401'
    },
    serviceStatusMessage: {
      kHardError: 'HARD_ERROR',
      kChallenge: 'CHALLENGE',
      kCollect: 'COLLECT'
    },
    serviceErrorCode: {
      kHardLock: 'HARD_LOCK',
      kFraudLok: 'FRAUD_LOCK',
      kMFAProfileLock: 'MFA_PROFILE_LOCKED'
    },
    mfaStatus: {
      kPass: 'pass',
      kFail: 'fail'
    },
    kFailedCredentialsMessage: 'We didn\'t recognize who you are.  Want to give it another shot?',
    kFailedMFAMessage: 'Please check your answer and try again.',
    kGenericLoginFailureMessage: 'We have some issue logging you in. Please try again later.',
    kInvalidSpecialCharacter: 'Contains an invalid special character.',
    kConsecutiveSpecialCharacter: 'Can\'t contain 2 consecutive special characters.',
    kInvalidLength: 'Must be longer than 3 characters.',
    defaultBtn: 'View Account',
    defaultBtnAction: 'accountdetails',

    asStatus: {
      kPass: 'pass',
      kFail: 'fail'
    },
    kPathSummaryTemplate: '/ease-ui/dist/features/AccountSummary/',
    kPathUMMPaymentemplate: '/ease-ui/dist/features/UMMPayment/',
    kPathTransactiontemplate: '/ease-ui/dist/features/Transfer',
    kPathCroptemplate: '/ease-ui/dist/features/CustomerSettings/html/',
    loading: 'loading',
    deposits: 'DEPOSITS',
    CreditCard: 'CREDIT-CARDS',
    AutoLoan: 'AUTO-LOANS',
    loans: 'LOANS',
    mortgage: 'MORTGAGE',
    urlPrefixerDeposits: 'Bank/getAccountById/',
    urlPrefixerCDDeposits: 'Bank/cds/getAccountById/',
    urlPrefixerCreditCard: 'CreditCard/getAccountById/',
    urlPrefixerTetrisTransaction: 'CreditCard/v2/accounts/',
    urlPrefixerTetrisCCPayment: 'CreditCard/accounts/payments/',
    urlPrefixerAutoLoan: 'AutoLoan/getAccountById/',
    urlPrefixerHomeLoansMortgages: 'HomeLoans/mortgages/getAccountById/',
    urlPrefixerHomeLoansHomeEquity: 'HomeLoans/homeEquity/getAccountById/',
    urlPostFixerTransactions: '/transactions',
    urlPostFixerDetails: '/details',
    urlQueryNext: '&next=',
    urlQueryFilter: '?filter=',
    kBaseSetTransactions: 30,
    kDefaultNumberOfTransactions: 25,
    kPathCardPartial: 'CreditCard/CreditCard.html',
    kPathAutoLoanPartial: 'AutoLoan/AutoLoan.html',
    kPathCheckingPartial: 'checking/checking.html',
    kPathSavingPartial: 'saving/saving.html',
    kPathHomeLoansPartial: 'HomeLoans/HomeLoans.html',
    kPathCDPartial: 'cd/cd.html',
    kPathMoneyMarketPartial: 'mma/mma.html',
    urlPrefixerAutoLoanPayment: 'AutoLoan/paymentInstruction/',
    urlPostfixerAutoLoanPayment: '/createOneTimePayment',

    kPathCreditCardTransactionsPartial: 'html/partials/AccountDetail-Credit-Card-Transactions.html',
    kPathDepositsTransactionPartial: 'html/partials/AccountDetail-Deposit-Transactions.html',
    kPathLoansTransactionsPartial: 'html/partials/AccountDetail-Loans-Transactions.html',
    pathAccountDetailTransactions: '/ease-ui/dist/features/AccountDetail/html/partials/AccountDetail-transactions.html',

    productType: {
      regularSavings: 'Regular Savings',
      threesixtyChecking: '360 Checking',
      passbookMinorSavings: 'Passbook Minor Savings'
    },
    sortConstantKeys: {
      transactionDate: 'transactionDate',
      kTransactionDate: 'dteTransactionDate',
      kMerchantName: 'strMerchantName',
      kMerchantCategory: 'strMerchantCategory',
      kTransactionAmount: 'numTransactionAmount',
      kTransactionBalance: 'numTransactionBalance',
      kDescription: 'transactionDescription'
    },
    descendingSort: {
      posted: true,
      pending: true,
      scheduled: true
    },
    lineOfBusiness: {
      checking: 'DDA',
      checking360: 'DDA360',
      saving: 'SA',
      saving360: 'SA360',
      AutoLoan: 'AL',
      cd: 'CD',
      CreditCard: 'CC',
      moneyMarket: 'MMA',
      HomeLoans: 'MLA',
      HomeLoansHlc: 'HLC',
      HomeLoansHil: 'HIL',
      HomeLoansILA: 'ILA'
    },
    partialFilePath: {
      al: ["/ease-ui/bower_components/AutoLoan/partials/", "AutoLoan.html", "AutoLoan-transactions.html"],
      sa: ["/ease-ui/bower_components/saving-retail/partials/", "saving.html", "saving-transactions.html"],
      sa360: ["/ease-ui/bower_components/saving-360/partials/", "saving-360.html", "saving-360-transactions.html"],
      dda: ["/ease-ui/bower_components/checking-retail/partials/", "checking.html", "checking-transactions.html"],
      dda360: ["/ease-ui/bower_components/checking-360/partials/", "checking-360.html",
        "checking-360-transactions.html"
      ],
      mma: ["/ease-ui/bower_components/mma/partials/", "mma.html", "mma-transactions.html"],
      cd: ["/ease-ui/bower_components/cd/partials/", "cd.html", "cd-transactions.html"],
      hl: ["/ease-ui/bower_components/HomeLoans/partials/", "HomeLoans.html", "HomeLoans-transactions.html"],
      mla: ["/ease-ui/bower_components/HomeLoans/partials/", "HomeLoans.html", "HomeLoans-transactions.html"],
      hil: ["/ease-ui/bower_components/HomeLoans/partials/", "HomeLoans.html", "HomeLoans-transactions.html"],
      hlc: ["/ease-ui/bower_components/HomeLoans/partials/", "HomeLoans.html", "HomeLoans-transactions.html"],
      cc: ["/ease-ui/bower_components/CreditCard/partials/", "CreditCard.html", "CreditCard-transactions.html"]
    },
    customerSettings: {
      kSettings: 'ease.core.profileprefs.accountprefs.label',
      kPersonalInfo: 'ease.core.profileprefs.pagetitle.label',
      kSignOut: 'ease.core.profileprefs.signout.label',
      kAlerts: 'ease.core.profileprefs.messagesalerts.label',
      accountPreference: {
        baseImageLocation: '/ease-ui/dist/features/CustomerSettings/images/',
        deleteICON: '/ease-ui/dist/features/CustomerSettings/images/clearfield.png',
        editICON: '/ease-ui/dist/features/CustomerSettings/images/customerSettingsEdit.png',
        checkICON: '/ease-ui/dist/features/CustomerSettings/images/profileCheckmarkIcon.png',
        addNickName: 'Add Nickname',
        kPermissionNamePayments: 'Payments Only',
        kPermissionNameTransfers: 'Transfers Only',
        kPermissionNamePaymentsTransfers: 'Payments and Transfers Allowed',
        kPaymentsLinked: 'Linked',
        kPaymentsType: 'Type: ',
        kPaymentsDisplay: 'Payment: ',
        nicknameLength: 30
      }
    },
    googleMaps: {
      kMapUrl: 'https://www.google.com/maps/place/',
      urlEnhTransaction: 'https://maps.googleapis.com/maps/api/js?client=gme-capitaloneservices1&v=3'
    },
    pubsub: {
      accountdetailState: 'account details',
      customersettingState: 'customer profile preferences',
      mfaL3State: 'mfa security question',
      fraudlockL3State: 'fraud lock',
      collectquL3State: 'collect mfa security questions'
    },

    kGreetingNameLength: 20,
    kDefaultPdfUrl: '/ease-ui/dist/file/NotFound.pdf',
    kDefaultPdfScale: 1.6,

    easeHeaderOptions: {
      capOneIcon: '/ease-ui/dist/features/AccountSummary/images/capital_one_logo.svg',
      sneakPeekIcon: '/ease-ui/dist/features/Login/images/sneak-peek.svg',
      profileOptionsPartial: '/ease-ui/dist/features/SummaryHeader/html/partials/authenticatedProfile.html',
      backButtonPartial: '/ease-ui/dist/features/SummaryHeader/html/partials/backButton.html',
      navAuthenticated: '/ease-ui/dist/features/SummaryHeader/html/partials/authenticatedNav.html'
    },
    features: {
      transferFeatureName: 'ease.core.transferbutton.v1',
      transferScheduledCancelFeatureName: 'ease.core.transferscheduledcancel.v1',
      transferScheduledEditFeatureName: 'ease.core.transferschedulededit.v1',
      transferScheduledFeature: 'ease.core.transferscheduled.v1',
      coafSingleAccountTransactionViewFeature: 'ease.coaf.singleaccounttrxview.v1',
      globalMessageFeatureName: 'ease.core.globalmessaging.v1',
      addExternalAccountFeature: 'ease.core.managePaymentService.v1',
      nickNameFeature: 'ease.core.accountnickname.v1',
      usabillaFeature: 'ease.core.usabilla.v1',
      manageExternalAccountFeature: 'ease.core.manageexternalaccounts.v1',
      enableRetailNavigation: 'ease.core.enableretailnavigation.v1',
      manageExternalDelAccountFeature: 'ease.core.manageexternaldelaccounts.v1',
      enableMudFlap: 'ease.core.mudflap.v1',
      isRetailToggleRestricted: 'ease.retail.accounttiles.v1',
      enableEscapeHatch: 'ease.core.escapehatch.v1',
      enableCofiTileNavigation: 'ease.core.cofi.v1',
      enableCofiTileDisplay: 'ease.cofi.accounttiles.display.v1',
      cofiCTAButton: 'ease.core.cofi.ctabutton.v1',
      enableHELOCScheduled: 'ease.core.helocscheduled.v1',
      showCICLinkFeature: 'ease.core.personalinfo.CICLink.v1',
      enableShowEmail: 'ease.core.showEmail.v1',
      enableAddEmail: 'ease.core.addEmail.v1',
      enableEditEmail: 'ease.core.editEmail.v1',
      enableChangePassword: 'ease.core.changepassword.v1',
      enableShowPhone: 'ease.core.showPhone.v1',
      enableEditPhone:'ease.core.editPhone.v1',
      enableEditPassword: 'ease.core.editpassword.v1',
      enableDisplayAlerts: 'ease.core.displayalerts.v1',
      enableDisplayCardAlerts: 'ease.card.displayalerts.v1',
      enableEditAlerts: 'ease.core.editalerts.v1',
      enableEditCardAlerts: 'ease.card.editalerts.v1',
      enableEditBankAddress: 'ease.core.editbankaddress.v1',
      enableEditCardAddress: 'ease.core.editcardaddress.v1',
      enableEditGreetingName: 'ease.core.editgreeeting.v1',
      enableMigrateFeature: 'ease.core.displaymigrate.v1',
      enablePhoneOnMigrate: 'ease.core.migrate.displayphone.v1',
      enableEmailOnMigrate: 'ease.core.migrate.displayemail.v1',
      enableEditPicture: 'ease.core.editpicture.v1',
      groups: {
        security: 'EASE.security',
        alerts: 'EASE.alerts',
        migrate: 'EASE.migrate'
      }
    },
    stateNames: {
      transferScheduleUnavailable: 'transferScheduleUnavailable'
    },
    feedbackForm: {
      typeField: 'What would you like to share with us?',
      emailField: 'Enter an email so we may contact you.',
      descriptionField: 'Share your thoughts with us.',
      ratingField: 'Please rate your overall experience.'
    },
    isEnableActionButton: true,
    defaultErrorMessage: {
      msgHeader: 'Oops, we’ve hit a snag.',
      msgBody: 'Looks like we can’t display all of your accounts right now, ' +
        'but we’re working on it! Try again in a bit.',
      modalClass: '',
      modalType: 'errorModal'
    },
    deniedErrorMessage: {
      msgHeader: 'Access Denied',
      msgBody: ''
    },
    prefetch: ['CreditCard'],
    prefetchCreditCard: 'CreditCard',
    prefetchBank: 'Bank',
    prefetchAutoLoan: 'AutoLoan',
    prefetchHomeLoans: 'HomeLoans',
    easeURLs: {
      accountSummary: '/accountSummary',
      transfer: '/:referenceId/Transfer',
      editTransfer: '/:moneyTransferID/TransferEdit',
      cancelTransfer: '/:moneyTransferID/TransferCancel',
      cancelConfirmTransfer: '/:moneyTransferID/ConfirmTransferCancel',
      payment: '/{accountReferenceId}/Pay',
      addExtPayAcct: '/AddAccount',
      feedback: '/feedback'
    },
    kTransferProductGroup: {
      C1Direct_360: 'capital one direct (360)',
      C1Direct_360_Ext: 'capital one direct (360) external',
      C1Retail: 'capital one retail',
      C1Reatil_Ext: 'capital one retail external',
      C1HomeEquityCredit: 'capital one home equity line of credit',
      C1Investing: 'capital one investing'
    },
    kDefaultLengthForDropDownItem: 20,
    transferArriveOnDateLogic: {
      'retail': {
        'external': {
          'cutOffHour': 19,
          'before': 3,
          'after': 4
        }
      },
      '360': {
        'external': {
          'cutOffHour': 24,
          'before': 2
        }
      },
      'external': {
        'retail': {
          'cutOffHour': 19,
          'before': 1,
          'after': 2
        },
        '360': {
          'cutOffHour': 17,
          'before': 1,
          'after': 2
        }
      }
    }
  }).provider('EaseConstantFactory', ['EaseConstant', function(EaseConstant) {
    'use strict';
    //TODO need to clean up most of these because half of these aren't even being used
    this.accountSummary_url = EaseConstant.baseUrl + '/customers';
    //this.accountDetail_alt_url = EaseConstant.baseUrl + '/credit-cards/accounts/1234';
    this.billPayUrl_start = EaseConstant.baseUrl + '/api/billPay/start';
    this.billPayAccounts = EaseConstant.baseUrl + '/billPay/accounts';
    this.billPay_confirm = EaseConstant.baseUrl + '/api/billPay/confirm';
    this.login_url = EaseConstant.baseUrl + '/customers';
    this.loginAuthenticate_url = EaseConstant.baseUrl + '/customers/answers';
    this.backEndServerURL = EaseConstant.baseUrl + '/api/login/authenticate';
    //this.recentTransactions_url = EaseConstant.baseUrl + '/credit-cards/accounts/1234/transactions';
    //this.accountdetail_url = EaseConstant.baseUrl + '/credit-cards/accounts/1234';
    this.$get = function() {
      return {
        storageName: function() {
          return EaseConstant.moduleName.concat('_').concat(EaseConstant.userID).concat('_').
          concat(EaseConstant.acctNum);
        },
        baseUrl: function() {
          return EaseConstant.baseUrl;
        }
      };
    };
  }]);
});

define('optional', [], {
  load: function (moduleName, parentRequire, onload, config) {

    var onLoadSuccess = function(moduleInstance) {
        // Module successfully loaded, call the onload callback so that
        // requirejs can work its internal magic.
        onload(moduleInstance);
      },
      onLoadFailure = function(err) {
        // optional module failed to load.
        var failedId = err.requireModules && err.requireModules[0];
        console.log("Could not load optional module: " + failedId);

        // Undefine the module to cleanup internal stuff in requireJS
        requirejs.undef(failedId);

        // Now define the module instance as a simple empty object
        // (NOTE: you can return any other value you want here)
        define(failedId, [], function(){return {};});

        // Now require the module make sure that requireJS thinks
        // that is it loaded. Since we've just defined it, requirejs
        // will not attempt to download any more script files and
        // will just call the onLoadSuccess handler immediately
        parentRequire([failedId], onLoadSuccess);
      };

    parentRequire([moduleName], onLoadSuccess, onLoadFailure);
  }
});

/*!
 * numeral.js
 * version : 1.5.3
 * author : Adam Draper
 * license : MIT
 * http://adamwdraper.github.com/Numeral-js/
 */

(function () {

    /************************************
        Constants
    ************************************/

    var numeral,
        VERSION = '1.5.3',
        // internal storage for language config files
        languages = {},
        currentLanguage = 'en',
        zeroFormat = null,
        defaultFormat = '0,0',
        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module.exports);


    /************************************
        Constructors
    ************************************/


    // Numeral prototype object
    function Numeral (number) {
        this._value = number;
    }

    /**
     * Implementation of toFixed() that treats floats more like decimals
     *
     * Fixes binary rounding issues (eg. (0.615).toFixed(2) === '0.61') that present
     * problems for accounting- and finance-related software.
     */
    function toFixed (value, precision, roundingFunction, optionals) {
        var power = Math.pow(10, precision),
            optionalsRegExp,
            output;

        //roundingFunction = (roundingFunction !== undefined ? roundingFunction : Math.round);
        // Multiply up by precision, round accurately, then divide and use native toFixed():
        output = (roundingFunction(value * power) / power).toFixed(precision);

        if (optionals) {
            optionalsRegExp = new RegExp('0{1,' + optionals + '}$');
            output = output.replace(optionalsRegExp, '');
        }

        return output;
    }

    /************************************
        Formatting
    ************************************/

    // determine what type of formatting we need to do
    function formatNumeral (n, format, roundingFunction) {
        var output;

        // figure out what kind of format we are dealing with
        if (format.indexOf('$') > -1) { // currency!!!!!
            output = formatCurrency(n, format, roundingFunction);
        } else if (format.indexOf('%') > -1) { // percentage
            output = formatPercentage(n, format, roundingFunction);
        } else if (format.indexOf(':') > -1) { // time
            output = formatTime(n, format);
        } else { // plain ol' numbers or bytes
            output = formatNumber(n._value, format, roundingFunction);
        }

        // return string
        return output;
    }

    // revert to number
    function unformatNumeral (n, string) {
        var stringOriginal = string,
            thousandRegExp,
            millionRegExp,
            billionRegExp,
            trillionRegExp,
            suffixes = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            bytesMultiplier = false,
            power;

        if (string.indexOf(':') > -1) {
            n._value = unformatTime(string);
        } else {
            if (string === zeroFormat) {
                n._value = 0;
            } else {
                if (languages[currentLanguage].delimiters.decimal !== '.') {
                    string = string.replace(/\./g,'').replace(languages[currentLanguage].delimiters.decimal, '.');
                }

                // see if abbreviations are there so that we can multiply to the correct number
                thousandRegExp = new RegExp('[^a-zA-Z]' + languages[currentLanguage].abbreviations.thousand + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$');
                millionRegExp = new RegExp('[^a-zA-Z]' + languages[currentLanguage].abbreviations.million + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$');
                billionRegExp = new RegExp('[^a-zA-Z]' + languages[currentLanguage].abbreviations.billion + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$');
                trillionRegExp = new RegExp('[^a-zA-Z]' + languages[currentLanguage].abbreviations.trillion + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$');

                // see if bytes are there so that we can multiply to the correct number
                for (power = 0; power <= suffixes.length; power++) {
                    bytesMultiplier = (string.indexOf(suffixes[power]) > -1) ? Math.pow(1024, power + 1) : false;

                    if (bytesMultiplier) {
                        break;
                    }
                }

                // do some math to create our number
                n._value = ((bytesMultiplier) ? bytesMultiplier : 1) * ((stringOriginal.match(thousandRegExp)) ? Math.pow(10, 3) : 1) * ((stringOriginal.match(millionRegExp)) ? Math.pow(10, 6) : 1) * ((stringOriginal.match(billionRegExp)) ? Math.pow(10, 9) : 1) * ((stringOriginal.match(trillionRegExp)) ? Math.pow(10, 12) : 1) * ((string.indexOf('%') > -1) ? 0.01 : 1) * (((string.split('-').length + Math.min(string.split('(').length-1, string.split(')').length-1)) % 2)? 1: -1) * Number(string.replace(/[^0-9\.]+/g, ''));

                // round if we are talking about bytes
                n._value = (bytesMultiplier) ? Math.ceil(n._value) : n._value;
            }
        }
        return n._value;
    }

    function formatCurrency (n, format, roundingFunction) {
        var symbolIndex = format.indexOf('$'),
            openParenIndex = format.indexOf('('),
            minusSignIndex = format.indexOf('-'),
            space = '',
            spliceIndex,
            output;

        // check for space before or after currency
        if (format.indexOf(' $') > -1) {
            space = ' ';
            format = format.replace(' $', '');
        } else if (format.indexOf('$ ') > -1) {
            space = ' ';
            format = format.replace('$ ', '');
        } else {
            format = format.replace('$', '');
        }

        // format the number
        output = formatNumber(n._value, format, roundingFunction);

        // position the symbol
        if (symbolIndex <= 1) {
            if (output.indexOf('(') > -1 || output.indexOf('-') > -1) {
                output = output.split('');
                spliceIndex = 1;
                if (symbolIndex < openParenIndex || symbolIndex < minusSignIndex){
                    // the symbol appears before the "(" or "-"
                    spliceIndex = 0;
                }
                output.splice(spliceIndex, 0, languages[currentLanguage].currency.symbol + space);
                output = output.join('');
            } else {
                output = languages[currentLanguage].currency.symbol + space + output;
            }
        } else {
            if (output.indexOf(')') > -1) {
                output = output.split('');
                output.splice(-1, 0, space + languages[currentLanguage].currency.symbol);
                output = output.join('');
            } else {
                output = output + space + languages[currentLanguage].currency.symbol;
            }
        }

        return output;
    }

    function formatPercentage (n, format, roundingFunction) {
        var space = '',
            output,
            value = n._value * 100;

        // check for space before %
        if (format.indexOf(' %') > -1) {
            space = ' ';
            format = format.replace(' %', '');
        } else {
            format = format.replace('%', '');
        }

        output = formatNumber(value, format, roundingFunction);

        if (output.indexOf(')') > -1 ) {
            output = output.split('');
            output.splice(-1, 0, space + '%');
            output = output.join('');
        } else {
            output = output + space + '%';
        }

        return output;
    }

    function formatTime (n) {
        var hours = Math.floor(n._value/60/60),
            minutes = Math.floor((n._value - (hours * 60 * 60))/60),
            seconds = Math.round(n._value - (hours * 60 * 60) - (minutes * 60));
        return hours + ':' + ((minutes < 10) ? '0' + minutes : minutes) + ':' + ((seconds < 10) ? '0' + seconds : seconds);
    }

    function unformatTime (string) {
        var timeArray = string.split(':'),
            seconds = 0;
        // turn hours and minutes into seconds and add them all up
        if (timeArray.length === 3) {
            // hours
            seconds = seconds + (Number(timeArray[0]) * 60 * 60);
            // minutes
            seconds = seconds + (Number(timeArray[1]) * 60);
            // seconds
            seconds = seconds + Number(timeArray[2]);
        } else if (timeArray.length === 2) {
            // minutes
            seconds = seconds + (Number(timeArray[0]) * 60);
            // seconds
            seconds = seconds + Number(timeArray[1]);
        }
        return Number(seconds);
    }

    function formatNumber (value, format, roundingFunction) {
        var negP = false,
            signed = false,
            optDec = false,
            abbr = '',
            abbrK = false, // force abbreviation to thousands
            abbrM = false, // force abbreviation to millions
            abbrB = false, // force abbreviation to billions
            abbrT = false, // force abbreviation to trillions
            abbrForce = false, // force abbreviation
            bytes = '',
            ord = '',
            abs = Math.abs(value),
            suffixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            min,
            max,
            power,
            w,
            precision,
            thousands,
            d = '',
            neg = false;

        // check if number is zero and a custom zero format has been set
        if (value === 0 && zeroFormat !== null) {
            return zeroFormat;
        } else {
            // see if we should use parentheses for negative number or if we should prefix with a sign
            // if both are present we default to parentheses
            if (format.indexOf('(') > -1) {
                negP = true;
                format = format.slice(1, -1);
            } else if (format.indexOf('+') > -1) {
                signed = true;
                format = format.replace(/\+/g, '');
            }

            // see if abbreviation is wanted
            if (format.indexOf('a') > -1) {
                // check if abbreviation is specified
                abbrK = format.indexOf('aK') >= 0;
                abbrM = format.indexOf('aM') >= 0;
                abbrB = format.indexOf('aB') >= 0;
                abbrT = format.indexOf('aT') >= 0;
                abbrForce = abbrK || abbrM || abbrB || abbrT;

                // check for space before abbreviation
                if (format.indexOf(' a') > -1) {
                    abbr = ' ';
                    format = format.replace(' a', '');
                } else {
                    format = format.replace('a', '');
                }

                if (abs >= Math.pow(10, 12) && !abbrForce || abbrT) {
                    // trillion
                    abbr = abbr + languages[currentLanguage].abbreviations.trillion;
                    value = value / Math.pow(10, 12);
                } else if (abs < Math.pow(10, 12) && abs >= Math.pow(10, 9) && !abbrForce || abbrB) {
                    // billion
                    abbr = abbr + languages[currentLanguage].abbreviations.billion;
                    value = value / Math.pow(10, 9);
                } else if (abs < Math.pow(10, 9) && abs >= Math.pow(10, 6) && !abbrForce || abbrM) {
                    // million
                    abbr = abbr + languages[currentLanguage].abbreviations.million;
                    value = value / Math.pow(10, 6);
                } else if (abs < Math.pow(10, 6) && abs >= Math.pow(10, 3) && !abbrForce || abbrK) {
                    // thousand
                    abbr = abbr + languages[currentLanguage].abbreviations.thousand;
                    value = value / Math.pow(10, 3);
                }
            }

            // see if we are formatting bytes
            if (format.indexOf('b') > -1) {
                // check for space before
                if (format.indexOf(' b') > -1) {
                    bytes = ' ';
                    format = format.replace(' b', '');
                } else {
                    format = format.replace('b', '');
                }

                for (power = 0; power <= suffixes.length; power++) {
                    min = Math.pow(1024, power);
                    max = Math.pow(1024, power+1);

                    if (value >= min && value < max) {
                        bytes = bytes + suffixes[power];
                        if (min > 0) {
                            value = value / min;
                        }
                        break;
                    }
                }
            }

            // see if ordinal is wanted
            if (format.indexOf('o') > -1) {
                // check for space before
                if (format.indexOf(' o') > -1) {
                    ord = ' ';
                    format = format.replace(' o', '');
                } else {
                    format = format.replace('o', '');
                }

                ord = ord + languages[currentLanguage].ordinal(value);
            }

            if (format.indexOf('[.]') > -1) {
                optDec = true;
                format = format.replace('[.]', '.');
            }

            w = value.toString().split('.')[0];
            precision = format.split('.')[1];
            thousands = format.indexOf(',');

            if (precision) {
                if (precision.indexOf('[') > -1) {
                    precision = precision.replace(']', '');
                    precision = precision.split('[');
                    d = toFixed(value, (precision[0].length + precision[1].length), roundingFunction, precision[1].length);
                } else {
                    d = toFixed(value, precision.length, roundingFunction);
                }

                w = d.split('.')[0];

                if (d.split('.')[1].length) {
                    d = languages[currentLanguage].delimiters.decimal + d.split('.')[1];
                } else {
                    d = '';
                }

                if (optDec && Number(d.slice(1)) === 0) {
                    d = '';
                }
            } else {
                w = toFixed(value, null, roundingFunction);
            }

            // format number
            if (w.indexOf('-') > -1) {
                w = w.slice(1);
                neg = true;
            }

            if (thousands > -1) {
                w = w.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + languages[currentLanguage].delimiters.thousands);
            }

            if (format.indexOf('.') === 0) {
                w = '';
            }

            return ((negP && neg) ? '(' : '') + ((!negP && neg) ? '-' : '') + ((!neg && signed) ? '+' : '') + w + d + ((ord) ? ord : '') + ((abbr) ? abbr : '') + ((bytes) ? bytes : '') + ((negP && neg) ? ')' : '');
        }
    }

    /************************************
        Top Level Functions
    ************************************/

    numeral = function (input) {
        if (numeral.isNumeral(input)) {
            input = input.value();
        } else if (input === 0 || typeof input === 'undefined') {
            input = 0;
        } else if (!Number(input)) {
            input = numeral.fn.unformat(input);
        }

        return new Numeral(Number(input));
    };

    // version number
    numeral.version = VERSION;

    // compare numeral object
    numeral.isNumeral = function (obj) {
        return obj instanceof Numeral;
    };

    // This function will load languages and then set the global language.  If
    // no arguments are passed in, it will simply return the current global
    // language key.
    numeral.language = function (key, values) {
        if (!key) {
            return currentLanguage;
        }

        if (key && !values) {
            if(!languages[key]) {
                throw new Error('Unknown language : ' + key);
            }
            currentLanguage = key;
        }

        if (values || !languages[key]) {
            loadLanguage(key, values);
        }

        return numeral;
    };

    // This function provides access to the loaded language data.  If
    // no arguments are passed in, it will simply return the current
    // global language object.
    numeral.languageData = function (key) {
        if (!key) {
            return languages[currentLanguage];
        }

        if (!languages[key]) {
            throw new Error('Unknown language : ' + key);
        }

        return languages[key];
    };

    numeral.language('en', {
        delimiters: {
            thousands: ',',
            decimal: '.'
        },
        abbreviations: {
            thousand: 'k',
            million: 'm',
            billion: 'b',
            trillion: 't'
        },
        ordinal: function (number) {
            var b = number % 10;
            return (~~ (number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
        },
        currency: {
            symbol: '$'
        }
    });

    numeral.zeroFormat = function (format) {
        zeroFormat = typeof(format) === 'string' ? format : null;
    };

    numeral.defaultFormat = function (format) {
        defaultFormat = typeof(format) === 'string' ? format : '0.0';
    };

    /************************************
        Helpers
    ************************************/

    function loadLanguage(key, values) {
        languages[key] = values;
    }

    /************************************
        Floating-point helpers
    ************************************/

    // The floating-point helper functions and implementation
    // borrows heavily from sinful.js: http://guipn.github.io/sinful.js/

    /**
     * Array.prototype.reduce for browsers that don't support it
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce#Compatibility
     */
    if ('function' !== typeof Array.prototype.reduce) {
        Array.prototype.reduce = function (callback, opt_initialValue) {
            'use strict';

            if (null === this || 'undefined' === typeof this) {
                // At the moment all modern browsers, that support strict mode, have
                // native implementation of Array.prototype.reduce. For instance, IE8
                // does not support strict mode, so this check is actually useless.
                throw new TypeError('Array.prototype.reduce called on null or undefined');
            }

            if ('function' !== typeof callback) {
                throw new TypeError(callback + ' is not a function');
            }

            var index,
                value,
                length = this.length >>> 0,
                isValueSet = false;

            if (1 < arguments.length) {
                value = opt_initialValue;
                isValueSet = true;
            }

            for (index = 0; length > index; ++index) {
                if (this.hasOwnProperty(index)) {
                    if (isValueSet) {
                        value = callback(value, this[index], index, this);
                    } else {
                        value = this[index];
                        isValueSet = true;
                    }
                }
            }

            if (!isValueSet) {
                throw new TypeError('Reduce of empty array with no initial value');
            }

            return value;
        };
    }


    /**
     * Computes the multiplier necessary to make x >= 1,
     * effectively eliminating miscalculations caused by
     * finite precision.
     */
    function multiplier(x) {
        var parts = x.toString().split('.');
        if (parts.length < 2) {
            return 1;
        }
        return Math.pow(10, parts[1].length);
    }

    /**
     * Given a variable number of arguments, returns the maximum
     * multiplier that must be used to normalize an operation involving
     * all of them.
     */
    function correctionFactor() {
        var args = Array.prototype.slice.call(arguments);
        return args.reduce(function (prev, next) {
            var mp = multiplier(prev),
                mn = multiplier(next);
        return mp > mn ? mp : mn;
        }, -Infinity);
    }


    /************************************
        Numeral Prototype
    ************************************/


    numeral.fn = Numeral.prototype = {

        clone : function () {
            return numeral(this);
        },

        format : function (inputString, roundingFunction) {
            return formatNumeral(this,
                  inputString ? inputString : defaultFormat,
                  (roundingFunction !== undefined) ? roundingFunction : Math.round
              );
        },

        unformat : function (inputString) {
            if (Object.prototype.toString.call(inputString) === '[object Number]') {
                return inputString;
            }
            return unformatNumeral(this, inputString ? inputString : defaultFormat);
        },

        value : function () {
            return this._value;
        },

        valueOf : function () {
            return this._value;
        },

        set : function (value) {
            this._value = Number(value);
            return this;
        },

        add : function (value) {
            var corrFactor = correctionFactor.call(null, this._value, value);
            function cback(accum, curr, currI, O) {
                return accum + corrFactor * curr;
            }
            this._value = [this._value, value].reduce(cback, 0) / corrFactor;
            return this;
        },

        subtract : function (value) {
            var corrFactor = correctionFactor.call(null, this._value, value);
            function cback(accum, curr, currI, O) {
                return accum - corrFactor * curr;
            }
            this._value = [value].reduce(cback, this._value * corrFactor) / corrFactor;
            return this;
        },

        multiply : function (value) {
            function cback(accum, curr, currI, O) {
                var corrFactor = correctionFactor(accum, curr);
                return (accum * corrFactor) * (curr * corrFactor) /
                    (corrFactor * corrFactor);
            }
            this._value = [this._value, value].reduce(cback, 1);
            return this;
        },

        divide : function (value) {
            function cback(accum, curr, currI, O) {
                var corrFactor = correctionFactor(accum, curr);
                return (accum * corrFactor) / (curr * corrFactor);
            }
            this._value = [this._value, value].reduce(cback);
            return this;
        },

        difference : function (value) {
            return Math.abs(numeral(this._value).subtract(value).value());
        }

    };

    /************************************
        Exposing Numeral
    ************************************/

    // CommonJS module is defined
    if (hasModule) {
        module.exports = numeral;
    }

    /*global ender:false */
    if (typeof ender === 'undefined') {
        // here, `this` means `window` in the browser, or `global` on the server
        // add `numeral` as a global object via a string identifier,
        // for Closure Compiler 'advanced' mode
        this['numeral'] = numeral;
    }

    /*global define:false */
    if (typeof define === 'function' && define.amd) {
        define('numeral',[], function () {
            return numeral;
        });
    }
}).call(this);

define('ContentProperties',['angular'], function(angular) {
  'use strict';
  angular.module('ContentProperties', []).constant('ContentConstant', {
    urlContentOne: 'customer/content',
    loginPage: 'login',

    //Below entries are required for making the key for the content file(returned from OL)
    kLanguagePreferences: 'en_US',
    kSnag: 'snag',
    kCoreTransfer: 'core_transfer_',
    kTransfer: 'transfer',
    kCoreSession: 'core_session_',
    kAccountPreferences: 'acctpreferences',
    kCoreAccountPreferences: 'core_settings_account_',
    kCoreGlobalHeader: "core_global_header_",
    kCoreGlobalDropdown: "core_profiledropdown_",
    kCoreAccountSummary: "core_acctsummary_",
    kCoreMigrationAcctsetup: "core_migrationacctsetup_",
    kCoreAlerts: "core_alertsprefs_",
    k360Savings: "360-savings",
    k360Checking: "360-checking",
    kAlertIconYellow: "alert_icon_yellow",
    kHeader: "header",
    kAddExternalAccount: "addexternalaccount",
    kRemoveExternalAccount: "removeexternalaccount",
    kCoreAddExternalAccounts: "core_addaccount_",
    kAbaNumberDetails: "abaNumberDetails",
    kGlobalFooter: "globalfooter",
    kCoreGlobalFooter: "core_global_footer_",
    kCoreGlobalFooterHouseImg: "house",
    kCoreGlobalFooterNortonImg: "norton",
    kCoreGlobalFooterFdicImg: "fdic",
    kCoreGlobalFooterArticle: "core_global_footer_disclaimer",
    kCoreSecurityPrefs: "core_securityprefs_",
    kAccountSummary: "accountsummary",
    kCoaf: "bg_coaf_sml",
    k360: "bg_360_sml",
    kVenture: "bg_venture_sml",
    kHomeLoan: "bg_homeloan",
    kBank: "bg_bank_sml",
    kCommonSnag: "common_snag_",
    kSnagUrl: "snag",
    kProfileprefs: 'profileprefs',
    kCofi: "bg_cofi_sml",
    kSearchIcon: 'Icon_Search',
    kClearSearchIcon: 'Icon_SearchClear',
    kNoResultsIcon: 'Icon_NoResults',
    kIconFilter: 'Icon_Filter',
    kIconExternalLink: 'Icon_ExternalLInk',
    kMapMarkerAtmRetail: 'MapMarker_ATM-Retail',
    kMapMarkerAtmRetailLarge: 'MapMarker_ATM-Retail_Large',
    kMapMarkerBranch: 'MapMarker_Branch',
    kMapMarkerBranchLarge: 'MapMarker_Branch_Large',
    kMapMarker360: 'MapMarker_ATM-360',
    kMapMarker360Large: 'MapMarker_ATM-360_Large',
    kMapMarkerCashBack: 'MapMarker_CB.png',
    kMapMarkerCashBackLarge: 'MapMarker_CB_Large.png',
    k360ATMIcon: 'Icon_360ATM',
    kBankATMIcon: 'Icon_BankATM',
    kCashBackIcon: 'Icon_CashBack',
    kBranchIcon: 'Icon_Branch',
    kRemoveAccountMsg: 'removeaccountmsg',
    kAlertPrefs: 'alertprefs',
    kMigrationAcctsetup: 'migrationacctsetup',
    kcoreAccountSettingsCIC: {
      'ease.core.settings.account.cic.header.label': 'Credentials',
      'ease.core.settings.account.cic.body.label': 'Looks like you have multiple usernames.',
      'ease.core.settings.account.cic.linktext.label': 'Would you like to combine them?',
      'ease.core.settings.account.cic.link.label': 'https://ems.capitalone.com/cic-ui'
    },
    kSecurityPrefs : 'securityprefs',
    kCoreGlobalHeaderData: {
        "ease.core.global.header.sneakpeek.aria.label": "Sneak Peek",
        "ease.core.global.header.aria.label": "Header",
        "ease.core.global.header.capone.logo.link": "http\://www.capitalone.com/",
        "ease.core.global.header.back.aria.label": "Click Here to go back",
        "ease.core.global.header.sneakpeek.image.aria.label": "Click the sneak peek icon to see the sneak peek page",
        "ease.core.global.header.sneakpeek.label": "Sneak Peek",
        "ease.core.global.header.capone.logo.aria.label": "Capital One Home button. Click to go to the home page.",
        "ease.core.global.header.sneakpeak.link": "http\://www.capitalone.com/sneakpeek/",
        "ease.core.global.header.back.label": "Back",
        "ease.core.global.header.capone.logo.label": "Capital One",
        "ease.core.global.header.browsertab.label": "Capital One"
    },
    kCoreGlobalHeaderPageTitle: 'ease.core.global.header.browsertab.label',
    kSnagModalHeader: 'core.common.snag.modal.header',
    kSnagFeatureOffLabel:'core.common.snag.modal.featureoff.label',
    kcommon_snag_en_US: {
      'common_snag_en_US': {
        'core.common.snag.featureoff.button.label': 'Okay',
        'core.common.snag.modal.featureoff.label': 'This feature isn’t available right now,'
        + 'but we’re working on it. Try again in a bit.',
        'core.common.snag.featureoff.short.label': 'This feature is currently unavailable.'
        + 'Try again in a bit.',
        'core.common.snag.modal.cantsave1.label': 'Something went wrong and we can’t save your',
        'core.common.snag.modal.header': 'We’ve hit a snag.',
        'core.common.snag.modal.needtofix.label': 'Looks like we need to fix something, ' +
        'so we’re working on it. Try again in a bit.',
        'core.common.snag.transactions.label': 'We can’t display your transactions right now, but ' +
        'we’re working on it. Please try again in a bit.',
        'core.common.snag.modal.cantsave2.label':' Give it another try in a moment.'
    }},
    kcore_migrationacctsetup_en_US: {
      'core_migrationacctsetup_en_US': {
        'ease.core.migrationacctsetup.migration.header.label':'Welcome to our new site!',
        'ease.core.migrationacctsetup.migration.instructions.label':"Let's verify your email and phone numbers",
        'ease.core.migrationacctsetup.migration.email.label':'Email',
        'ease.core.migrationacctsetup.migration.mobile.label':'Mobile',
        'ease.core.migrationacctsetup.migration.home.label':'Home',
        'ease.core.migrationacctsetup.migration.work.label':'Work',
        'ease.core.migrationacctsetup.migration.select.label':'Select Number',
        'ease.core.migrationacctsetup.migration.TCPA.on.label':'You can call or text me through automated means',
        'ease.core.migrationacctsetup.migration.TCPA.off.label':'You can only contact me through non-automated means',
        'ease.core.migrationacctsetup.migration.changelink.label':'Change'
    }}
  });
});

define('errorDetailsService',['angular'], function(angular) {
  'use strict';

  function EaseException() {
    this.attributes = {};
    var attr = {};
    var err = new Error();
    var that = this;

    if (arguments[0]) {
      this.attributes = arguments[0];
      attr = this.attributes;
      for (var index in attr) {
        if (typeof attr[index] !== 'undefined') {
          that[index] = attr[index];
        }
      }
    }

    if (err.stack) {
      // remove one stack level:
      if (typeof(Components) !== 'undefined') {
        // Mozilla:
        this.stack = err.stack.substring(err.stack.indexOf('\n') + 1);
      } else if (typeof(chrome) !== 'undefined' || typeof(process) !== 'undefined') {
        // Google Chrome/Node.js:
        this.stack = err.stack.replace(/\n[^\n]*/, '');
      } else {
        this.stack = err.stack;
      }
    }

    if (typeof this.fileName === 'undefined') {
      this.fileName = err.fileName;
    }

    if (typeof this.lineNumber === 'undefined') {
      this.lineNumber = err.lineNumber;
    }

    if (typeof this.message === 'undefined') {
      this.message = err.message;
    }
  }

  EaseException.prototype = new Error() || Object.create(Error.prototype);
  EaseException.prototype.constructor = EaseException;
  EaseException.prototype.name = 'EaseException';
  EaseException.prototype.toString = function() {
    return 'Error in function ' + this.function +' at module ' + this.module + ' : ' + this.message;
  };

  var easeExceptionsModule = angular.module('EaseExceptionsModule', [])
    .factory('easeExceptionsService', ['$rootScope', '$log', '$document', '$injector',
      function($rootScope, $log, $document, $injector) {
        return {
          createEaseException: function(opt) {
            var myException = new EaseException(opt);
            return myException
          },
          stopSpinner: function(){
            var EaseConstant = $injector.get('EaseConstant');
            var spinners=['loading','formatLoading','loadingModal'];
            spinners.forEach(function(spin){
              angular.element(document.querySelector('.' + spin)).removeClass(spin);
            })
            EaseConstant.isEnableActionButton = true;
          },
          displayErrorHadler : function(errorMsgheader, errorMsgbody){
            var EASEUtilsFactory = $injector.get('EASEUtilsFactory');
            $rootScope.$broadcast('error',
              {
                msgHeader : errorMsgheader ? errorMsgheader : EASEUtilsFactory.getAccSummaryI18().errorSnag.snagHeader,
                msgBody : errorMsgbody ? errorMsgbody : EASEUtilsFactory.getAccSummaryI18().errorSnag.snagBody
              });
          }
        };
      }
    ]).config(['$provide',
      function($provide) {
        $provide.decorator('$exceptionHandler', ['$delegate', '$injector',
          function($delegate, $injector) {
            return function(exception, cause) {
              var service = $injector.get('easeExceptionsService'),
                state = $injector.get('$state');
              console.log(exception, cause);
              service.stopSpinner();
              // TODO: Currently code base is not at a place to turn on aggressive exception handling
              // state.go('accountSummary.error', {}, {reload: true});
            };
          }
        ]);
      }
    ]);

    return easeExceptionsModule;
});

define('easeInterceptor',['angular', 'errorDetailsService'], function(angular) {
  'use strict';

  var easeExceptionsModule = angular.module('EaseExceptionsModule');

  easeExceptionsModule.factory('easeHttpInterceptor', ['$q', 'easeExceptionsService',
    '$rootScope', '$injector', 'EaseConstant', '$window',
    function($q, easeExceptionsService, $rootScope, $injector, easeConstant, $window) {
      var defaultErrorMessage = easeConstant.defaultErrorMessage,
        deniedErrorMessage = easeConstant.deniedErrorMessage, eventToConsume;

      var broadCastEvent = function(messageObj) {
        var message = messageObj || defaultErrorMessage;
        var eventName =  eventToConsume || 'error';
        $rootScope.$broadcast(eventName, message);
        //after the custome event was broadcasted, the eventToConsume is reset to null
        // making the snag modal error window as default for http errors.
        if (eventName === eventToConsume) {
          eventName = null;
        }
      };

      // if client would want to override, only for one time, the default error event and avoid
      // snag modal error window for http errors, it should call this function before
      // the http user call is executed
      var setBroadCastEvent = function (value){
        eventToConsume = value;
      };

      return {
        // add a call to this method in the finally or success callback function of the promise
        'resetBroadCastEvent': function (){
          eventToConsume = null;
        },
        //call this method with a event you'd like to broadcast, by default is error event
        'setBroadCastEventOnce' : setBroadCastEvent,

        'responseError': function(rejection) {
          var statusCode = rejection.status || null;
          var attributes = {
            'module': 'EaseExceptionsModule',
            'function': 'easeHttpInterceptor',
            'config': rejection.config || null,
            'statusCode': statusCode + '',
            'statusMessage': rejection.statusText || null,
            'cause': rejection || null
          };
          var qException = easeExceptionsService.createEaseException(attributes);
          var state = $injector.get('$state');
          if (!(state.current.name !== '' && (/[a-zA-Z]+\/prefetch/.test(attributes.config.url)))) {
            easeExceptionsService.stopSpinner();
            if (rejection.status === 403) {
              broadCastEvent(deniedErrorMessage);
              state.go('logout', {}, {
                location:false
              });
            }
            else if (rejection.status === 0) {
              console.log('Redirect User to Logout If connection status is blocked or disconnected');
            } else if (state.current.name !== '' && rejection.status !== "undefined" && (/[a-zA-Z]+\/content/.test(attributes.config.url))) {
              //do nothing
            } else if (state.current.name !== '' && rejection.status !== 401) {
              broadCastEvent(defaultErrorMessage);
            }
          }
          return $q.reject(qException);
        },
        'response': function(response) {
          if (typeof response.data === 'object') {
            response.data.isDisplayData = true;
            if (response.data.easeDisplayError) {
              var state = $injector.get('$state');
              if (response.data.easeDisplayError.severity === '1') {
                if(response.data.easeDisplayError.errorIdString == '200006') {
                  state.go('logout', {}, {
                    location: false
                  });
                }
                easeExceptionsService.stopSpinner();
                $rootScope.$broadcast('error', {
                  msgHeader: response.data.easeDisplayError.headerMessage,
                  msgBody: response.data.easeDisplayError.displayMessage
                });
                response.data.isDisplayData = false;

              } else if (response.data.easeDisplayError.severity === '2') {
                  if(response.data.easeDisplayError.errorIdString == '200900') {
                    var errorObj = {};
                    errorObj.value = response.data.easeDisplayError;
                    state.go(easeConstant.states.kEscid, errorObj);
                  }
              }
            }
          }
          return response;
        }
      };

    }
  ]).config(['$httpProvider',
    function($httpProvider) {

      //https://github.com/arasatasaygin/is.js/blob/master/is.js#L530
      var userAgent = 'navigator' in window && 'userAgent' in navigator && navigator.userAgent.toLowerCase() || '';

      //https://github.com/angular/angular.js/blob/v1.3.13/src/Angular.js#L185
      var msie = document.documentMode;

      if (/edge/i.test(userAgent) || msie){
        //http://stackoverflow.com/questions/16971831/better-way-to-prevent-ie-cache-in-angularjs#answer-23682047
        if (!$httpProvider.defaults.headers.get) {
          $httpProvider.defaults.headers.get = {};
        }

        //disable IE ajax request caching
        $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Thu, 01 Jan 1970 00:00:00 GMT';
        // extra
        $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
        $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
      }

      $httpProvider.interceptors.push('easeHttpInterceptor');
    }
  ])
});

define('easeUtils',['angular'], function(angular) {
  'use strict';
  var easeUtilsModule = angular.module('easeAppUtils', ['restangular', 'ngStorage', 'ngSanitize', 'oc.lazyLoad']);

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
    'ContentConstant',
    function($stateProvider, easeFilesProvider, easeTemplatesProvider, EaseConstant,
      ContentConstant) {
      var provider = this;

      function addAccount(stateName, parentState) {
        $stateProvider.state(stateName, {
          url: EaseConstant.easeURLs.addExtPayAcct,
          parent: parentState,
          resolve: {
            'extPaymentContentData': ["$ocLazyLoad", "$q", "$injector", "contentOneFactory", "ContentConstant", function($ocLazyLoad, $q, $injector, contentOneFactory, ContentConstant) {
              return $ocLazyLoad.load({
              serie:true,
              files: [easeFilesProvider.get('services', 'UMMPayment'),
                      easeFilesProvider.get('controller','UMMPayment'),
                      easeFilesProvider.get('directives','UMMPayment')]
              }).then(function() {
                var UmmPaymentFactory = $injector.get('UmmPaymentFactory');
                var deferred = $q.defer();
                contentOneFactory.initializeContentOneData(ContentConstant.kAddExternalAccount).then(function(data) {
                  deferred.resolve(data);
                  UmmPaymentFactory.setContentOneData(data);
                });
                return deferred.promise;
              }, function(error) {
                console.log('Failed to load UMMPaymentDependencies: ' + error);
              });
            }]
          },
          onEnter: ["EaseModalService", "easeTemplates", function(EaseModalService, easeTemplates) {
            EaseModalService(easeTemplates.get('UMMPayment', '', 'addExternalAcc'), {});
          }]
        })
      }
      angular.extend(provider, {
        set: function(stateName, parentNameState) {
          addAccount(stateName, parentNameState);
        },
      });
      this.$get = function() {
        return provider;
      };
    }
  ]).factory('EASEUtilsFactory', ["$http", "$q", "$state", "$location", "$sessionStorage", "$rootScope", "$animate", "$window", "$document", "$timeout", "$injector", "Restangular", "EaseConstantFactory", "EaseConstant", "easeExceptionsService", "EaseLocalizeService", "ContentConstant", "prefetchFactory", function($http, $q, $state, $location, $sessionStorage, $rootScope, $animate,
    $window,
    $document, $timeout, $injector, Restangular, EaseConstantFactory, EaseConstant, easeExceptionsService,
    EaseLocalizeService, ContentConstant, prefetchFactory) {
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
              accountReferenceId: decodeURIComponent(cardParams[2]),
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
        if (!message.internalToEase) {
          $window.open(message.path, '_blank');
        } else {
          var self = this;
          var accounts = this.getSummaryData().accounts;
          for (var i = 0; i < accounts.length; i++) {
            var indexat = message.path.indexOf(accounts[i].referenceId);
            if (indexat > -1) {
              var newAcctRefId = accounts[i].referenceId.replace('/', '%252F');
              message.path = message.path.replace(accounts[i].referenceId, newAcctRefId);
              break;
            }
          }
          var element = this.redirectURLS(this.getSummaryData(), message.path);
          if (element) {
            self.navigateToDest(element);
          } else {
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
      redirectTo360Summary: function() {},
      redirectToLogoutCentral: function() {},
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
      customerSummary: {},
      setCustomerSummary: function() {
        var data = {
           "easeDisplayError":{
              "severity":null,
              "headerMessage":null,
              "displayMessage":null,
              "errorIdString":null,
              "developerMessage":null
           },
           "profilePictureData":null,
           "greetingName":"Standalone App",
           "accountDisplayOrder":[
              "360CheckingAccountReferenceId",
              "360SavingsAccountReferenceId"
           ],
           "getRequest":false
        };
        this.setCustomerActivityHeader('50000', this.getCurrentBusinessSyncId());
        this.customerSummary = data;
        this.setCustomerPreferencesDirty(true);
        $rootScope.$broadcast('customerSummaryLoaded', data);
        this.clearCustomerActivityHeader();
      },
      getCustomerSummary: function() {
        return this.customerSummary;
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
        ) return true;

        // weekday from beginning of the month (month/num/day)
        var n_wnum = Math.floor((n_date - 1) / 7) + 1;
        var s_date2 = n_month + '/' + n_wnum + '/' + n_wday;

        if (s_date2 == '1/3/1' // Birthday of Martin Luther King, third Monday in January
          || s_date2 == '2/3/1' // Washington's Birthday, third Monday in February
          || s_date2 == '9/1/1' // Labor Day, first Monday in September
          || s_date2 == '10/2/1' // Columbus Day, second Monday in October
          || s_date2 == '11/4/4' // Thanksgiving Day, fourth Thursday in November
        ) return true;

        // weekday number from end of the month (month/num/day)
        var dt_temp = new Date(dt_date);
        dt_temp.setDate(1);
        dt_temp.setMonth(dt_temp.getMonth() + 1);
        dt_temp.setDate(dt_temp.getDate() - 1);
        n_wnum = Math.floor((dt_temp.getDate() - n_date - 1) / 7) + 1;
        var s_date3 = n_month + '/' + n_wnum + '/' + n_wday;

        if (s_date3 == '5/1/1' // Memorial Day, last Monday in May
        ) return true;


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

    function getLobFromProduct(product) {
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
    }

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
      lob = getLobFromProduct(product);
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
      var deferred = $q.defer(),
        nicknametoggledata = featureToggleFactory.getFeatureToggleData();
      Restangular.setBaseUrl(EaseConstant.baseUrl);
      EASEUtilsFactory.setCurrentBusinessSyncId();
      EASEUtilsFactory.setCustomerActivityHeader('50000', EASEUtilsFactory.getCurrentBusinessSyncId());
      var accountsummary = Restangular.one(EaseConstant.kAccountSummaryRetrieveUrl);
      accountsummary.get().then(function(data) {
        if ((!data.accounts && !_.isEmpty(data.easeDisplayError)) ||
          (data.accounts && data.accounts.length === 0)) {
          data.isDisplayData = false;
          $log.warn('accountSummary is empty');
          deferred.reject(data);
        } else {
          EASEUtilsFactory.setSummaryData(data);
          data.status = 'pass';
          data.accounts = data.accounts.filter(filterAccountSummaryProducts);
          data.accounts.forEach(function(item, i) {
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
          EASEUtilsFactory.calculateCurBalanceAndPaymentDueAndSassName(data.accounts);
          self.summary = data;
          deferred.resolve(data);
          EASEUtilsFactory.setCustomerSummary();
          if (self.lobArray.length > 1) {
            self.lobArray.sort();
          }
        }
      }, function(ex) {
        var data = {};
        data.status = 'fail';
        data.accounts = [];
        EASEUtilsFactory.setSummaryData(data);
        console.log(ex);
        if(ex && (ex.statusCode == '503' || ex.statusCode == '504')) {
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
      deferred.resolve(self.summary);
      return deferred.promise;
    };
    this.getLobArray = function getLobArray() {
      return self.lobArray;
    };
  }]).factory('appCookie', function() {
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

define('contentUtils',['angular'], function(angular) {
  'use strict';
  angular.module('easeAppUtils').factory('contentOneFactory', contentOneFactory);

  contentOneFactory.$inject = ['Restangular', 'EaseConstant', '$q', 'ContentConstant', '$locale', 'EASEUtilsFactory'];

  function contentOneFactory(Restangular, EaseConstant, $q, ContentConstant, $locale, EASEUtilsFactory) {

    var contentOneData = {};
    var dataStore = {};

    function getContentOneData(pageType) {
      if (dataStore.hasOwnProperty(pageType)) {
        return dataStore[pageType];
      }
    }

    function initializeContentOneData(pageType, pageFeature) {
      EASEUtilsFactory.clearCustomerActivityHeader();
      var deferred = $q.defer();
      var url = 'customer/content/' + pageType;
      contentOneData = getContentOneData(pageType);
      if (contentOneData) {
        deferred.resolve(contentOneData);
      } else {
        Restangular.setBaseUrl(EaseConstant.baseUrl);

        if (typeof pageFeature !== 'undefined') {
          url = url + '/' + pageFeature;
        }
        var contentOneRestService = Restangular.one(url + '?localeInfo=' + $locale.id);

        contentOneRestService.get().then(
          function successfulResolver(data) {
            dataStore[pageType] = data;
            deferred.resolve(data);
          });
      }
      return deferred.promise;
    }
    var factory = {
      initializeContentOneData: initializeContentOneData,
      getContentOneData: getContentOneData
    };
    return factory;
  }
});

define('customerPlatformDetailsUtils',['angular'], function(angular) {
  'use strict';
  angular.module('easeAppUtils')
    .factory('customerPlatformDetailsFactory', customerPlatformDetailsFactory);
  customerPlatformDetailsFactory.$inject = ['Restangular', 'EaseConstant', '$q'];

  function customerPlatformDetailsFactory(Restangular, EaseConstant, $q) {

    var customerPlatformData = {};

    function getCustomerPlatformData() {
      return customerPlatformData;
    }

    function initializeCustomerPlatform() {
      var deferred = $q.defer();
      if (customerPlatformData.fromServer) {
        deferred.resolve(customerPlatformData);
      }
      else {
        deferred.resolve({customerPlatform: "360, COS, CTSS, EASE, EOS"});
      }
      return deferred.promise;
    }
    var factory = {
      getCustomerPlatformData: getCustomerPlatformData,
      initializeCustomerPlatform: initializeCustomerPlatform
    };
    return factory;
  }
});

define('displayModals',['angular'], function(angular) {
  angular.module('easeAppUtils')
    .factory('displayModal', ["$q", "$ocLazyLoad", "EaseModalService", "easeTemplates", "easeFiles", "pubsubService", function($q, $ocLazyLoad, EaseModalService, easeTemplates, easeFiles, pubsubService) {
      return {
        addExternalPayment: function() {
          $ocLazyLoad.load([easeFiles.get('controller', 'UMMPayment'),
              easeFiles.get('services', 'UMMPayment'),
              easeFiles.get('directives', 'UMMPayment')
            ])
            .then(function(path) {
              pubsubService.pubsubTrackAnalytics({ name: 'add payment account:button' });
              EaseModalService(easeTemplates.get('UMMPayment', '', 'addExternalAcc'), {});
            })
        },
        displayAddExtAccountSuccess: function() {
          EaseModalService(easeTemplates.get('UMMPayment', '', 'addExternalAccSuccess'), {});
        }
      }
    }])
});

define('featureToggleUtils',['angular'], function(angular) {
  'use strict';
  angular.module('easeAppUtils').factory('featureToggleFactory', featureToggleFactory);

  featureToggleFactory.$inject = ['Restangular', 'EaseConstant', '$q', 'easeExceptionsService', '$rootScope',
    'EASEUtilsFactory'
  ];

  function featureToggleFactory(Restangular, EaseConstant, $q, easeExceptionsService, $rootScope, EASEUtilsFactory) {

    var dataStore = {};
    var FEATURENAME = 'featureName';
    var GROUPNAME = 'groupname';
    var EASE = 'EASE';
    var featureToggleData = {
       "ease.bank.accounttiles.v1":true,
       "ease.bank.singleaccounttrxview.v1":true,
       "ease.core.editalerts.v1":true,
       "ease.core.editbankaddress.v1":true,
       "ease.core.editcardaddress.v1":true,
       "ease.core.editPhone.v1":false,
       "ease.core.enableretailnavigation.v1":true,
       "ease.core.escapehatch.v1":true,
       "ease.core.globalmessaging.v1":true,
       "ease.core.manageexternalaccounts.v1":true,
       "ease.core.manageexternaldelaccounts.v1":true,
       "ease.core.managePaymentService.v1":true,
       "ease.core.mudflap.v1":true,
       "ease.core.transferbutton.v1":true,
       "ease.core.transferscheduled.v1":false,
       "ease.core.transferscheduledcancel.v1":false,
       "ease.core.transferschedulededit.v1":false,
       "ease.retail.accounttiles.v1":true,
       "ease.retail.singleaccounttrxview.v1":true,
    };

    function getFeatureToggleData() {
      return featureToggleData;
    }

    function getFeatureToggleDataSingle(pageType) {
      if (dataStore.hasOwnProperty(pageType)) {
        return dataStore[pageType];
      }
    }

    function getGroupFeatureToggleDataFromDatastore(groupName) {
      return groupFeatureToggleData[groupName];
    }

    function setGroupFeatureToggleDataStore(data, groupName) {
      groupFeatureToggleData[groupName] = data;
    }

    function getFeatureToggleDataByGroup(groupName) {
      var deferred = $q.defer();
      deferred.resolve(featureToggleData);
      return deferred.promise;
    }
    /*
      Function will always return a Promise of the value of FeatureToggleData
     */
    function initializeFeatureToggleData(featureParam) {
      var deferred = $q.defer();
      deferred.resolve(featureToggleData);
      return deferred.promise;
    } //end initializeFeatureToggleData

    var factory = {
      initializeFeatureToggleData: initializeFeatureToggleData,
      getFeatureToggleData: getFeatureToggleData,
      getFeatureToggleDataSingle: getFeatureToggleDataSingle,
      getFeatureToggleDataByGroup: getFeatureToggleDataByGroup,
      setGroupFeatureToggleDataStore: setGroupFeatureToggleDataStore,
      getGroupFeatureToggleDataFromDatastore: getGroupFeatureToggleDataFromDatastore
    };

    return factory;
  } // end FeatureToggleFactory
});

define('messageUtils',['angular'], function(angular) {
  'use strict';

  angular.module('easeAppUtils').factory('messagingService', ["Restangular", "EASEUtilsFactory", "EaseConstant", "$sessionStorage", "$rootScope", "$q", "summaryService", "$timeout", "featureToggleFactory", "pubsubService", function(Restangular, EASEUtilsFactory, EaseConstant,
    $sessionStorage, $rootScope, $q, summaryService, $timeout, featureToggleFactory, pubsubService) {

    var getPrirorityMessage = function(messages) {
      var firstMessage = messages[0];
      messages.forEach(function(item, i) {
        if (parseInt(item.priority) > parseInt(firstMessage.priority)) {
          firstMessage = item;
        }
      });
      return firstMessage;
    };

    var mapOverRideTypeToUrl = function(overRideType) {
      var basePath = { redirectingPath: '', internalToEase: true };
      switch (overRideType) {
        case 'EXTERNAL':
          basePath.internalToEase = false;
          break;
        case 'INT_COS':
        case 'INT_TRANSITE':
          basePath.internalToEase = false;
          break;
      }
      return basePath;
    };

    var getRedirectingUrl = function(button) {
      var linkingData = { path: '', internalToEase: '' };
      var overRideType = button.overRideType ? button.overRideType : '';
      var basePath = mapOverRideTypeToUrl(overRideType);
      linkingData.path = basePath.redirectingPath.concat(button.link.path);
      linkingData.internalToEase = basePath.internalToEase;
      return linkingData;
    };

    var formatFlapMessage = function(messages) {
      messages.forEach(function(item, i) {
        var msgHtml = '';
        var msgLink = {};
        try {
          if (item.article.section[0].headline) {
            msgHtml = item.article.section[0].headline;
          } else if (item.article.section[0].body) {
            msgHtml = item.article.section[0].body;
          }
          if (item.article.section[0].button.length > 0) {
            var button = item.article.section[0].button[0];
            var linkingData = getRedirectingUrl(button);
            msgLink.overRideType = item.article.section[0].button[0].overRideType ?
              item.article.section[0].button[0].overRideType : '';
            msgLink.value = button.value;
            msgLink.linkType = button.link.type;
            msgLink.path = linkingData.path;
            msgLink.internalToEase = linkingData.internalToEase;
          }
        } catch (exp) {
          msgHtml = item;
          msgLink = item;
        }
        item.message = msgHtml;
        item.msgLink = msgLink;
        item.responseUrlHref = item.responseUrlHref ? item.responseUrlHref : '';
        item.messageAnalyticsTracker = item.messageAnalyticsTracker ? item.messageAnalyticsTracker : '';
      });
      return messages;
    };

    var formatButtonMessages = function(btnMessages) {
      var buttonDetails = btnMessages.article.section[0].button[0];
      var subMessage = {};
      subMessage.action = buttonDetails.link.path ? buttonDetails.link.path.toLowerCase() : '';
      subMessage.buttonText = buttonDetails.value ? buttonDetails.value : '';
      subMessage.textAboveButton = buttonDetails.addText ? buttonDetails.addText : '';
      subMessage.responseUrlHref = btnMessages.responseUrlHref ? btnMessages.responseUrlHref : '';

      subMessage.messageAnalyticsTracker = btnMessages.messageAnalyticsTracker ? btnMessages.messageAnalyticsTracker : '';
      return subMessage;
    };

    var getGenericMessage = function(msgs, trust) {
      var priorityMessage = getPrirorityMessage(msgs);
      var msgHtml = '';
      try {
        if (priorityMessage.article.section[0].headline) {
          msgHtml = priorityMessage.article.section[0].headline;
        } else if (priorityMessage.article.section[0].body) {
          msgHtml = priorityMessage.article.section[0].body;
        }
      } catch (exp) {
        msgHtml = priorityMessage;
      }
      priorityMessage.messageAnalyticsTracker = priorityMessage.messageAnalyticsTracker ? priorityMessage.messageAnalyticsTracker : '' ;
      priorityMessage.message = msgHtml;
      priorityMessage.responseUrlHref = priorityMessage.responseUrlHref ? priorityMessage.responseUrlHref : '';
      return priorityMessage;
    };

    var messageSummary = null;

    return {
      messages: [],
      messagingReferenceId: '',
      promises: [],
      messageAnalytics: [],
      getMessageSummary: function() {
        return messageSummary;
      },
      setMessageSummary: function(value) {
        if ($rootScope.$root.$$phase !== '$apply' && $rootScope.$root.$$phase !== '$digest') {
          $rootScope.$apply(function() {
            messageSummary = value;
          });
        } else {
          messageSummary = value;
        }
      },

      callGlobalMessage: function(refID) {
        var self = this;
        var isGlobalMsg = true;
        var getMessageRequestPayLoad = {};
        var deferred = $q.defer();
        var acctRefId = [];
        acctRefId.push('');
        getMessageRequestPayLoad.accountReferenceIds = acctRefId;
        getMessageRequestPayLoad.customerDateTime = refID.customerDateTime;
        getMessageRequestPayLoad.numOfMsgs = refID.numOfMsgs;
        getMessageRequestPayLoad.pageContext = refID.pageContext;
        getMessageRequestPayLoad.logAsViewed = refID.logAsViewed;

        Restangular.setBaseUrl(EaseConstant.baseUrl);
        var getMessage = Restangular.all(EaseConstant.kGetMessageUrl);
        getMessage.post(getMessageRequestPayLoad).then(function(msgData) {
          deferred.resolve(msgData);
          self.setMessageSummary(msgData);
          if (isGlobalMsg) {
            $rootScope.$broadcast('UPDATE_GLOBAL_MSG', self.getGlobalMessage(), null, null);
          }
        });
        return deferred.promise;
      },

      getMessagesOnAccountSummary: function(refID) {
        var self = this;
        self.messageAnalytics = [];
        var globalAnalyticsTracker = '';
        self.callGlobalMessage(refID).then(function() {
          globalAnalyticsTracker = self.getGlobalMessage() && self.getGlobalMessage().messageAnalyticsTracker ?
            self.getGlobalMessage().messageAnalyticsTracker : '';
          self.messageAnalytics.push(globalAnalyticsTracker);
        });
        self.getMessageApi(refID);
        $q.all(self.promises).then(function() {
          //pubsub event
          pubsubService.pubsubTrackAnalytics({
            taxonomy: {
              level1: 'ease',
              level2: 'account summary',
              level3: '',
              level4: '',
              level5: '',
              country: 'us',
              language: 'english',
              system: 'ease_web',
            },
            interactionMessage:{
              display: self.messageAnalytics.join('|')
            }
          });
        });
      },

      getMessageApi: function(refID) {
        var self = this;
        self.messages.length = 0;
        self.promises = [];
        self.setMessageSummary('');
        var deferred = $q.defer();
        if (refID.accountReferenceIds.length > 0) {
          $sessionStorage.IsRefresh = true;
        }

        refID.accountReferenceIds.forEach(function(id, j) {
          var getMessageRequestPayLoad = {};
          var acctRefId = [];
          acctRefId.push(id);
          getMessageRequestPayLoad.accountReferenceIds = acctRefId;
          getMessageRequestPayLoad.customerDateTime = refID.customerDateTime;
          getMessageRequestPayLoad.numOfMsgs = refID.numOfMsgs;
          getMessageRequestPayLoad.pageContext = refID.pageContext;
          getMessageRequestPayLoad.logAsViewed = refID.logAsViewed;

          //Call OL Messaging API
          Restangular.setBaseUrl(EaseConstant.baseUrl);
          var getMessage = Restangular.all(EaseConstant.kGetMessageUrl);
          getMessage.post(getMessageRequestPayLoad).then(function(msgData) {
            deferred.resolve(msgData);
            self.setMessageSummary(msgData);
            var tileMessages = self.getFlapMessage((id));
            var messages = tileMessages;
            messages.messagingReferenceId = decodeURIComponent(id);
            var mudFlapAnalyticsTracker = messages && messages.flapMessages && messages.flapMessages[0]
               && messages.flapMessages[0].messageAnalyticsTracker ? messages.flapMessages[0].messageAnalyticsTracker : '';
            var buttonFlapAnalyticsTracker = messages && messages.buttonMessage && messages.buttonMessage.messageAnalyticsTracker ?
              messages.buttonMessage.messageAnalyticsTracker : '';
            self.messages[j] = messages;
            self.messageAnalytics.push(mudFlapAnalyticsTracker);
            self.messageAnalytics.push(buttonFlapAnalyticsTracker);
            self.messagingReferenceId = new Date();
          }, function(ex) {
            deferred.reject(ex);
          });
          self.promises.push(deferred.promise);
        });
        return deferred.promise;
      },
      // Do not call respond to message eAPI for already viewed messages
      responseMessageApi: function(responseUrlHref, responseType, pageContext) {
        if (typeof responseUrlHref === 'undefined' || responseUrlHref === '') {
          return false;
        }
        var d = new Date();
        var viewDate = d.toISOString();
        var respondToMsgObj = {
          "url": responseUrlHref,
          "action": responseType || 'VIEWED',
          "viewedDateTime": viewDate,
          "pageContext": pageContext || "summary",
          "viewedCount": "1"
        }
        EASEUtilsFactory.setCustomerActivityHeader('50000');
        Restangular.setBaseUrl(EaseConstant.baseUrl);
        var respondToMessage = Restangular.all(EaseConstant.kGetResponseMessageUrl);
        respondToMessage.post(respondToMsgObj).then(function(msgResponse) {}, function(msgResponse) {
          console.log(msgResponse);
        });
      },
      getGlobalMessage: function() {
        var self = this;
        var globalMsg = { message: '', path: '', linkingText: '', internalToEase: true, messageAnalyticsTracker: '' };
        var msgSummary = self.getMessageSummary();
        if (msgSummary && msgSummary.global && msgSummary.global.length > 0) {
          globalMsg = getGenericMessage(self.getMessageSummary().global);
        }

        //Obtain feature toggle data
        var featureToggleData = featureToggleFactory.getFeatureToggleData();

        //Initializing global message flag to true, to allow display as usual
        // unless flag is false
        var isGlobalMsgFeatureToggle = true;
        if (featureToggleData && (typeof featureToggleData[EaseConstant.features.globalMessageFeatureName] !== 'undefined')) {
          //set the flag from feature toggle data
          isGlobalMsgFeatureToggle = featureToggleData[EaseConstant.features.globalMessageFeatureName];
        }

        //We check for both conditions - global message being (null or empty) OR (feature toggle
        // flag is set to false) - then use the greeting message
        if ((globalMsg && globalMsg.message === '') || (isGlobalMsgFeatureToggle === false)) {
          globalMsg.message = self.greetingMessage();
        } else {
          //Use actual message from the OL service.
          globalMsg.message = self.greetingMessageChunks(globalMsg.message);
          var button = globalMsg.article.section[0].button[0];
          if (button) {
            var linkingData = getRedirectingUrl(button);
            globalMsg.linkingText = button.value;
            globalMsg.path = linkingData.path;
            globalMsg.internalToEase = linkingData.internalToEase;
            globalMsg.overRideType = angular.isDefined(button.overRideType) ? button.overRideType : '';
          }
        }
        return globalMsg;
      },

      getFlapMessage: function(accountRefId) {
        var self = this;
        var flapArray = [];
        var buttonMessage = {},
          tileMessages = {};
        if (this.getMessageSummary() && this.getMessageSummary().accounts) {
          this.getMessageSummary().accounts.forEach(function(msg) {
            if (accountRefId === msg.accountReferenceId) {
              flapArray = msg.flapMessage;
              buttonMessage = msg.subMessage;
            }
          });
        }

        tileMessages.buttonMessage = (buttonMessage.length > 0) ? formatButtonMessages(buttonMessage[0]) : '';
        tileMessages.flapMessages = (flapArray.length > 0) ? formatFlapMessage(flapArray) : '';


        return tileMessages;
      },

      // logAsViewed is set to true by default for core. Other LOB's should set this boolean
      // according to their requirement.
      getReferenceID: function(accounts, refresh, pageContext, numOfMsgs, logAsViewed) {
        var self = this;
        var accountRefIds = [];
        var d = new Date();
        var customerDateTime = d.toISOString();
        accounts.forEach(function(item, i) {
          if (item.accountMessage) {
            if (['closed', 'restricted'].indexOf(item.accountMessage[0].level) === -1) {
              accountRefIds.push(encodeURIComponent(item.referenceId));
            }
          } else {
            accountRefIds.push(encodeURIComponent(item.referenceId));
          }
        });
        return {
          accountReferenceIds: accountRefIds,
          customerDateTime: customerDateTime,
          pageContext: pageContext,
          numOfMsgs: numOfMsgs || 1,
          logAsViewed: logAsViewed || false
        }
      },
      greetingMessageChunks: function(str) {
        var splitStr = str.split(' ');
        var greetingChunks = [];
        var line = [];

        for (var i = 0; i < splitStr.length; i++) {
          line.push(splitStr[i]);
          if (line.join(' ').toString().length > 45) {
            if (greetingChunks.length == 2) {
              line.splice(line.length - 1, 1, '...');
            }
            greetingChunks.push(line.join(' ').toString());
            line.splice(0, line.length);
            if (greetingChunks.length == 3) {
              break;
            }
          }
        }
        if (greetingChunks.length < 3) {
          if (line.join(' ').toString().length > 45) {
            line.splice(line.length - 1, 1, '...');
          }
          greetingChunks.push(line.join(' ').toString());
        }
        return greetingChunks.join('\n').toString();
      },
      greetingMessage: function() {
        var now = new Date(),
          hours = now.getHours(),
          greeting = "Hi";
        if (hours >= 0 && hours < 12) {
          greeting = "Good Morning!";
        } else {
          if (hours >= 12 && hours < 18) {
            greeting = "Good Afternoon!";
          } else {
            if (hours >= 18) {
              greeting = "Good Evening!";
            }
          }
        }
        return greeting;
      }
    };
  }]);
});

define('prefetchUtils',['angular'], function(angular) {
  'use strict';
  angular.module('easeAppUtils').factory('prefetchFactory', prefetchFactory);

  prefetchFactory.$inject = ['Restangular', 'EaseConstant', '$q'];

  function prefetchFactory(Restangular, EaseConstant, $q) {
    var prefetchRestService = '';

    function initializePrefetch(lobApp, accountIds) {
      Restangular.setBaseUrl(EaseConstant.baseUrl);
      var url = '';
      url = lobApp + '/prefetch';

      if (typeof accountIds !== 'undefined') {
        // .customPOST([elem, path, params, headers])
        prefetchRestService = Restangular.one(url).withHttpConfig({ timeout: EaseConstant.kPrefetchCallTimeout }).
        customPOST((accountIds), '', {}, {
          Authorization: 'Basic',
          'Content-Type': 'application/x-www-form-urlencoded'
        });
      } else {
        prefetchRestService = Restangular.one(url).withHttpConfig({ timeout: EaseConstant.kPrefetchCallTimeout }).get();
      }

      prefetchRestService
        .then(function successfulResolver() {
          console.log('prefetch ping Success');
        })
        .catch(function rejectResolver(ex) {
          console.log('prefetch ping Failure - ' + ex.statusMessage);
        });
    }
    var factory = {
      initializePrefetch: initializePrefetch
    };
    return factory;
  }
});

define('validationUtil',['angular'], function(angular) {
  'use strict';

  var validationModule = angular.module('easeAppUtils');
  validationModule.factory('validationDataService', [function() {
    var regExpForUserName = /^[a-zA-Z0-9_-]*$/;
    var regExpForPassword = /^(?=[a-zA-Z0-9~@#$^*()_+=[\]{}|\\,.?: -]*$)(?!.*[<>'"/;`%])/;
    var regExpSanitize = /<script>.*(<\/script>?)?/gi;
    return {
      getPatternForUserName: function() {
        return regExpForUserName;
      },
      getPatterForPassword: function() {
        return regExpForPassword;
      },
      isValidUserName: function(data) {
        return regExpForUserName.test(data);
      },
      isValidPassword: function(data) {
        return regExpForPassword.test(data);
      },
      sanitizeInputData: function(data) {
        return data.replace(regExpSanitize, '');
      }
    };
  }]);
});

define('commonModule',['angular'], function(angular) {
  'use strict';
  angular.module('CommonModule', ['EaseProperties']).directive('collapseToggle', function() {
      return {
        restrict: 'A',
        scope: {
          model: '=',
          name: '@',
          element: '@'
        },
        link: function(scope, element, attrs) {
          scope.$watch('model', function(newValue) {
            var element_id = scope.name;
            $(scope.element).collapse('hide');
            $(element_id).collapse('toggle');
          });
        }
      };
    }).directive('initCollapse', function() {
      return {
        restrict: 'A',
        link: function(scope, element, attrs) {
          if (scope.$last) {
            $(scope.toggle.collapseEl).collapse({
              toggle: false
            });
          }
        }
      };
    }).directive('errorMessage', function() {
      return {
        restrict: 'E',
        template: '<div class="error-label" role="alert">{{error}}</div>' +
          '<div class="error-summary" ng-repeat="field in fields" role="alert">' +
          '<p ng-if="field.formControl.$touched && field.formControl.$invalid">{{field.templateOptions.label}} is ' +
          'required.</p></div>',
        scope: {
          error: '@',
          fields: '='
        }
      };
    }).directive('ifImageNotExistDir', function() {
      return {
        restrict: 'A',
        scope: {
          productName: '@',
          page: '@'
        },
        link: function(scope, element, attrs) {
          element.bind('error', function() {
            var eleSpan;
            if (this.parentNode.firstElementChild.nodeName === 'IMG') {
              eleSpan = document.createElement('span');
              this.parentNode.insertBefore(eleSpan, this);
            } else {
              eleSpan = this.parentNode.firstElementChild;
            }
            eleSpan.innerHTML = attrs.productName.trim();
            if (attrs.page === 'AccountSummary' || attrs.page === 'undefined' || attrs.page === undefined) {
              eleSpan.className = 'headerTruncate';
            } else {
              eleSpan.className = 'headerAccDetailTruncate';
            }
            this.style.display = 'none';
          });
        }
      };
    }).directive('brandImage', ["$compile", function($compile) {
      return {
        replace: true,
        restrict: 'EA',
        scope: {
          elementVal: '='
        },
        link: function(scope, element, attrs) {
          var elementVal, headerTruncateLarge, headerTruncateSmall, displayName;
          var elementVal = scope.elementVal;
          var getTemplate = function() {
            var productImageIsAvailable = (typeof elementVal.accountNickname === 'undefined' && !!elementVal.imagePath);
            if (productImageIsAvailable) {
              return ' <img  page="AccountSummary" if-Image-Not-Exist-Dir product-Name="{{elementVal.displayName}}" ng-src="{{elementVal.imagePath}}">'
            } else {
              headerTruncateLarge = elementVal.displayName.length <= 21;
              headerTruncateSmall = elementVal.displayName.length >= 20;
              displayName = elementVal.displayName.length >= 20 ? elementVal.displayName.substring(0, 20) : elementVal.displayName;
              return '<h2 ng-class="{headerTruncateLarge:' + headerTruncateLarge + ',\'headerTruncateSmall\':' +
                headerTruncateSmall + '}">' + displayName + '</h2>';
            }
          };
          var template = getTemplate();
          element.append($compile(template)(scope));
        }
      };
    }])
    // directive used to prevent the paste in textbox
    .directive('noPaste', function() {
      return {
        link: function(scope, ele, attrs) {
          ele.on('paste', function(evt) {
            evt.preventDefault();
          })
        }
      }
    })
    // directive used to restrict number only entry
    .directive('numberOnly', function() {
      return {
        restrict: 'A',
        link: function(scope, element, atts) {
          element.on('keypress', function(evt) {
            var charCode = (typeof evt.which === "number") ? evt.which : evt.keyCode
            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
              if (!(evt.metaKey || evt.ctrlKey)) {
                evt.preventDefault();
              }
            } else {
              return true;
            }
          })
        }
      }
    }).directive('autofocus', ['$timeout',
      function($timeout) {
        return {
          restrict: 'A',
          link: function($scope, $element) {
            $timeout(function() {
              $element[0].focus();
            }, 500);
          }
        }
      }
    ]).directive('loadMoreTransactions', function() {
      return {
        restrict: 'E',
        scope: false,
        link: function($scope, $element, $attr) {
          $scope.label = $attr.label;
        },
        template: '<button id ="loadMoreBtn" aria-describedby = {{label}} ' +
        'class ="load-more-transaction-btn">{{label}}</button>'
      }
    }).directive('clickButtonOnce', ["$timeout", function($timeout) {
      var delay = 500;
      return {
        restrict: 'A',
        priority: -1,
        link: function(scope, elem) {
          var disabled = false;

          function onClick(evt) {
            if(evt.keyCode === 9 || evt.keyCode === 16){
              return;
            }
            if (evt.keyCode === 13) {
              elem.triggerHandler('click');
            }
            if (disabled) {
              evt.preventDefault();
              evt.stopImmediatePropagation();
            } else {
              disabled = true;
              $timeout(function() { disabled = false; }, delay, false);
            }
          }
          scope.$on('$destroy', function() { elem.off('click keydown', onClick); });
          elem.on('click keydown', onClick);
        }
      };
    }])
    .directive('validateAmount', ["$document", "EaseConstant", function($document, EaseConstant) {
      return {
        restrict: 'A',
        scope: {
          displaymsg: '&',
          isValid: '=isValid',
          isInstant: '='
        },
        link: function(scope, element) {
          element.bind('keyup', function() {
            var totalAmount = parseFloat(angular.element($document[0].getElementById('amountId'))
              .text().replace(/[^\d.,]/g, ''));
            var value;
            if (this.value.charAt(0) === '$') {
              value = this.value.substr(1, this.value.length);
            } else {
              value = this.value;
            }
            var regex = /\d*\.?\d\d?/g;
            if (value.match(/\d*\.\d{1,3}/)) {
              if (value.indexOf('.') !== -1) {
                var decimal = value.split('.')[1];
                if (parseFloat(decimal) > 0) {
                  this.value = (Math.round(value * 100) / 100);
                }
              }
              this.value = '$' + regex.exec(value);
            }
            if (totalAmount < parseFloat(value) &&
              scope.isInstant ||
              parseFloat(value) > EaseConstant.kTransferAmountUpperBound) {
              element.addClass('shake');
              scope.isValid = false;
              scope.displaymsg({ 'showError': true, 'amount': parseFloat(value), 'availableBalance': totalAmount });
            } else if (parseFloat(value) < EaseConstant.kTransferAmountLowerBound) {
              element.addClass('shake');
              scope.isValid = false;
              scope.displaymsg({ 'showError': true, 'amount': parseFloat(value), 'availableBalance': totalAmount });
            } else if (value === '' || parseInt(value) < 0) {
              this.value = '';
              scope.displaymsg({ 'showError': false, 'amount': parseFloat(value), 'availableBalance': totalAmount });
              scope.isValid = false;
              element.removeClass('shake');
            } else {
              element.removeClass('shake');
              scope.displaymsg({ 'showError': false, 'amount': parseFloat(value), 'availableBalance': totalAmount });
              scope.isValid = true;
            }
          });
          element.bind('keydown', function(evt) {
            var charCode = (evt.which) ? evt.which : evt.keyCode;
            if (((charCode === 46 || charCode === 8) && this.value.indexOf('.') === -1) || (charCode >= 48 &&
                charCode <= 57) || (charCode >= 96 && charCode <= 105) || charCode === 9 || charCode === 8 ||
              charCode === 190 || charCode === 110) {
              if (this.value === '') {
                this.value = '$' + this.value;
              }
              return true;
            }
            evt.stopPropagation();
            evt.preventDefault();
            return false;
          });
          element.bind('blur', function() {
            var currentValue;
            if (this.value.charAt(0) === '$') {
              currentValue = this.value.substr(1, this.value.length);
            } else {
              currentValue = this.value;
            }
            if (!isNaN(parseFloat(currentValue).toFixed(2)) &&
              parseFloat(currentValue) >= EaseConstant.kTransferAmountLowerBound) {
              this.value = '$' + parseFloat(currentValue).toFixed(2);
              scope.isValid = true;
            } else {
              this.value = '';
              scope.isValid = false;
              //element.addClass('shake');
              var value = currentValue;
              scope.displaymsg({ 'showError': true, 'amount': parseFloat(value) });
            }
          })
        }
      }
    }])
    .directive('keypressHandler', function() {
      return {
        restrict: 'A',
        link: function(scope, element, attr) {
          element.bind('keypress', function(event) {
            if (event.keyCode === 13) {
              element.triggerHandler('click', function() {});
            }
          })
        }
      }
    });

});

define('pubsubServiceModule',['angular'], function(angular) {
  'use strict';
  var pubsubService = angular.module('pubsubServiceModule', [ ])
    .factory('pubsubService', ['$window', function($window) {
      var pubsub = function(eventName, value) {
        try {
          if (value.scDLLevel2 === 'login' && typeof $window.publisherFW === 'undefined') {
            var pubsublogin = setInterval(function() {
              try {
                $window.publisherFW.publishEvent(eventName, value);
                clearInterval(pubsublogin);
              } catch (ex) {}
            }, 300)
          } else {
            $window.publisherFW.publishEvent(eventName, value);
          }
        } catch (e) {
          console.log('there is error in pubsub framework: ' + e);
        }
      };
      return {
        pubsubTrackAnalytics: function(value) {
          pubsub('trackAnalytics', value);
        },
        pubsubPageView: function(value) {
          pubsub('pageView', value);
        },
        pubsubLinkClick: function(value) {
          pubsub('linkClicked', value);
        },
        pubsubNavClick: function(value) {
          pubsub('navClicked', value);
        },
        pubsubButtonClick: function(value) {
          pubsub('buttonClicked', value);
        },
        pubsubformfieldClick: function(value) {
          pubsub('formfieldClicked', value);
        },
        pubsubDrawerClose: function(value) {
          pubsub('drawerClose', value);
        },
        pubsubDrawerOpen: function(value) {
          pubsub('drawerOpen', value);
        },
        pubsubCarouselClicked: function(value) {
          this.pubsubTrackAnalytics(value);
        },
        pubsubDropdownSelected: function(value) {
          pubsub('dropdownSelected', value);
        }
      };
    }]);
  return pubsubService;
});

define('UniversalTranslate',['angular'], function(angular) {
  'use strict';

  angular.module('UniversalTranslateModule', [])
    .factory('UniversalTranslate', ['$http', '$q', '$rootScope', function($http, $q, $rootScope) {
    var needToLoadParts;
    var ut = createUT;
    var partMap = {};
    var queryTemplate = '?feature={part}&lang={locale}';
    var flatFileTemplate = '/{part}-{locale}.json';
    var loaderPromise;

    function Part(partName) {
      this.locales = {};
      this.name = partName;
      this.load = true;
      this.isFlatFile = false;
      this.url = '';
    }

    function createUT(options) {
      options.baseUrl = options.baseUrl || '';

      if (angular.isUndefined(loaderPromise)) { loaderPromise = $q.defer(); }

      var dataToReturn = [];
      var localeKey = options.key;
      var partsToLoad = _getPartsToLoad(localeKey);

      if (_hasParts()) {
        if (needToLoadParts) {
          var part;
          var calls = [];

          for (var partName in partMap) {
            part = partMap[partName];

            if (part.load === true) {
              part.load = false;
              calls.push($http.get(_buildUrl(part, options)));
            } else {
              dataToReturn.push(part.locales[localeKey]);
            }
          }

          $q.all(calls).then(function(response) {
            for (var i = 0; i < partsToLoad.length; i++) {
              partsToLoad[i].locales[localeKey] = response[i].data;
              partsToLoad[i].load = false;
              dataToReturn.push(response[i].data);
            }

            loaderPromise.resolve(dataToReturn);
          }, function onError() {
            loaderPromise.reject(options.key);
          });
        } else {
          for (var partName in partMap) {
            dataToReturn.push(partMap[partName].locales[localeKey]);
          }

          loaderPromise.resolve(dataToReturn);
        }
      } else {
        loaderPromise.resolve();
      }

      return loaderPromise.promise;
    }

    function load(futureParts) {
      loaderPromise = $q.defer();

      if (angular.isArray(futureParts)) {
        futureParts.map(_buildPart);
      } else {
        _buildPart(futureParts);
      }

      $rootScope.$emit('$translatePartialLoaderStructureChanged');
      return loaderPromise.promise;

      function _buildPart(futurePart) {
        if (!partMap[futurePart.name]) {
          partMap[futurePart.name] = new Part(futurePart.name);
        }

        partMap[futurePart.name].url = futurePart.url;
        partMap[futurePart.name].isFlatFile = futurePart.flatFile || false;
      }
    }

    function _getPartsToLoad(locale) {
      var partsToLoad = [];
      needToLoadParts = false;

      for (var partName in partMap) {
        if (!partMap[partName].locales[locale]) {
          partMap[partName].load = true;
        }

        if (partMap[partName].load === true) {
          partsToLoad.push(partMap[partName]);
        }
      }

      if (partsToLoad.length > 0) {
        needToLoadParts = true;
      }

      return partsToLoad;
    }

    function _hasParts() {
      for (var partName in partMap) {
        if (partMap.hasOwnProperty(partName)) {
          return true;
        }
      }

      return false;
    }

    function _buildUrl(part, options) {
      var partMatch = new RegExp('\\{part\\}', 'g');
      var localeMatch = new RegExp('\\{locale\\}', 'g');
      var url = part.isFlatFile ? (part.url + flatFileTemplate) : (options.baseUrl + part.url + queryTemplate);

      url = url.replace(partMatch, part.name);
      url = url.replace(localeMatch, options.key);

      return url;
    }

    ut.load = load;

    return ut;

  }]);
});

define('easeDropdownModule',['angular'], function (angular) {
  'use strict';

  var easeDropdownModule = angular.module('easeDropdownModule', ['EaseProperties', 'pubsubServiceModule',
    'easeAppUtils'
  ]);

  easeDropdownModule.directive('amountPay', ['$document' ,'EASEUtilsFactory', function($document,EASEUtilsFactory){
    return{
      restrict:'A',
      scope: {
        service: "=" //UmmPaymentFactory
      },
      link: function(scope, element, atts){
        element.bind('keyup', function(){
          var totalAmount = angular.element($document[0].getElementById('amountId')).text();
          var regex = /\d*\.?\d\d?/g;
          if(this.value.match(/\d*\.\d{1,3}/)){
            if(this.value.indexOf('.') !== -1){
              var decimal = this.value.split('.')[1];
              if (parseFloat(decimal) > 0){
                this.value = (Math.round(this.value * 100) / 100)
              }
            }
            this.value = regex.exec(this.value);
          }
          scope.$emit('EASE_DD_DISPLAY_MSG',scope.service.isOtherAmountValid(this.value));
          var symbol = angular.element(this.nextElementSibling);
          if (this.value !== ''){
            symbol.removeClass('gray');
          }else{
            symbol.addClass('gray');
          }
          var tooltip = "$"+ this.value + " exceeds account balance, if you proceed, transfer money later to avoid overdraft.";
          if(parseFloat(totalAmount) < parseFloat(this.value)){
            EASEUtilsFactory.DisplayTooltip(true,tooltip);
          } else {
            EASEUtilsFactory.DisplayTooltip(false);
          }
        });

        element.bind('keypress', function(evt){
          var charCode = (evt.which) ? evt.which : evt.keyCode;
          if (((charCode == 46 || charCode == 8) && this.value.indexOf('.') === -1)
            || (charCode >= 48 && charCode <= 57) ) {
            return true;
          }
          evt.stopPropagation();
          evt.preventDefault();
          return false;
        })

        element.on('$destroy', function(){
          scope.$destroy();
        })
      }
    }
  }])

  easeDropdownModule.directive('easeDropdown',['$document', '$rootScope', 'pubsubService', 'EaseConstant', '$timeout',
    function( $document, $rootScope, pubsubService, EaseConstant, $timeout){
    return {
      restrict: 'AE',
      templateUrl:'/ease-ui/dist/partials/dropdown.html',
      scope: {
        type:'=',
        localize:'=',
        selectedItem:'=?bindData',
        labelTxt:'=?',
        isValid:'=',
        focus:'=',
        service: '=',
        widgetId: '=',
        labelId: '=',
        noPlaceHolder: '=',
        watchRelatedDd: '=',
        defaultItemIndex: '=',
        lengthItem: '@'
      },
      link: function (scope, element, attrs) {
        attrs.lengthItem = attrs.lengthItem || EaseConstant.kDefaultLengthForDropDownItem
        var label = angular.element(element[0].firstElementChild);
        var box = angular.element(element[0].lastElementChild);
        var allEaseDropdowns = angular.element($document[0].getElementsByTagName('ease-dropdown'));
        if (typeof scope.widgetId === 'undefined'){
          scope.widgetId = scope.type;
        }
        var setSelectedIdx = function(){
          if (typeof scope.noPlaceHolder !== 'undefined' && scope.noPlaceHolder){
            if(scope.type === 'amountDd') {
              scope.selectedItem = null;
            }
            return false;
          }

          if (typeof scope.defaultItemIndex !== 'undefined') {
            scope.selectedItem = scope.dropdownSelect[scope.defaultItemIndex];
          } else if (scope.service.getSelectedIdx){
            scope.selectedItem = scope.dropdownSelect[scope.service.getSelectedIdx(scope.widgetId)];
          } else{
            scope.selectedItem = scope.dropdownSelect[0];
          }
        };
        scope.isDropdownOpen = false;
        scope.dropdownSelect =  scope.service.getData(scope.widgetId);
        setSelectedIdx();
        if (scope.dropdownSelect.length === 1){
          $timeout(function() {
            $rootScope.$broadcast('EASE_DD_ITEM_SELECTED', {
              type: scope.widgetId,
              item: scope.dropdownSelect[0],
              init: true
            });
          }, 100);
        } else {
            $timeout(function() {
              $rootScope.$broadcast('EASE_DD_ITEM_SELECTED', {
                type: scope.widgetId,
                item: scope.selectedItem,
                init: true
              });
            }, 100);
        }
        scope.$watch(scope.service.isDataChanged, function(newVal,oldVal) {
          if (newVal !== oldVal){
            scope.dropdownSelect = scope.service.getData(scope.widgetId);
            setSelectedIdx();
            $rootScope.$broadcast('EASE_DD_ITEM_SELECTED',
              {type: scope.widgetId, item:scope.selectedItem});
          }
        });
        scope.initWidget = true;
        if (typeof scope.watchRelatedDd !== 'undefined'){
          scope.$watch(scope.service[scope.watchRelatedDd], function() {
            scope.dropdownSelect = scope.service.getData(scope.widgetId);
            setSelectedIdx();
            $rootScope.$broadcast('EASE_DD_ITEM_SELECTED',
              {type: scope.widgetId, item:scope.selectedItem, init: scope.initWidget});
            scope.initWidget = false;
          });
        }else{
          scope.initWidget = false;
        }

        scope.closeDropdown = function(menuNode){
          if (menuNode === undefined){
            menuNode = box.find('ul');
          }
          if (menuNode.hasClass('headerslidedown')){
            menuNode.removeClass('headerslidedown');
            menuNode.addClass('headerslideup');
          }
          scope.isDropdownOpen = false;
        };

        scope.closeAllDropdowns = function() {
          var menuNodes = allEaseDropdowns.find('ul');
          angular.forEach(menuNodes, function(value) {
            var menuNode = angular.element(value);
            if (menuNode.hasClass('headerslidedown')) {
              menuNode.removeClass('headerslidedown');
              menuNode.addClass('headerslideup');
            }
          });
          scope.isDropdownOpen = false;
        };

        scope.openDropdown = function(menuNode){
          scope.closeAllDropdowns();
          if(typeof scope.labelTxt === 'undefined'){
            scope.labelTxt = '';
          }
          pubsubService.pubsubformfieldClick({formfieldName:scope.labelTxt.toLowerCase()});
          box.find('li').removeClass('hover-focus');
          if (menuNode === undefined){
            menuNode = box.find('ul');
          }
          if (scope.type === 'amountDd'
              && typeof scope.selectedItem !== 'undefined'
              &&  scope.selectedItem != null
              && scope.selectedItem.type === 'otherAmnt'){
            menuNode.addClass('otherAmntSelected');
          }else{
            menuNode.removeClass('otherAmntSelected');
          }
          menuNode.removeClass('headerslideup');
          menuNode.addClass('headerslidedown');
          scope.isDropdownOpen = true;
        };

        scope.$on('EASE_DD_DISPLAY_MSG', function(e, data){
          if (!data.init){
            if (data.success){
              label.removeClass('hasError');
              box.removeClass('shake');
              box.removeClass('hasError');
              label[0].innerHTML = scope.labelTxt;
              scope.isValid = true;
            }else{
              // label.addClass('hasError');
              // box.addClass('hasError');
              // box.addClass('shake');
              // label[0].innerHTML = scope.labelTxt + ' ' + data.message;
              scope.isValid = false;
            }
          }
        });

        scope.$on('EASE_DD_CLOSE_DROPDOWN', function(){
          scope.closeDropdown();
        });

        element.bind('click', function(evt) {
          var menuNode = box.find('ul');
          if (menuNode.hasClass('headerslideup')) {
            box.removeClass('shake');
            scope.openDropdown(menuNode);
          } else {
            if (scope.isValid){
              box.removeClass('shake');
            }
            scope.closeDropdown(menuNode);
          }
        });
        scope.itemIdxFocus = 0;
        var moveFocusItem = function(way,charVal){
          var liElemts = box.find('li');
          liElemts.removeClass('hover-focus');
          if (way === 'up'){
            scope.itemIdxFocus -=1;
          }else if(way==='down' && charVal===13){
            scope.itemIdxFocus = 1;
          }else if (way === 'down'){
            scope.itemIdxFocus +=1;
          }
          if (scope.itemIdxFocus <= 0){
            scope.itemIdxFocus =scope.dropdownSelect.length;
          }else if(scope.itemIdxFocus > scope.dropdownSelect.length){
            scope.itemIdxFocus = 1;
          }
          angular.element(liElemts[scope.itemIdxFocus - 1]).addClass('hover-focus');
          angular.element(liElemts[scope.itemIdxFocus - 1]).find('div')[1].focus();
        };
        var findSelectedItemIdx = function(){
          for(var i=0;i<scope.dropdownSelect.length;i++){
            var item = scope.dropdownSelect[i];
            if (angular.equals(item, scope.selectedItem)){
              return i;
            }
          }
        };
        element.bind('keydown', function(evt){
          var charCode = (evt.which) ? evt.which : evt.keyCode;
          if(scope.isDropdownOpen){
            if (charCode === 27) {
              scope.closeDropdown();
            }else if(charCode === 38) {
              moveFocusItem('up','');
            }else if(charCode === 40 || charCode === 9) {
              moveFocusItem('down','');
            }else if(charCode === 32 || charCode === 13){
              scope.selectedItem = scope.dropdownSelect[scope.itemIdxFocus-1];
              $rootScope.$broadcast('EASE_DD_ITEM_SELECTED', {type: scope.widgetId, item:scope.selectedItem});
              scope.closeDropdown();
              scope.lastFocus.focus();
              scope.$apply();
            }
            else{
              return true;
            }
          }else{
            if (charCode === 32 || charCode === 13 || charCode === 40) {
              scope.lastFocus = document.activeElement;
              scope.openDropdown();
              scope.fitemIdxFocus = findSelectedItemIdx();
              if(charCode === 13 || charCode === 32 || charCode === 40) {
                moveFocusItem('down', 13);}
              else{
                moveFocusItem('down','');
              }
            }else{
              return true;
            }
          }
          evt.stopPropagation();
          evt.preventDefault();
          scope.$evalAsync();
          return false;
        });

        element.on('$destroy', function(){
          scope.$destroy();
        })
      }
    };
  }]);

  easeDropdownModule.directive('easeDropdownItemSelected',[function () {
    return {
      restrict: 'AE',
      template: '<div ng-include="getContentUrl"></div>',
      scope:{
        item:'=',
        type:'=',
        service:'=',
        lengthItem:'@'
      },
      link: function (scope, element, attr) {
        scope.getContentUrl = (function(){
          if (['accountDd', 'transferTo', 'transferFrom'].indexOf(scope.type) !== -1){
            return '/ease-ui/dist/partials/dropdownAccountItem.html';
          }else if (scope.type === 'amountDd'){
            return '/ease-ui/dist/partials/dropdownAmountItem.html';
          }
        })();
        scope.stopPropagation = function(evt){
          evt.stopPropagation();
          evt.cancelBubble = true;
          return false;
        };
        scope.showSymbol = function() {
          if(scope.type === 'amountDd' && scope.item && scope.item.value.length > 0){
            return true;
          }else{
            return false;
          }
        };
        scope.showAmount = function(){
          if(scope.amountValue && scope.amountValue !== ''){
            return true;
          }else{
            return false;
          }
        };

        var buildDataItem = function(){
          if (scope.item !== null){
            scope['amountTypeId'] = scope.item.type;
            scope['amountType'] = scope.localize[scope.item.type];
            scope['amountValue'] = scope.item.value;
          }else{
            scope['amountTypeId'] = '';
            scope['amountType'] = '';
            scope['amountValue'] = '';
          }
        };
        var isOtherSelected = function(){
          var contInput = angular.element(element.find('span')[2]);
          if (typeof scope.amountType !== 'undefined' &&
              ['otherAmnt','principalOnly'].indexOf(scope.amountTypeId) !== -1){
            scope.$parent.isValid = false;
            contInput.addClass('showInput');
            contInput.removeClass('hideInput');
            var input = element.find('input');
            input[0].focus();
            input[0].value = '';
            scope.formatDollar='gray';
            input.bind('click', function(e){
              scope.$emit('EASE_DD_CLOSE_DROPDOWN');
            });
            input.bind('blur', function (e) {
              var valueInput = parseFloat(e.currentTarget.value).toFixed(2);
              if (!isNaN(valueInput)){
                scope.formatDollar='';
                scope.item.value = valueInput;
                e.currentTarget.value = valueInput;
                scope.item = scope.$parent.selectedItem;
              }
              scope.$emit('EASE_DD_DISPLAY_MSG',scope.service.isOtherAmountValid(valueInput));
            });
          }else{
            scope.formatDollar='';
            contInput.removeClass('showInput');
            contInput.addClass('hideInput');
            scope.$emit('EASE_DD_DISPLAY_MSG',{success:true});
          }
        };
        scope['localize'] = scope.$parent.localize;
        scope['accClass'] = 'selectedItem';
        scope['amntClass'] = 'infoSelectedItem hideInput';

        scope.$on('EASE_DD_ITEM_SELECTED', function(e, data){
          if (data.type === scope.type){
            scope.item = data.item;
            if (scope.$parent.service.setDropdownValue){
              scope.$parent.service.setDropdownValue(data.type, data.item);
            }
            if (scope.type === "amountDd"){
              scope.formatDollar='';
              buildDataItem();
              isOtherSelected();
            }else{
              if (scope.item && scope.item.referenceId && scope.item.referenceId.toString() !== '-1'){
                scope.$emit('EASE_DD_DISPLAY_MSG',{
                  success:true,
                  init:((typeof data.init !== 'undefined')? true:false)
                });
              }else{
                scope.$emit('EASE_DD_DISPLAY_MSG',{
                  success:false,
                  init:((typeof data.init !== 'undefined')? true:false)
                });
              }

            }
          }
        });

        if (scope.type === "amountDd"){
          buildDataItem();
          isOtherSelected();
        }

        element.on('$destroy', function(){
          scope.$destroy();
        })
      }
    };
  }]);

  easeDropdownModule.directive('easeDropdownItems', ["$rootScope", function ($rootScope) {
    return {
      restrict: 'AE',
      template: '<div ng-include="getContentUrl"></div>',
      scope:{
        item:'=',
        type:'=',
        service:'=',
        idIndex: '@',
        lengthItem:'@'
      },
      link: function (scope, element, attr) {
        scope.getContentUrl = (function(){
          if (['accountDd', 'transferTo', 'transferFrom'].indexOf(scope.type) !== -1){
            return '/ease-ui/dist/partials/dropdownAccountItem.html';
          }else if (scope.type === 'amountDd'){
            return '/ease-ui/dist/partials/dropdownAmountItem.html';
          }
        })();

        scope['localize'] = scope.$parent.localize;
        scope['accClass'] = 'ddTitle';
        scope['accountNameClass'] = 'accountName';
        scope['amntClass'] = 'ddAmount';
        scope.selectItem = function(item, evt){
          $rootScope.$broadcast('EASE_DD_ITEM_SELECTED', {type: scope.type, item:item});

        };

        if (scope.type === "amountDd"){
          scope['typeId'] = scope.item.type;
          scope['amountType'] = scope.localize[scope.item.type];
          scope['amountValue'] = scope.item.value;
        }
        scope.showSymbol = function(){
          if (scope['amountValue'].length > 0){
            return true;
          }else{
            return false;
          }
        };
        scope.showAmount = function(){
          if(scope.amountValue && scope.amountValue !== ''){
            return true;
          }else{
            return false;
          }
        };
        element.on('$destroy', function(){
          scope.$destroy();
        })
      }
    };
  }]);

  easeDropdownModule.directive('clickOutside', ['$document', 'EASEUtilsFactory', function($document, EASEUtilsFactory){
    return {
      restrict: 'A',
      scope: {
        clickOutside: '&'
      },
      link: function ($scope, elem, attr) {
        var classList = (attr.outsideIfNot !== undefined) ? attr.outsideIfNot.replace(', ', ',').split(',') : [];
        if (attr.id !== undefined) classList.push(attr.id);

        $document.on('click', function (e) {
          EASEUtilsFactory.DisplayTooltip(false);
          var i = 0,
            element;

          if (!e.target) return;

          for (element = e.target; element; element = element.parentNode) {
            var id = element.id;
            var classNames = element.className;

            if (id !== undefined) {
              for (i = 0; i < classList.length; i++) {
                if (id.indexOf(classList[i]) > -1 || classNames.indexOf(classList[i]) > -1) {
                  return;
                }
              }
            }
          }

          $scope.$eval($scope.clickOutside);
        });
      }
    };
  }]);

  return easeDropdownModule;
});

define('dropdown',['angular', 'easeDropdownModule'], function(angular) {
  'use strict';

  var easeDropdownModule = angular.module('easeDropdownModule');
  easeDropdownModule.directive('dropdown', ['$document', function($document) {
    var dropdownCloseHandlers = [];

    return {
      restrict: 'AE',
      replace: true,
      scope: {
        datasourceFunction: '&',
        ngModel: '=',
        placeholder: '@',
        widgetId: '=widgetId',
        displayField: '@',
        onSelectFunction: '&',
        selectedItem: '@'
      },
      templateUrl: '/ease-ui/dist/partials/simpleDropdown.html',
      link: function(scope, element) {
        var menuNode = element.find('ul');
        scope.datasource = scope.datasourceFunction();

        if (scope.selectedItem === "true") {
          scope.ngModel = scope.datasource[0];
        }
        scope.close = true;
        scope.open = false;

        var closeDropdown = function() {
          if (scope.open) {
            scope.close = true;
            scope.open = false;
            if (scope.lastFocus) {
              scope.lastFocus.focus();
            }
          }
        };

        var closeDropdownOnClick = function() {
          scope.$evalAsync(function() {
            scope.close = true;
            scope.open = false;
          });
        }

        scope.openDropdown = function(event) {
          if (scope.close) {
            scope.open = true;
            scope.close = false;
            scope.selectedItemIndex = findSelectedItemIndex();
            highlightSelected(scope.selectedItemIndex);
            event.stopPropagation();

            // only one drop down should be opened, close other opened drop downs
            dropdownCloseHandlers.forEach(function(fn) {
              if (fn !== closeDropdownOnClick) {
                fn();
              }
            });
          }
        };

        scope.select = function(item, event) {
          scope.ngModel = item;
          scope.onSelectFunction({ 'item': item, 'event': event });
          closeDropdown();
          event.stopPropagation();
          event.preventDefault();
        };

        var findSelectedItemIndex = function() {
          if (!scope.datasource) {
            return 0;
          }
          for (var i = 0; i < scope.datasource.length; i++) {
            if (angular.equals(scope.ngModel, scope.datasource[i])) {
              return i;
            }
          }
          return 0;
        };

        var highlightSelected = function(index, liElements) {
          if (!liElements) {
            liElements = menuNode.find('li');
          }
          liElements.removeClass('hover-focus');
          angular.element(liElements[index]).addClass('hover-focus');
          if (scope.datasource && scope.datasource.length) {
            angular.element(liElements[index]).find('div')[0].focus();
          }
        };

        var moveFocusItem = function(way) {
          var liElements = menuNode.find('li');
          if (way === 'up') {
            scope.selectedItemIndex -= 1;
          } else if (way === 'down') {
            scope.selectedItemIndex += 1;
          }
          if (scope.selectedItemIndex < 0) {
            scope.selectedItemIndex = liElements.length - 1;
          } else if (scope.selectedItemIndex > liElements.length - 1) {
            scope.selectedItemIndex = 0;
          }
          highlightSelected(scope.selectedItemIndex, liElements);
        };

        element.bind('keydown keypress', function(event) {
          var charCode = event.keyCode || event.which || event.charCode;
          if (scope.open) {
            if (charCode === 27) {
              // escape
              closeDropdown();
            } else if (charCode === 38) {
              // up arrow
              moveFocusItem('up');
            } else if (charCode === 40 || charCode === 9) {
              // down arrow or tab
              moveFocusItem('down');
            } else if (charCode === 32 || charCode === 13) {
              // space or enter
              scope.select(scope.datasource[scope.selectedItemIndex], event);
              if (scope.lastFocus) {
                scope.lastFocus.focus();
              }
            } else {
              return true;
            }
          } else {
            if (charCode === 32 || charCode === 13 || charCode === 40) {
              scope.lastFocus = document.activeElement;
              scope.openDropdown(event);
            } else {
              return true;
            }
          }
          event.stopPropagation();
          event.preventDefault();
          scope.$apply();
          return false;
        });

        $document.on('click', closeDropdownOnClick);
        dropdownCloseHandlers.push(closeDropdownOnClick);
        element.on('$destroy', function() {
          dropdownCloseHandlers = [];
        });

      }
    };
  }]);

  return easeDropdownModule;
});

define('easeAccordion',['angular'], function (angular) {
  'use strict';

  angular
      .module('easeAccordion', [])
      .controller('accordionController', accordionController)
      .directive('easeAccordion', accordionDirective)
      .directive('accordionDrawer', accordionDrawerDirective)
      .directive('stopEventProp', stopEventPropDirective);

  function accordionController() {

    var vm = this;
    var openIndices = [];

    angular.extend(vm, {
      getDrawerClass : getDrawerClass,
      isOpen: isOpen,
      setOpenIndex: setOpenIndex
    });

    //TODO: DEPRECATED If currently using, please use isOpen and directive high changes for opening and closing.
    function getDrawerClass(index) {
      if (isOpen(index)) {
        return "childOpen"
      }
    }
    function isOpen(testIndex) {
      return openIndices.indexOf(testIndex) > -1
    }

    function setOpenIndex(index) {
      //TODO: Revisit for possible optimization
      if(isOpen(index)) {
        var currentIndex = openIndices.indexOf(index);
        openIndices.splice(currentIndex, 1);
        return;
      }
      if (this.onlyOpenOne) {
        openIndices[0] = index;
      } else {
        openIndices.push(index);
      }
    }
  }

  function accordionDirective() {

    return {
      restrict: 'AE',
      bindToController: true,
      controller: 'accordionController',
      controllerAs: 'accordionVM',
      scope: {
        accordionElements: '=',
        onlyOpenOne: '=',
        accordionParent: '='
      },
      templateUrl: function getTemplate($element, $attrs) {
        if ($attrs.templateOverride) {
          return $attrs.templateOverride;
        }
        return '/ease-ui/dist/partials/accordion.html';
      }
    };
  }

  accordionDrawerDirective.$inject = ['$parse', '$animate'];
  function accordionDrawerDirective($parse, $animate) {
    return{
      restrict: 'AE',
      link : function(scope, element, attr) {

        var stillOpen = false;
        var initialized = false;
        var accordionOpenCallback = $parse(attr.accordionOpen);
        var accordionCloseCallback = $parse(attr.accordionClose);

        scope.$watch(attr.isOpen, function(elementOpen){
          if(elementOpen) {
            stillOpen = true;
            openDrawer();
            accordionOpenCallback(scope);
          }
          else {
            closeDrawer();
            if(initialized) {
                accordionCloseCallback(scope);
            } else {
            	initialized = true;
            }
            stillOpen = false;
          }
        });

        function openDrawer() {

          var start = {height: 0};
          var end = {height: element[0].scrollHeight + 'px'};

          element
              .attr('aria-expanded', true)
              .attr('aria-hidden', false);

          $animate.animate(element, start, end).then(expandDone)

        }

        function expandDone() {
          element.css({height: 'auto'});
        }

        function closeDrawer() {
          if(stillOpen) {

            var start = {height: element[0].scrollHeight + 'px'};
            var end = {height: 0, animate: '0.75 linear'};

            element
                .attr('aria-expanded', false)
                .attr('aria-hidden', true);

            $animate.animate(element, start, end).then(collapseDone)
          }
        }

        function collapseDone() {
          element.css({height: '0'});
        }
      }
    }
  }

  function stopEventPropDirective() {
    return {
      restrict: 'A',
      link: function (scope, element, attr) {
        element.bind('click', function (e) {
          e.stopPropagation();
        });
      }
    }
  }

});


define('easeGoogleMap',['angular'], function(angular) {
  'use strict';

  var GoogleMapsModule = angular.module('easeGoogleMap', ['ui.router', 'EaseProperties']);

  GoogleMapsModule.controller('mapController', ["$state", "$scope", function($state, $scope) {
    var vm = this;
    angular.extend(this, {
      getMapUri : getMapUri
    })

    function getCoordinates(location){
      var address;
      var coordinates;

      if(location.addressLine2) {
        address = encodeURIComponent(location.addressLine1 + ',' + location.addressLine2);
      } else {
        address = encodeURIComponent(location.addressLine1);
      }

      if(location.hasOwnProperty('locality') && location.hasOwnProperty('regionCode')) {
        coordinates = address + '+' +  location.locality + '+' + location.regionCode + '+'  +  location.postalCode + '+' + location.countryCode;
      } else {
        coordinates = address + '+' + location.city + '+' + location.stateCode + '+' +  location.postalCode + '+' + location.countryCode;
      }
      return coordinates;
    }

    function getMapUri(location) {
      var url = '';
      if(location) {
        var apiBaseUrl = 'https://maps.googleapis.com/maps/api/staticmap?center=';
        var coordinates = getCoordinates(location);
        var zoom = '&zoom=12';
        var size = '&size=400x250';
        var marker = '&markers=' + coordinates;
        var maptype = '&maptype=road&mobile=true';
        var key = '&key=gme-capitaloneservices1';
        url = apiBaseUrl + coordinates + zoom + size + marker + maptype;
      }
      return url;
    }
  }]);

  GoogleMapsModule.controller('mapModalController', ["$state", "$scope", "$stateParams", "$sce", "EaseConstant", function($state, $scope, $stateParams, $sce, EaseConstant) {
    var vm = this;

    angular.extend(this, {
      initialize : initialize,
      getMerchantLogo : getMerchantLogo,
      getMerchantName : getMerchantName,
      getMerchantAddress : getMerchantAddress,
      goToGoogleMaps : goToGoogleMaps,
      changeView : changeView,
      showStreetView : showStreetView,
      onMapView : true, // true when user is viewing map, false when user is viewing street
      hasStreetView : true,
      merchant: $stateParams['merchant'],
      location: $stateParams['location'],

      close: function() {
        $state.go('^');
      },

      initClose: false,
      modalType: 'mapModal'
    });

    if (!$stateParams.merchant || !$stateParams.location) {
      this.close();
    }

    function initialize(merchant) {
      if (merchant && merchant.geoLocation) {
        var latitude = parseFloat(merchant.geoLocation.latitude);
        var longitude = parseFloat(merchant.geoLocation.longitude);
        var latLng = {lat: latitude, lng: longitude};
        if (vm.onMapView) {
          var map = new google.maps.Map(document.getElementById('map'), {
            center: latLng,
            zoom: 12
          });
          var marker = new google.maps.Marker({
            position: latLng,
            map: map
          });
        } else {
          var street = new google.maps.StreetViewPanorama(document.getElementById('street'), {
            position: latLng,
            pov: {
              heading: 0,
              pitch: 0
            }
          });
        }
      }
    }

    function getMerchantLogo(merchant) {
      var logoURL;
      if (merchant) {
        if (merchant.logo) {
          logoURL = merchant.logo;
        } else if (merchant.logoURL) {
          logoURL = merchant.logoURL.href;
        }
        return logoURL;
      }
    }

    function getMerchantName(merchant) {
      if (merchant) {
        return merchant.name;
      }
    }

    function getMerchantAddress(location) {
      var addressLine;
      var address;
      if (location) {
        if (location.addressLine2) {
          addressLine = location.addressLine1 + " " + location.addressLine2;
        } else {
          addressLine = location.addressLine1;
        }
        if (location.hasOwnProperty('locality') && location.hasOwnProperty('regionCode')) {
          address = addressLine + ", " + location.locality + ", " + location.regionCode + " " + location.postalCode;
        } else {
          address = addressLine + ", " + location.city + ", " + location.stateCode + " " + location.postalCode;
        }
        return address;
      }
    }

    function goToGoogleMaps(location) {
      if (location) {
        return EaseConstant.googleMaps.kMapUrl + getCoordinates(location);
      }
    }

    function changeView() {
      vm.onMapView = !vm.onMapView;
    }

    function showStreetView(merchant) {
      if (merchant && merchant.geoLocation) {
        var latitude = parseFloat(merchant.geoLocation.latitude);
        var longitude = parseFloat(merchant.geoLocation.longitude);
        var latLng = {lat: latitude, lng: longitude};
        var checkStreetView = new google.maps.StreetViewService();
        checkStreetView.getPanoramaByLocation(latLng, 50, function(streetViewPanoramaData, status) {
          if (status === google.maps.StreetViewStatus.OK) {
            vm.hasStreetView = true;
          } else {
            vm.hasStreetView = false;
          }
        });
      }
    }

    function getCoordinates(location){
      var address;
      var coordinates;

      if(location.addressLine2) {
        address = encodeURIComponent(location.addressLine1 + ',' + location.addressLine2);
      } else {
        address = encodeURIComponent(location.addressLine1);
      }

      if(location.hasOwnProperty('locality') && location.hasOwnProperty('regionCode')) {
        coordinates = address + '+' +  location.locality + '+' + location.regionCode + '+'  +  location.postalCode + '+' + location.countryCode;
      } else {
        coordinates = address + '+' + location.city + '+' + location.stateCode + '+' +  location.postalCode + '+' + location.countryCode;
      }
      return coordinates;
    }

  }]);

  GoogleMapsModule.directive('easeGoogleMap', function() {
    return {
      restrict: 'AE',
      bindToController: true,
      controller: 'mapController',
      controllerAs : 'mapVM',
      scope : {
        merchant : '=',
        location : '=',
        load : '='
      },
      template : '<span data-ng-if="mapVM.location" class="map-container"><img ui-sref="map({merchant:mapVM.merchant, location:mapVM.location})" data-ng-src={{mapVM.getMapUri(mapVM.location)}}></span>'
    }
  });

  return GoogleMapsModule;

});

define('accountServices',['angular'], function (angular) {
  'use strict'

  var accountServiceModule = angular.module('accountServicesModule', [])
    .controller('AccountServicesCtrl', AccountServicesCtrl)
    .factory('AccountServicesModel', AccountServicesModel)

  function AccountServicesCtrl ($scope, $state, AccountServicesModel) {
    // this.accountServices = accountServicesData
    var accountServicesCtrl = this
    // Controller properties
    angular.extend(accountServicesCtrl, {
      initClose: false,
      // Replace with actual icon when we get one..
      modalClass: 'icon-account-services',
      modalType: 'accountServicesPane'
    })

    // Controller methods
    angular.extend(accountServicesCtrl, {
      close: function () {
        $state.go('^')
      },
      getServiceId: function (index, title) {
        // Remove all spaces, Id attribute should not have spaces.
        title = title.replace(/\s+/g, '')
        return title + index
      }
    })

    // Get the data and give it controller
    accountServicesCtrl.accountServicesData = AccountServicesModel.getListOfAccountServices()
  }
  AccountServicesCtrl.$inject = ["$scope", "$state", "AccountServicesModel"];

  function AccountServicesModel () {
    return {
      // Retrive available account services related to given account
      getListOfAccountServices: function () {
        // [TODO][SD]: This should vary from each LoB or account. Right now there is no API for this.
        var accountServices = [{
          'title': 'Document',
          'services': ['Statements', 'Download Transactions', 'Reward Summary', 'Credit Card Agreement']
        }, {
          'title': 'Payment Settings',
          'services': ['Manage Auto Pay', 'Payment Accounts', 'Change Due Date', 'Secured Credit Deposit']
        }, {
          'title': 'Account Management',
          'services': ['Activate a Card', 'Combine two Accounts', 'Authorized Users', 'Update Income', 'Overlimit Preferences', 'Mobile 2 way', 'Close Account']
        }, {
          'title': 'Upgrades',
          'services': ['Credit Line Increase', 'Balance Transfer', 'Image Card', 'Swap Card']
        }, {
          'title': 'Security',
          'services': ['Report Lost, Stolen or damaged card', 'Set Travel Notification', 'Electronic Fraud Information(eFIF)']
        }]
        return accountServices
      }
    }
  }

  return accountServiceModule
});
define('easeModal',['angular'], function () {
  'use strict';
  var EaseModalService = angular.module('EaseModalModule',[])
    .factory('EaseModalService', ['$document', '$compile', '$rootScope', '$timeout',
      function ($document, $compile, $rootScope,  $timeout) {

        var body = $document.find('body'), scope;
        return function Dialog(templateUrl/*optional*/, options, passedInLocals) {
          var lastFormElement = null;
          var firstFormElement = null;
          var pageContent = $document[0].getElementById('page-content');

          /* attrElem = 'lastElementChild' or 'firstElementChild'*/
          var findElementChild = function(elem, attrElem){
            if (typeof elem !== 'undefined'){
              if (elem[attrElem] !== undefined && elem[attrElem] != null ){
                if (elem[attrElem].className === 'form-container'){
                  return findElementChild(elem[attrElem],'lastElementChild');
                }else if (elem[attrElem].className !== undefined && elem[attrElem].className.indexOf('easeDdContainer') !== -1){
                  return elem['firstElementChild'];
                } else {
                  return findElementChild(elem[attrElem],attrElem);
                }
              } else {
                return elem;
              }
            }
          };

          // Handle arguments if optional template isn't provided.
          if(angular.isObject(templateUrl)){
            passedInLocals = options;
            options = templateUrl;
          } else {
            options.templateUrl = templateUrl;
          }

          var modalBody = (function(){
            if(options.template){
              if(angular.isString(options.template)){
                return '<div class="modal hidden clip generic">' + options.template + '</div>';
              } else {
                return '<div class="modal hidden clip generic">' + options.template.html() + '</div>';
              }
            } else {
              return '<div data-ng-include="\'' + options.templateUrl + '\'"></div>'
            }
          })();

          var modalEl = angular.element(
            '<div>' +
            modalBody +
            '</div>');

          var closeFn = function () {
            modalEl.removeClass('fade');
            if (pageContent) {
              pageContent.setAttribute('aria-hidden', 'false');
            }
            $timeout(function(){
              modalEl.remove();
            }, 300)
          };

          if (options.scope){
            scope = options.scope
          }else{
            scope = $rootScope.$new();
            //bind your controller object here
            options.hasOwnProperty('controller') ? scope.controller = options.controller : angular.noop();
          };

          scope.$modalCancel = function () {
            if(scope.hasOwnProperty('controller')) {
              scope.controller.closeModal();
            }
            closeFn.call(this);
          };

          $rootScope.$on('logout', function () {
            closeFn();
          });

          $compile(modalEl)(scope);
          body.append(modalEl);
          if (pageContent) {
            pageContent.setAttribute('aria-hidden', 'true');
          }

          $timeout(function() {
            if (firstFormElement == null){
              firstFormElement = findElementChild(modalEl.find('form')[0], 'firstElementChild');
            }

            if(firstFormElement) {
              firstFormElement.focus();
            }
          }, 200);

          $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams){
            if(toState.name !== fromState.name){
              closeFn();
            }
          });
        };
      }])
      .directive('easeModal', ['$document', '$timeout',
        function($document, $timeout) {
          return {
            restrict: 'A',
            transclude: true,
            scope: {
              modalRole: '=?',
              modalType: '=',
              modalClass: '=',
              focusId: '=',
              initClose: '=',
              toggleClose: '&',
              deleteModal: '=',
              isBlur: '=?',
              modalLoadingClass: '=?'
            },
            link: function(scope, element) {
              scope.focusId = scope.focusId || 'closeModal';
              $timeout(function() {
                scope.lastFocus = document.activeElement;
                scope.on = true;
                $timeout(function() {
                 element[0].getElementsByClassName('close-dialog')[0].focus();
                }, 100);
              }, 100);

              scope.$watch('initClose', function() {
                if(scope.initClose) {
                  scope.closeModal();
                }
              });

              scope.$watch('deleteModal', function() {
                if(scope.deleteModal) {
                  $timeout(function () {
                    element.remove();
                  }, 200)
                }
              });

              // [TODO][SD] Bring back the focus This is not working
              scope.closeModal = function() {
                scope.on = !scope.on;
                var ev = new CustomEvent('easeUiModalClose');
                dispatchEvent(ev);
                // if(typeof scope.focusId !== 'undefined' && scope.focusId !== '') {
                //   document.getElementById(scope.focusId).focus();
                // }
                // document.body.className = '';
                scope.toggleClose();
                if(scope.lastFocus){
                  scope.lastFocus.focus();
                }
              };

              var shiftTabPress = false;

              element.on('keydown', function(event) {
                if(event.which === 27) {
                  scope.$apply(function() {
                    scope.closeModal();
                  });
                  element.off('keydown');
                  event.preventDefault();
                }

                if(event.which === 9 && !event.shiftKey ) {
                  shiftTabPress = false;
                  angular.element(element[0].getElementsByClassName('modalEnd')[0]).on('focus',function(){
                      if(!shiftTabPress){
                       element[0].getElementsByClassName('close-dialog')[0].focus();
                      }
                  });
                }

                if (event.which === 9 && event.shiftKey) {
                  shiftTabPress = true;

                  if(element[0].getElementsByClassName('close-dialog')[0] === event.target){
                    event.preventDefault();
                    element[0].getElementsByClassName('modalEnd')[0].focus();
                  }
                }
              });
            },
            templateUrl: '/ease-ui/dist/partials/open-modal.html'
          }
      }]);
  return EaseModalService;
});

define('easeLocalize',['angular'], function(angular) {
  'use strict';
  var EaseLocalizeService = angular.module('EaseLocalizeModule', [])
    .factory('EaseLocalizeService', ['$q', '$http', '$locale', 'EaseConstant',
      function($q, $http, $locale, EaseConstant) {
        var i18nData = null,
          lobData = null,
          httpPromise = null;
        return {
          promise: httpPromise,
          get: function(attr, lob) {
            var deferred = $q.defer(),
              resource = (lob) ? '/ease-ui/bower_components/' + lob + '/utils/i18n/resources-locale_' + $locale.id +
              '.json' : '/ease-ui' + EaseConstant.kBuildVersionPath + '/dist/utils/components/i18n/resources-locale_' +
              $locale.id + '.json';
            if (lob || i18nData === null) {
              httpPromise = $http.get(resource);
              httpPromise.then(function(response) {
                if (lob) {
                  lobData = response.data;
                  deferred.resolve(lobData[attr]);
                } else {
                  i18nData = response.data;
                  deferred.resolve(i18nData[attr]);
                }
              }, function(error) {
                console.log("i18n File not found");
              });
            } else {
              if (lob) {
                deferred.resolve(lobData[attr]);
              } else {
                deferred.resolve(i18nData[attr]);
              }
            }
            return deferred.promise;
          }
        };
      }
    ]);
  return EaseLocalizeService;
});

define('EaseTooltip',['angular'], function (angular) {
  'use strict'

  angular.module('Easetooltip', [])
    // .run(["$templateCache", function($templateCache) {
    //  $templateCache.put("template/tooltip/tooltip-html-unsafe-popup.html",
    //    "<div class=\"tooltip {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
    //    "  <div class=\"tooltip-arrow\"></div>\n" +
    //    "  <div class=\"tooltip-inner\" bind-html-unsafe=\"content\"></div>\n" +
    //    "</div>\n" +
    //    "")
    //
    //  $templateCache.put("template/tooltip/tooltip-popup.html",
    //    "<div class=\"tooltip {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
    //    "  <div class=\"tooltip-arrow\"></div>\n" +
    //    "  <div class=\"tooltip-inner\" ng-bind=\"content\"></div>\n" +
    //    "</div>\n" +
    //    "")
    //
    // }])
    /**
     * The $tooltip service creates tooltip- and popover-like directives as well as
     * houses global options for them.
     */
    .provider('$tooltip', function () {
      // The default options tooltip and popover.
      var defaultOptions = {
        placement: 'top',
        animation: true,
        popupDelay: 0
      }

      // Default hide triggers for each show trigger
      var triggerMap = {
        'mouseenter': 'mouseleave',
        'click': 'click',
        'focus': 'blur'
      }

      // The options specified to the provider globally.
      var globalOptions = {}

      /**
       * `options({})` allows global configuration of all tooltips in the
       * application.
       *
       *   var app = angular.module( 'App', ['ui.bootstrap.tooltip'], function( $tooltipProvider ) {
   *     // place tooltips left instead of top by default
   *     $tooltipProvider.options( { placement: 'left' } )
   *   })
       */
      this.options = function (value) {
        angular.extend(globalOptions, value)
      }

      /**
       * This allows you to extend the set of trigger mappings available. E.g.:
       *
       *   $tooltipProvider.setTriggers( 'openTrigger': 'closeTrigger' )
       */
      this.setTriggers = function setTriggers (triggers) {
        angular.extend(triggerMap, triggers)
      }

      /**
       * This is a helper function for translating camel-case to snake-case.
       */
      function snake_case (name) {
        var regexp = /[A-Z]/g
        var separator = '-'
        return name.replace(regexp, function (letter, pos) {
          return (pos ? separator : '') + letter.toLowerCase()
        })
      }

      /**
       * Returns the actual instance of the $tooltip service.
       * TODO support multiple triggers
       */
      this.$get = [ '$window', '$compile', '$timeout', '$document', '$positionTool', '$interpolate', 'EASEUtilsFactory', '$rootScope', function ($window, $compile, $timeout, $document, $positionTool, $interpolate, EASEUtilsFactory , $rootScope) {
        return function $tooltip (type, prefix, defaultTriggerShow) {
          var options = angular.extend({}, defaultOptions, globalOptions)
          var value = false
          /**
           * Returns an object of show and hide triggers.
           *
           * If a trigger is supplied,
           * it is used to show the tooltip; otherwise, it will use the `trigger`
           * option passed to the `$tooltipProvider.options` method; else it will
           * default to the trigger supplied to this directive factory.
           *
           * The hide trigger is based on the show trigger. If the `trigger` option
           * was passed to the `$tooltipProvider.options` method, it will use the
           * mapped trigger from `triggerMap` or the passed trigger if the map is
           * undefined; otherwise, it uses the `triggerMap` value of the show
           * trigger; else it will just use the show trigger.
           */
          function getTriggers (trigger) {
            var show = trigger || options.trigger || defaultTriggerShow
            var hide = triggerMap[show] || show
            return {
              show: show,
              hide: hide
            }
          }

          var directiveName = snake_case(type)

          var startSym = $interpolate.startSymbol()
          var endSym = $interpolate.endSymbol()
          var template =
          '<div ' + directiveName + '-popup ' +
            'title="' + startSym + 'title' + endSym + '" ' +
            'content="' + startSym + 'content' + endSym + '" ' +
            'placement="' + startSym + 'placement' + endSym + '" ' +
            'animation="animation" ' +
            'is-open="isOpen"' +
            '>' +
            '</div>'

          return {
            restrict: 'EA',
            // controller: function($scope, $element, $attrs) {
            //
            //  this.addApple = function() {
            //    console.log('hi this is inside directive')
            //  }
            // },
            compile: function (tElem, tAttrs) {
              var tooltipLinker = $compile(template)

              return function link (scope, element, attrs) {
                var tooltip
                var tooltipLinkedScope
                var transitionTimeout
                var popupTimeout
                var appendToBody = angular.isDefined(options.appendToBody) ? options.appendToBody : false
                var triggers = getTriggers(undefined)
                var hasEnableExp = angular.isDefined(attrs[prefix + 'Enable'])
                var ttScope = scope.$new(true)

                var positionTooltip = function () {
                  var ttPosition = $positionTool.positionElements(element, tooltip, ttScope.placement, appendToBody)
                  ttPosition.top += 'px'
                  ttPosition.left += 'px'

                  // Now set the calculated positioning.
                  tooltip.css(ttPosition)
                }

                // By default, the tooltip is not open.
                // TODO add ability to start tooltip opened
                ttScope.isOpen = false

                function toggleTooltipBind () {
                  if (! ttScope.isOpen) {
                    showTooltipBind()
                  } else {
                    hideTooltipBind()
                  }
                }

                // Show the tooltip with delay if specified, otherwise show it immediately
                function showTooltipBind () {
                  if (hasEnableExp && !scope.$eval(attrs[prefix + 'Enable'])) {
                    return
                  }

                  prepareTooltip()

                  if (ttScope.popupDelay) {
                    // Do nothing if the tooltip was already scheduled to pop-up.
                    // This happens if show is triggered multiple times before any hide is triggered.
                    if (!popupTimeout) {
                      popupTimeout = $timeout(show, ttScope.popupDelay, false)
                      popupTimeout.then(function (reposition) {reposition();})
                    }
                  } else {
                    show()()
                  }
                }

                function hideTooltipBind () {
                  if ($rootScope.$root.$$phase != '$apply' && $rootScope.$root.$$phase != '$digest') {
                    scope.$apply(function () {
                      hide()
                    })
                  } else {
                    hide()
                  }
                }

                // Show the tooltip popup element.
                function show () {
                  popupTimeout = null

                  // If there is a pending remove transition, we must cancel it, lest the
                  // tooltip be mysteriously removed.
                  if (transitionTimeout) {
                    $timeout.cancel(transitionTimeout)
                    transitionTimeout = null
                  }

                  // Don't show empty tooltips.
                  if (! ttScope.content) {
                    return angular.noop
                  }

                  createTooltip()

                  // Set the initial positioning.
                  if ($rootScope.$root.$$phase != '$apply' && $rootScope.$root.$$phase != '$digest') {
                    tooltip.css({ top: 0, left: 0, display: 'block' })
                    ttScope.$digest()
                  } else {
                    tooltip.css({ top: 0, left: 0, display: 'block' })
                  }

                  positionTooltip()

                  // And show the tooltip.
                  if ($rootScope.$root.$$phase != '$apply' && $rootScope.$root.$$phase != '$digest') {
                    ttScope.isOpen = true
                    ttScope.$digest(); // digest required as $apply is not called
                  } else {
                    ttScope.isOpen = true
                  }

                  // Return positioning function as promise callback for correct
                  // positioning after draw.
                  return positionTooltip
                }

                // Hide the tooltip popup element.
                function hide () {
                  // First things first: we don't show it anymore.
                  ttScope.isOpen = false

                  // if tooltip is going to be shown after delay, we must cancel this
                  $timeout.cancel(popupTimeout)
                  popupTimeout = null

                  // And now we remove it from the DOM. However, if we have animation, we
                  // need to wait for it to expire beforehand.
                  // FIXME: this is a placeholder for a port of the transitions library.
                  if (ttScope.animation) {
                    if (!transitionTimeout) {
                      transitionTimeout = $timeout(removeTooltip, 500)
                    }
                  } else {
                    removeTooltip()
                  }
                }

                function createTooltip () {
                  // There can only be one tooltip element per directive shown at once.
                  if (tooltip) {
                    removeTooltip()
                  }
                  tooltipLinkedScope = ttScope.$new()
                  tooltip = tooltipLinker(tooltipLinkedScope, function (tooltip) {
                    if (appendToBody) {
                      $document.find('body').append(tooltip)
                    } else {
                      element.after(tooltip)
                    // document.getElementById(element[0].id).appendChild(tooltip[0])
                    // element[0].appendChild(tooltip[0])
                    }
                  })
                }

                function removeTooltip () {
                  transitionTimeout = null
                  if (tooltip) {
                    tooltip.remove()
                    tooltip = null
                  }
                  if (tooltipLinkedScope) {
                    tooltipLinkedScope.$destroy()
                    tooltipLinkedScope = null
                  }
                }

                function prepareTooltip () {
                  prepPlacement()
                  prepPopupDelay()
                }

                /**
                 * Observe the relevant attributes.
                 */
                attrs.$observe(type, function (val) {
                  ttScope.content = val

                  if (!val && ttScope.isOpen) {
                    hide()
                  }
                })

                attrs.$observe(prefix + 'Title', function (val) {
                  ttScope.title = val
                })

                function prepPlacement () {
                  var val = attrs[ prefix + 'Placement' ]
                  ttScope.placement = angular.isDefined(val) ? val : options.placement
                }

                function prepPopupDelay () {
                  var val = attrs[ prefix + 'PopupDelay' ]
                  var delay = parseInt(val, 10)
                  ttScope.popupDelay = ! isNaN(delay) ? delay : options.popupDelay
                }

                var unregisterTriggers = function () {
                  element.unbind(triggers.show, showTooltipBind)
                  element.unbind(triggers.hide, hideTooltipBind)
                }

                function prepTriggers () {
                  var val = attrs[ prefix + 'Trigger' ]
                  unregisterTriggers()

                  triggers = getTriggers(val)

                  if (triggers.show === triggers.hide) {
                    element.bind(triggers.show, toggleTooltipBind)
                  } else {
                    element.bind(triggers.show, showTooltipBind)
                    element.bind(triggers.hide, hideTooltipBind)
                  }
                }
                prepTriggers()

                var animation = scope.$eval(attrs[prefix + 'Animation'])
                ttScope.animation = angular.isDefined(animation) ? !!animation : options.animation

                var appendToBodyVal = scope.$eval(attrs[prefix + 'AppendToBody'])
                appendToBody = angular.isDefined(appendToBodyVal) ? appendToBodyVal : appendToBody

                // if a tooltip is attached to <body> we need to remove it on
                // location change as its parent scope will probably not be destroyed
                // by the change.
                if (appendToBody) {
                  scope.$on('$locationChangeSuccess', function closeTooltipOnLocationChangeSuccess () {
                    if (ttScope.isOpen) {
                      hide()
                    }
                  })
                }

                // Make sure tooltip is destroyed and removed.
                scope.$on('$destroy', function onDestroyTooltip () {
                  $timeout.cancel(transitionTimeout)
                  $timeout.cancel(popupTimeout)
                  unregisterTriggers()
                  removeTooltip()
                  ttScope = null
                })

                scope.service = EASEUtilsFactory
                // scope.service = EASEConstant
                // watch the property
                scope.$watch('service.displayTooltip', function (newvalue, oldvalue) {
                  if (value !== newvalue) {
                    if (newvalue) {
                      ttScope.content = EASEUtilsFactory.tooltipmsg
                      showTooltipBind()
                    } else {
                      hideTooltipBind()
                    }
                  }
                  value = newvalue
                })
              }
            }
          }
        }
      }]
    })

    .directive('bindHtmlUnsafe', function () {
      return function (scope, element, attr) {
        element.addClass('ng-binding').data('$binding', attr.bindHtmlUnsafe)
        scope.$watch(attr.bindHtmlUnsafe, function bindHtmlUnsafeWatchAction (value) {
          element.html(value || '')
        })
      }
    })

    .directive('tooltipPopup', function () {
      return {
        restrict: 'EA',
        replace: true,
        scope: { content: '@', placement: '@', animation: '&', isOpen: '&' },
        // templateUrl: '/ease-ui/dist/features/UMMPayment/Partials/tooltipPopup.html'
        template: '<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">' +
          '<div class="tooltip-arrow"></div>' +
          '<div class="tooltip-inner" bind-html-unsafe="content"></div>' +
          '</div>'

      }
    })

    .directive('tooltip', [ '$tooltip', function ($tooltip) {
      return $tooltip('tooltip', 'tooltip', 'mouseenter')
    }])

    .directive('tooltipHtmlUnsafePopup', function () {
      return {
        restrict: 'EA',
        replace: true,
        scope: { content: '@', placement: '@', animation: '&', isOpen: '&' },
        // templateUrl: '/ease-ui/dist/features/UMMPayment/Partials/tooltipHtmlUnsafePopup.html'
        template: '<div class="tooltip {{placement}}" ng-class="{ in: isOpen(), fade: animation() }">' +
          '<div class="tooltip-arrow"></div>' +
          '<div class="tooltip-inner" bind-html-unsafe="content"></div>' +
          '</div>'
      }
    })

    .directive('tooltipHtmlUnsafe', [ '$tooltip', function ($tooltip) {
      return $tooltip('tooltipHtmlUnsafe', 'tooltip', 'mouseenter')
    }])

    .factory('$positionTool', ['$document', '$window', function ($document, $window) {
      function getStyle (el, cssprop) {
        if (el.currentStyle) { // IE
          return el.currentStyle[cssprop]
        } else if ($window.getComputedStyle) {
          return $window.getComputedStyle(el)[cssprop]
        }
        // finally try and get inline style
        return el.style[cssprop]
      }

      /**
       * Checks if a given element is statically positioned
       * @param element - raw DOM element
       */
      function isStaticPositioned (element) {
        return (getStyle(element, 'position') || 'static') === 'static'
      }

      /**
       * returns the closest, non-statically positioned parentOffset of a given element
       * @param element
       */
      var parentOffsetEl = function (element) {
        var docDomEl = $document[0]
        var offsetParent = element.offsetParent || docDomEl
        while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent)) {
          offsetParent = offsetParent.offsetParent
        }
        return offsetParent || docDomEl
      }

      return {
        /**
         * Provides read-only equivalent of jQuery's position function:
         * http://api.jquery.com/position/
         */
        position: function (element) {
          var elBCR = this.offset(element)
          var offsetParentBCR = { top: 0, left: 0 }
          var offsetParentEl = parentOffsetEl(element[0])
          if (offsetParentEl != $document[0]) {
            offsetParentBCR = this.offset(angular.element(offsetParentEl))
            offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop
            offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft
          }

          var boundingClientRect = element[0].getBoundingClientRect()
          return {
            width: boundingClientRect.width || element.prop('offsetWidth'),
            height: boundingClientRect.height || element.prop('offsetHeight'),
            top: elBCR.top - offsetParentBCR.top,
            left: elBCR.left - offsetParentBCR.left
          }
        },

        /**
         * Provides read-only equivalent of jQuery's offset function:
         * http://api.jquery.com/offset/
         */
        offset: function (element) {
          var boundingClientRect = element[0].getBoundingClientRect()
          return {
            width: boundingClientRect.width || element.prop('offsetWidth'),
            height: boundingClientRect.height || element.prop('offsetHeight'),
            top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
            left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
          }
        },

        /**
         * Provides coordinates for the targetEl in relation to hostEl
         */
        positionElements: function (hostEl, targetEl, positionStr, appendToBody) {
          var positionStrParts = positionStr.split('-')
          var pos0 = positionStrParts[0], pos1 = positionStrParts[1] || 'center'

          var hostElPos,
            targetElWidth,
            targetElHeight,
            targetElPos

          hostElPos = appendToBody ? this.offset(hostEl) : this.position(hostEl)

          targetElWidth = targetEl.prop('offsetWidth')
          targetElHeight = targetEl.prop('offsetHeight')

          var shiftWidth = {
            center: function () {
              return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2
            },
            left: function () {
              return (hostElPos.left + hostElPos.width) - targetElWidth
            },
            right: function () {
              return hostElPos.left + hostElPos.width
            }
          }

          var shiftHeight = {
            center: function () {
              return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2
            },
            top: function () {
              return hostElPos.top
            },
            bottom: function () {
              return hostElPos.top + hostElPos.height
            }
          // right: function(){
          //  return hostElPos.top - targetElHeight / 2
          // }
          }

          switch (pos0) {
            case 'right':
              targetElPos = {
                top: shiftHeight[pos1](),
                left: shiftWidth[pos0]()
              }
              break
            case 'left':
              targetElPos = {
                top: shiftHeight[pos1](),
                left: hostElPos.left - targetElWidth
              }
              break
            case 'bottom':
              targetElPos = {
                top: shiftHeight[pos0](),
                left: shiftWidth[pos1]()
              }
              break
            case 'topAmount':
              targetElPos = {
                top: - 74,
                left: shiftWidth[pos1]()
              }
              break
            default:
              targetElPos = {
                top: hostElPos.top - targetElHeight,
                left: shiftWidth[pos1]()
              }
              break
          }

          return targetElPos
        }
      }
    }])
});

define('EaseDatePicker',['angular'], function (angular) {
  'use strict'

  var app = angular.module('EaseDatePicker', ['EaseProperties'])

  app.run(['$templateCache', 'EaseConstant', function ($templateCache, EaseConstant) {
    $templateCache.put('template/datepicker/datepicker.html',
      '<div data-ng-switch="datepickerMode" role="application" data-ng-keydown="keydown($event)">\n' +
      '  <daypicker data-ng-switch-when="day" tabindex="0"></daypicker>\n' +
      '  <monthpicker data-ng-switch-when="month" tabindex="0"></monthpicker>\n' +
      '  <yearpicker data-ng-switch-when="year" tabindex="0"></yearpicker>\n' +
      '</div>')

    $templateCache.put('template/datepicker/day.html',
      '<table class=\'animateTable dateTable\' role="grid" aria-labelledby="{{uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n' +
      "  <thead style='background-color: rgba(236, 220, 233, 0.22); font-family: sans-serif'>\n" +
      '    <tr>\n' +
      '      <th scope="none"><button type="button" class="pull-left dateTableButton" aria-label="Previous Month" data-ng-click="move(-1)" tabindex="-1" id="scrollLeftButton"><img alt="" style=\'height: 12px;width: 12px\' src="/ease-ui' + EaseConstant.kBuildVersionPath + '/dist/images/prevMonth.png"></button></th>\n' +
      '      <th scope="none" colspan="{{5 + showWeeks}}"><button disabled="{{isDisabledMonths}}" data-ng-click="toggleMode()" id="{{uniqueId}}-title" class="pull-left dateTableHeaderButton" role="heading" aria-live="assertive" aria-atomic="true" type="button" tabindex="-1" ><strong>{{title}}</strong></button></th>\n' +
      '      <th scope="none"><button  type="button" class="pull-left dateTableButton" aria-label="Next Month" data-ng-click="move(1)" tabindex="-1" id="scrollRightButton"><img alt="" style=\'height: 12px;width: 12px\'  src="/ease-ui' + EaseConstant.kBuildVersionPath + '/dist/images/nextMonth.png"></i></button></th>\n' +
      '    </tr>\n' +
      '    <tr role="row">\n' +
      '      <th scope="col" data-ng-show="showWeeks" class="text-center"></th>\n' +
      '      <th scope="col" data-ng-repeat="label in labels track by $index" class="daysHeaderName" role="columnheader" ><small aria-label="{{label.full}}">{{label.abbr}}</small></th>\n' +
      '    </tr>\n' +
      '  </thead>\n' +
      '  <tbody role="row">\n' +
      '    <tr class=\'dateTableRow\' data-ng-repeat="row in rows track by $index">\n' +
      '      <td data-ng-show="showWeeks" class="text-center h6"><em>{{ weekNumbers[$index] }}</em></td>\n' +
      '      <td data-ng-repeat="dt in row track by dt.date" data-ng-class="dt.customClass" role="gridcell" id="{{dt.uid}}" aria-disabled="{{!!dt.disabled}}" >\n' +
      '        <button data-ng-if="!daysOfMonthOnly || !dt.secondary" data-ng-mouseover=\'btnMouseOver($event, dt)\' data-ng-mouseleave=\'btnMouseOut($event, dt)\' class="pull-left dateTableButton btn" type="button" data-ng-class="{\'btn-info\': dt.selected, \'text-due\': dt.isduedate, \'past-due\': dt.pastduedate, \'minpay-notmet\': dt.minpaynotmet, \'today\': dt.today, active: isActive(dt)} " data-ng-click="select(dt.date)" data-ng-disabled="dt.disabled" tabindex="-1">\n' +
      '        <span class=\'dateTableButtonSpan\' data-ng-class="{\'btn-label\': (dt.isStartDay || dt.isEndDay), \'text-info\': dt.current,  \'text-muted\': dt.secondary, \'text-due\': dt.isduedate }">{{dt.label}}</span>\n' +
      "        <span class='screen-reader'>{{title}}</span>\n" +
      '        <span data-ng-show="dt.current || dt.isduedate || dt.selected"  class="dateLabel" data-ng-class="{\'btn-label\': (dt.isStartDay || dt.isEndDay), \'btn-info\': dt.selected,\'text-info\': dt.current, \'text-due\': dt.isduedate, \'past-due\': dt.pastduedate }">{{ getDisplayText(dt.selected, dt.isduedate, dt.today, dt.pastduedate, dt.minpaynotmet) || dt.displayLabel }}</span></button>\n' +
      '      </td>\n' +
      '    </tr>\n' +
      '  </tbody>\n' +
      '</table>\n' +
      '')

    $templateCache.put('template/datepicker/month.html',
      '<table role="grid" aria-labelledby="{{uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n' +
      '  <thead>\n' +
      '    <tr>\n' +
      '      <th><button type="button" class="btn btn-default btn-sm pull-left" data-ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n' +
      '      <th><button id="{{uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm" data-ng-click="toggleMode()" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>\n' +
      '      <th><button type="button" class="btn btn-default btn-sm pull-right" data-ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n' +
      '    </tr>\n' +
      '  </thead>\n' +
      '  <tbody>\n' +
      '    <tr data-ng-repeat="row in rows track by $index">\n' +
      '      <td data-ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{dt.uid}}" aria-disabled="{{!!dt.disabled}}">\n' +
      '        <button type="button" style="width:100%;" class="btn btn-default" data-ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" data-ng-click="select(dt.date)" data-ng-disabled="dt.disabled" tabindex="-1"><span data-ng-class="{\'text-info\': dt.current}">{{dt.label}}</span></button>\n' +
      '      </td>\n' +
      '    </tr>\n' +
      '  </tbody>\n' +
      '</table>\n' +
      '')

    $templateCache.put('template/datepicker/popup.html',
      // "<ul class=\"dropdown-menu\" data-ng-style=\"{display: (isOpen && 'block') || 'none', top: (position.top)+'px', right: (position.left) +'px'}\" data-ng-keydown=\"keydown($event)\">\n" +
      '<ul class="dropdown-menu" data-ng-style="{display: (isOpen && \'block\') || \'none\', top: (position.top-302)+\'px\', right: (position.left) +\'px\'}" data-ng-keydown="keydown($event)">\n' +
      '  <li data-ng-transclude></li>\n' +
      '  <li data-ng-if="showButtonBar" style="padding:10px 9px 2px">\n' +
      '   <span class="btn-group pull-left">\n' +
      '    <button type="button" class="btn btn-sm btn-info" data-ng-click="select(\'today\')">{{ getText(\'current\') }}</button>\n' +
      '    <button type="button" class="btn btn-sm btn-danger" data-ng-click="select(null)">{{ getText(\'clear\') }}</button>\n' +
      '   </span>\n' +
      '   <button type="button" class="btn btn-sm btn-success pull-right" data-ng-click="close()">{{ getText(\'close\') }}</button>\n' +
      '  </li>\n' +
      '</ul>\n' +
      '')

    $templateCache.put('template/datepicker/year.html',
      '<table role="grid" aria-labelledby="{{uniqueId}}-title" aria-activedescendant="{{activeDateId}}">\n' +
      '  <thead>\n' +
      '    <tr>\n' +
      '      <th><button type="button" class="btn btn-default btn-sm pull-left" data-ng-click="move(-1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-left"></i></button></th>\n' +
      '      <th colspan="3"><button id="{{uniqueId}}-title" role="heading" aria-live="assertive" aria-atomic="true" type="button" class="btn btn-default btn-sm" data-ng-click="toggleMode()" tabindex="-1" style="width:100%;"><strong>{{title}}</strong></button></th>\n' +
      '      <th><button type="button" class="btn btn-default btn-sm pull-right" data-ng-click="move(1)" tabindex="-1"><i class="glyphicon glyphicon-chevron-right"></i></button></th>\n' +
      '    </tr>\n' +
      '  </thead>\n' +
      '  <tbody>\n' +
      '    <tr data-ng-repeat="row in rows track by $index">\n' +
      '      <td data-ng-repeat="dt in row track by dt.date" class="text-center" role="gridcell" id="{{dt.uid}}" aria-disabled="{{!!dt.disabled}}">\n' +
      '        <button type="button" style="width:100%;" class="btn btn-default" data-ng-class="{\'btn-info\': dt.selected, active: isActive(dt)}" data-ng-click="select(dt.date)" data-ng-disabled="dt.disabled" tabindex="-1"><span data-ng-class="{\'text-info\': dt.current}">{{dt.label}}</span></button>\n' +
      '      </td>\n' +
      '    </tr>\n' +
      '  </tbody>\n' +
      '</table>\n' +
      '')
  }])

  app.constant('datepickerConfig', {
    formatDay: 'dd',
    formatMonth: 'MMMM',
    formatYear: 'yyyy',
    formatDayHeader: 'EEE',
    formatDayTitle: 'MMM yyyy',
    formatMonthTitle: 'yyyy',
    datepickerMode: 'day',
    minMode: 'day',
    maxMode: 'year',
    showWeeks: false,
    startingDay: 0,
    yearRange: 20,
    minDate: null,
    maxDate: null,
    isDisabledMonths: true,
    paymentDueDate: null,
    lobmode: '',
    isTransfer: false,
    minPayNotMet: false,
    statementBalanceMet: false,
    isAfterCutOffTime: false
  })

  app.controller('DatepickerController', ['$scope', '$attrs', '$parse', '$interpolate', '$timeout', '$log', 'dateFilter', 'datepickerConfig', function ($scope, $attrs, $parse, $interpolate, $timeout, $log, dateFilter, datepickerConfig) {
    var self = this,
      ngModelCtrl = {
        $setViewValue: angular.noop
    } // nullModelCtrl

    // Modes chain
    this.modes = ['day', 'month', 'year']

    // Configuration attributes
    angular.forEach(['formatDay', 'formatMonth', 'formatYear', 'formatDayHeader', 'formatDayTitle', 'formatMonthTitle', 'lobmode', 'isTransfer',
      'minMode', 'maxMode', 'showWeeks', 'startingDay', 'yearRange', 'isDisabledMonths', 'daysOfMonthOnly', 'minPayNotMet', 'statementBalanceMet', 'isAfterCutOffTime'
    ], function (key, index) {
      self[key] = angular.isDefined($attrs[key]) ? (index < 10 ? $interpolate($attrs[key])($scope.$parent) : $scope.$parent.$eval($attrs[key])) : datepickerConfig[key]
    })

    // Watchable date attributes
    angular.forEach(['minDate', 'maxDate', 'paymentDueDate'], function (key) {
      if ($attrs[key]) {
        $scope.$parent.$watch($parse($attrs[key]), function (value) {
          self[key] = value ? new Date(value) : null
          self.refreshView()
        })
      } else {
        self[key] = datepickerConfig[key] ? new Date(datepickerConfig[key]) : null
      }
    })

    $scope.datepickerMode = $scope.datepickerMode || datepickerConfig.datepickerMode
    $scope.uniqueId = 'datepicker-' + $scope.$id + '-' + Math.floor(Math.random() * 10000)
    this.activeDate = angular.isDefined($attrs.initDate) ? $scope.$parent.$eval($attrs.initDate) : new Date()

    $scope.isActive = function (dateObject) {
      if (self.compare(dateObject.date, self.activeDate) === 0) {
        $scope.activeDateId = dateObject.uid
        return true
      }
      return false
    }

    this.init = function (ngModelCtrl_) {
      ngModelCtrl = ngModelCtrl_

      ngModelCtrl.$render = function () {
        self.render()
      }
    }

    $scope.getDisplayText = function (isSelectedDate, isduedate, today, pastduedate, minpaynotmet) {
      if (self['lobmode'] === 'creditcard') {
        if (isduedate)
          return 'DUE'
        else if (pastduedate && isSelectedDate && minpaynotmet)
          return 'LATE'
        else if (today)
          return 'TODAY'
        else if (isSelectedDate && !minpaynotmet)
          return ''
        else
          return ''
      }
      if (self['lobmode'] === 'autoloan') {
        if (isSelectedDate) {
          return 'PAY'
        } else if (isduedate) {
          return 'DUE'
        } else {
          return 'TODAY'
        }
      }
    }

    this.render = function () {
      if (ngModelCtrl.$modelValue) {
        var date = new Date(ngModelCtrl.$modelValue),
          isValid = !isNaN(date)

        if (isValid) {
          // Push END date (if there's more than one date in selectedDates) to 23:59:59
          // so can be selected as the same date of START date
          this.activeDate = $scope.selectedDates && $scope.selectedDates.length > 1 ? new Date(date.setHours(23, 59, 59)) : date
        } else {
          $log.error('Datepicker directive: "data-ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.')
        }
        ngModelCtrl.$setValidity('date', isValid)
      }
      this.refreshView()
    }

    this.refreshView = function () {
      if (this.element) {
        this._refreshView()

        var date = ngModelCtrl.$modelValue ? new Date(ngModelCtrl.$modelValue) : null
        ngModelCtrl.$setValidity('date-disabled', !date || (this.element && !this.isDisabled(date)))
      }
    }

    this.createDateObject = function (date, format) {
      var model = ngModelCtrl.$modelValue ? new Date(ngModelCtrl.$modelValue) : null
      var duedate = this.paymentDueDate ? this.compare(this.paymentDueDate, new Date()) / (1000 * 3600 * 24) : false
      var today = new Date()
      var firstDate = !this.isAfterCutOffTime ? today : c1Date(today).getDateAt(1)
      var baseObj = {
        date: date,
        label: dateFilter(date, format),
        selected: model && this.compare(date, model) === 0,
        disabled: this.isDisabled(date),
        current: this.compare(date, new Date()) === 0,
        customClass: this.customClass(date) || null,
        today: this.compare(date, new Date()) === 0,
        isduedate: duedate ? (this.compare(date, this.paymentDueDate) === 0) : false
      }

      if (self['lobmode'] === 'autoloan') {
        return angular.extend(baseObj, {
          isduedate: (duedate >= 0) && (this.compare(date, this.paymentDueDate) === 0)
        })
      } else if (self['lobmode'] === 'creditcard') {
        return angular.extend(baseObj, {
          isduedate: (this.compare(date, this.paymentDueDate) === 0),
          pastduedate: this.compare(date, this.paymentDueDate) > 0 && (this.maxDate && this.compare(date, this.maxDate) <= 0) && (this.compare(firstDate, this.paymentDueDate) <= 0) && !this.statementBalanceMet,
          minpaynotmet: this.compare(date, this.paymentDueDate) > 0 && (this.maxDate && this.compare(date, this.maxDate) <= 0) && (this.compare(firstDate, this.paymentDueDate) <= 0) && this.minPayNotMet && !this.statementBalanceMet
        })
      } else
        return baseObj
    }

    this.isDisabled = function (date) {
      return ((this.minDate && this.compare(date, this.minDate) < 0) || (this.maxDate && this.compare(date, this.maxDate) > 0) || ($attrs.dateDisabled && $scope.dateDisabled({
          date: date,
          mode: $scope.datepickerMode
        })))
    }

    this.customClass = function (date) {
      return $scope.customClass({date: date})
    }

    // Split array into smaller arrays
    this.split = function (arr, size) {
      var arrays = []
      while (arr.length > 0) {
        arrays.push(arr.splice(0, size))
      }
      return arrays
    }

    $scope.select = function (date) {
      // IE Edge bug
      if (!self.isDisabled(date)) {
        if ($scope.datepickerMode === self.minMode) {
          var dt = ngModelCtrl.$modelValue ? new Date(ngModelCtrl.$modelValue) : new Date(0, 0, 0, 0, 0, 0, 0)
          dt.setFullYear(date.getFullYear(), date.getMonth(), date.getDate())
          ngModelCtrl.$setViewValue(dt)
          ngModelCtrl.$render()
        } else {
          // Push END date (if there's more than one date in selectedDates) to 23:59:59
          // so can be selected as the same date of START date
          self.activeDate = $scope.selectedDates && $scope.selectedDates.length > 1 ? new Date(date.setHours(23, 59, 59)) : date
          $scope.datepickerMode = self.modes[self.modes.indexOf($scope.datepickerMode) - 1]
        }
      }
    }

    $scope.btnMouseOver = function (evt, dt) {
      if (self.isTransfer) {
        angular.element(evt.currentTarget.children[1]).text('TRANSFER')

        angular.element(evt.currentTarget).addClass('btn-enabled')
        angular.element(evt.currentTarget.children[1]).removeClass('data-ng-hide')
      }
    }

    $scope.btnMouseOut = function (evt, dt) {
      if (self.isTransfer) {
        if (dt.current) {
          angular.element(evt.currentTarget.children[1]).text('TODAY')
        } else {
          angular.element(evt.currentTarget.children[1]).text('')
          angular.element(evt.currentTarget.children[1]).addClass('data-ng-hide')
        }
        angular.element(evt.currentTarget).removeClass('btn-enabled')
      }
    }

    $scope.move = function (direction) {
      var year = self.activeDate.getFullYear() + direction * (self.step.years || 0),
        month = self.activeDate.getMonth() + direction * (self.step.months || 0)
      self.activeDate.setFullYear(year, month, 1)
      self.refreshView()
    }

    $scope.toggleMode = function (direction) {
      direction = direction || 1

      if (($scope.datepickerMode === self.maxMode && direction === 1) || ($scope.datepickerMode === self.minMode && direction === -1)) {
        return
      }

      $scope.datepickerMode = self.modes[self.modes.indexOf($scope.datepickerMode) + direction]
    }

    // Key event mapper
    $scope.keys = {
      13: 'enter',
      32: 'space',
      33: 'pageup',
      34: 'pagedown',
      35: 'end',
      36: 'home',
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down'
    }

    var focusElement = function () {
      $timeout(function () {
        self.element[0].focus()
      }, 0, false)
    }

    // Listen for focus requests from popup directive
    $scope.$on('datepicker.focus', focusElement)

    $scope.keydown = function (evt) {
      var key = $scope.keys[evt.which]

      if (!key || evt.shiftKey || evt.altKey) {
        return
      }

      evt.preventDefault()
      evt.stopPropagation()

      if (key === 'enter' || key === 'space') {
        if (self.isDisabled(self.activeDate)) {
          return // do nothing
        }
        $scope.select(self.activeDate)
        focusElement()
      } else if (evt.ctrlKey && (key === 'up' || key === 'down')) {
        $scope.toggleMode(key === 'up' ? 1 : -1)
        focusElement()
      } else {
        self.handleKeyDown(key, evt)
        self.refreshView()
      }
    }
  }])

  app.directive('datepicker', function () {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'template/datepicker/datepicker.html',
      scope: {
        datepickerMode: '=?',
        dateDisabled: '&',
        customClass: '&'
      },
      require: ['datepicker', '?^ngModel'],
      controller: 'DatepickerController',
      link: function (scope, element, attrs, ctrls) {
        var datepickerCtrl = ctrls[0],
          ngModelCtrl = ctrls[1]

        if (ngModelCtrl) {
          datepickerCtrl.init(ngModelCtrl)
        }
      }
    }
  })

  app.directive('daypicker', ['dateFilter', function (dateFilter) {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'template/datepicker/day.html',
      require: '^datepicker',
      link: function (scope, element, attrs, ctrl) {
        scope.showWeeks = ctrl.showWeeks
        scope.daysOfMonthOnly = ctrl.daysOfMonthOnly

        ctrl.step = {
          months: 1
        }
        ctrl.element = element

        var DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

        function getDaysInMonth (year, month) {
          return ((month === 1) && (year % 4 === 0) && ((year % 100 !== 0) || (year % 400 === 0))) ? 29 : DAYS_IN_MONTH[month]
        }

        function getDates (startDate, n) {
          var dates = new Array(n),
            current = new Date(startDate),
            i = 0
          current.setHours(12) // Prevent repeated dates because of timezone bug
          while (i < n) {
            dates[i++] = new Date(current)
            current.setDate(current.getDate() + 1)
          }
          return dates
        }

        ctrl._refreshView = function () {
          var year = ctrl.activeDate.getFullYear(),
            month = ctrl.activeDate.getMonth(),
            firstDayOfMonth = new Date(year, month, 1),
            difference = ctrl.startingDay - firstDayOfMonth.getDay(),
            numDisplayedFromPreviousMonth = (difference > 0) ? 7 - difference : -difference,
            firstDate = new Date(firstDayOfMonth)

          if (numDisplayedFromPreviousMonth > 0) {
            firstDate.setDate(-numDisplayedFromPreviousMonth + 1)
          }

          // 42 is the number of days on a six-month calendar
          var days = getDates(firstDate, 42)
          for (var i = 0; i < 42; i++) {
            days[i] = angular.extend(ctrl.createDateObject(days[i], ctrl.formatDay), {
              secondary: days[i].getMonth() !== month,
              uid: scope.uniqueId + '-' + i
            })
          }

          scope.labels = new Array(7)
          for (var j = 0; j < 7; j++) {
            scope.labels[j] = {
              // abbr: dateFilter(days[j].date, ctrl.formatDayHeader),
              abbr: days[j].date.toString()[0],
              full: dateFilter(days[j].date, 'EEEE')
            }
          }

          scope.title = dateFilter(ctrl.activeDate, ctrl.formatDayTitle)
          scope.rows = ctrl.split(days, 7)

          if (scope.showWeeks) {
            scope.weekNumbers = []
            var weekNumber = getISO8601WeekNumber(scope.rows[0][0].date),
              numWeeks = scope.rows.length
            while (scope.weekNumbers.push(weekNumber++) < numWeeks) {}
          }
        }

        ctrl.compare = function (date1, date2) {
          return (new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()) - new Date(date2.getFullYear(), date2.getMonth(), date2.getDate()))
        }

        function getISO8601WeekNumber (date) {
          var checkDate = new Date(date)
          checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7)) // Thursday
          var time = checkDate.getTime()
          checkDate.setMonth(0) // Compare with Jan 1
          checkDate.setDate(1)
          return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1
        }

        ctrl.handleKeyDown = function (key, evt) {
          var date = ctrl.activeDate.getDate()

          if (key === 'left') {
            date = date - 1 // up
          } else if (key === 'up') {
            date = date - 7 // down
          } else if (key === 'right') {
            date = date + 1 // down
          } else if (key === 'down') {
            date = date + 7
          } else if (key === 'pageup' || key === 'pagedown') {
            var month = ctrl.activeDate.getMonth() + (key === 'pageup' ? -1 : 1)
            ctrl.activeDate.setMonth(month, 1)
            date = Math.min(getDaysInMonth(ctrl.activeDate.getFullYear(), ctrl.activeDate.getMonth()), date)
          } else if (key === 'home') {
            date = 1
          } else if (key === 'end') {
            date = getDaysInMonth(ctrl.activeDate.getFullYear(), ctrl.activeDate.getMonth())
          }
          ctrl.activeDate.setDate(date)
        }

        ctrl.refreshView()
      }
    }
  }])

  app.directive('monthpicker', ['dateFilter', function (dateFilter) {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'template/datepicker/month.html',
      require: '^datepicker',
      link: function (scope, element, attrs, ctrl) {
        ctrl.step = {
          years: 1
        }
        ctrl.element = element

        ctrl._refreshView = function () {
          var months = new Array(12),
            year = ctrl.activeDate.getFullYear()

          for (var i = 0; i < 12; i++) {
            months[i] = angular.extend(ctrl.createDateObject(new Date(year, i, 1), ctrl.formatMonth), {
              uid: scope.uniqueId + '-' + i
            })
          }

          scope.title = dateFilter(ctrl.activeDate, ctrl.formatMonthTitle)
          scope.rows = ctrl.split(months, 3)
        }

        ctrl.compare = function (date1, date2) {
          return new Date(date1.getFullYear(), date1.getMonth()) - new Date(date2.getFullYear(), date2.getMonth())
        }

        ctrl.handleKeyDown = function (key, evt) {
          var date = ctrl.activeDate.getMonth()

          if (key === 'left') {
            date = date - 1 // up
          } else if (key === 'up') {
            date = date - 3 // down
          } else if (key === 'right') {
            date = date + 1 // down
          } else if (key === 'down') {
            date = date + 3
          } else if (key === 'pageup' || key === 'pagedown') {
            var year = ctrl.activeDate.getFullYear() + (key === 'pageup' ? -1 : 1)
            ctrl.activeDate.setFullYear(year)
          } else if (key === 'home') {
            date = 0
          } else if (key === 'end') {
            date = 11
          }
          ctrl.activeDate.setMonth(date)
        }

        ctrl.refreshView()
      }
    }
  }])

  app.directive('yearpicker', ['dateFilter', function (dateFilter) {
    return {
      restrict: 'EA',
      replace: true,
      templateUrl: 'template/datepicker/year.html',
      require: '^datepicker',
      link: function (scope, element, attrs, ctrl) {
        var range = ctrl.yearRange

        ctrl.step = {
          years: range
        }
        ctrl.element = element

        function getStartingYear (year) {
          return parseInt((year - 1) / range, 10) * range + 1
        }

        ctrl._refreshView = function () {
          var years = new Array(range)

          for (var i = 0, start = getStartingYear(ctrl.activeDate.getFullYear()); i < range; i++) {
            years[i] = angular.extend(ctrl.createDateObject(new Date(start + i, 0, 1), ctrl.formatYear), {
              uid: scope.uniqueId + '-' + i
            })
          }

          scope.title = [years[0].label, years[range - 1].label].join(' - ')
          scope.rows = ctrl.split(years, 5)
        }

        ctrl.compare = function (date1, date2) {
          return date1.getFullYear() - date2.getFullYear()
        }

        ctrl.handleKeyDown = function (key, evt) {
          var date = ctrl.activeDate.getFullYear()

          if (key === 'left') {
            date = date - 1 // up
          } else if (key === 'up') {
            date = date - 5 // down
          } else if (key === 'right') {
            date = date + 1 // down
          } else if (key === 'down') {
            date = date + 5
          } else if (key === 'pageup' || key === 'pagedown') {
            date += (key === 'pageup' ? -1 : 1) * ctrl.step.years
          } else if (key === 'home') {
            date = getStartingYear(ctrl.activeDate.getFullYear())
          } else if (key === 'end') {
            date = getStartingYear(ctrl.activeDate.getFullYear()) + range - 1
          }
          ctrl.activeDate.setFullYear(date)
        }

        ctrl.refreshView()
      }
    }
  }])

  app.constant('datepickerPopupConfig', {
    datepickerPopup: 'yyyy-MM-dd',
    currentText: 'Today',
    clearText: 'Clear',
    closeText: 'Done',
    closeOnDateSelection: true,
    appendToBody: false,
    showButtonBar: true
  })

  app.directive('datepickerPopup', ['$compile', '$parse', '$document', '$position', 'dateFilter', 'dateParser', 'datepickerPopupConfig', '$timeout',
    function ($compile, $parse, $document, $position, dateFilter, dateParser, datepickerPopupConfig, $timeout) {
      return {
        restrict: 'EA',
        require: 'ngModel',
        scope: {
          isOpen: '=?',
          currentText: '@',
          clearText: '@',
          closeText: '@',
          dateDisabled: '&'
        },
        link: function (scope, element, attrs, ngModel) {
          var dateFormat,
            closeOnDateSelection = angular.isDefined(attrs.closeOnDateSelection) ? scope.$parent.$eval(attrs.closeOnDateSelection) : datepickerPopupConfig.closeOnDateSelection,
            appendToBody = angular.isDefined(attrs.datepickerAppendToBody) ? scope.$parent.$eval(attrs.datepickerAppendToBody) : datepickerPopupConfig.appendToBody

          scope.showButtonBar = angular.isDefined(attrs.showButtonBar) ? scope.$parent.$eval(attrs.showButtonBar) : datepickerPopupConfig.showButtonBar

          scope.getText = function (key) {
            return scope[key + 'Text'] || datepickerPopupConfig[key + 'Text']
          }

          attrs.$observe('datepickerPopup', function (value) {
            dateFormat = value || datepickerPopupConfig.datepickerPopup
            ngModel.$render()
          })

          // popup element used to display calendar
          var popupEl = angular.element('<div datepicker-popup-wrap><div datepicker></div></div>')
          popupEl.attr({
            'data-ng-model': 'date',
            'data-ng-change': 'dateSelection()'
          })

          function cameltoDash (string) {
            return string.replace(/([A-Z])/g, function ($1) {
              return '-' + $1.toLowerCase()
            })
          }

          // datepicker element
          var datepickerEl = angular.element(popupEl.children()[0])
          if (attrs.datepickerOptions) {
            angular.forEach(scope.$parent.$eval(attrs.datepickerOptions), function (value, option) {
              datepickerEl.attr(cameltoDash(option), value)
            })
          }

          scope.watchData = {}
          angular.forEach(['minDate', 'maxDate', 'paymentDueDate', 'datepickerMode'], function (key) {
            if (attrs[key]) {
              var getAttribute = $parse(attrs[key])
              scope.$parent.$watch(getAttribute, function (value) {
                scope.watchData[key] = value
              })
              datepickerEl.attr(cameltoDash(key), 'watchData.' + key)

              // Propagate changes from datepicker to outside
              if (key === 'datepickerMode') {
                var setAttribute = getAttribute.assign
                scope.$watch('watchData.' + key, function (value, oldvalue) {
                  if (value !== oldvalue) {
                    setAttribute(scope.$parent, value)
                  }
                })
              }
            }
          })
          if (attrs.dateDisabled) {
            datepickerEl.attr('date-disabled', 'dateDisabled({ date: date, mode: mode })')
          }

          function parseDate (viewValue) {
            if (!viewValue) {
              ngModel.$setValidity('date', true)
              return null
            } else if (angular.isDate(viewValue) && !isNaN(viewValue)) {
              ngModel.$setValidity('date', true)
              return viewValue
            } else if (angular.isString(viewValue)) {
              var date = dateParser.parse(viewValue, dateFormat) || new Date(viewValue)
              if (isNaN(date)) {
                ngModel.$setValidity('date', false)
                return undefined
              } else {
                ngModel.$setValidity('date', true)
                return date
              }
            } else {
              ngModel.$setValidity('date', false)
              return undefined
            }
          }

          ngModel.$parsers.unshift(parseDate)

          // Inner change
          scope.dateSelection = function (dt) {
            if (angular.isDefined(dt)) {
              scope.date = dt
            }
            ngModel.$setViewValue(scope.date)
            ngModel.$render()

            if (closeOnDateSelection) {
              this.close()
            }
          }

          element.bind('input change keyup', function () {
            scope.$apply(function () {
              scope.date = ngModel.$modelValue
            })
          })

          // Outter change
          ngModel.$render = function () {
            var date = ngModel.$viewValue ? dateFilter(ngModel.$viewValue, dateFormat) : ''
            element.val(date)
            scope.date = parseDate(ngModel.$modelValue)
          }

          var documentClickBind = function (event) {
            if (scope.isOpen && event.target !== element[0]) {
              var el = angular.element(document.getElementsByClassName('animateTable'))
              $timeout(function () {
                scope.isOpen = false
                el.removeClass('selectDateClass')
              }, 100)
              el.addClass('selectDateClass')
            }
          }

          var keydown = function (evt, noApply) {
            scope.keydown(evt)
          }
          element.bind('keydown', keydown)

          scope.keydown = function (evt) {
            if (evt.which === 27) {
              evt.preventDefault()
              evt.stopPropagation()
              scope.close()
            } else if (evt.which === 40 && !scope.isOpen) {
              scope.isOpen = true
            }
          }

          scope.$watch('isOpen', function (value) {
            if (value) {
              scope.$broadcast('datepicker.focus')
              scope.position = appendToBody ? $position.offset(element) : $position.position(element)
              scope.position.top = scope.position.top + element.prop('offsetHeight')

              $document.bind('click', documentClickBind)
            } else {
              $document.unbind('click', documentClickBind)
            }
          })

          scope.select = function (date) {
            if (date === 'today') {
              var today = new Date()
              if (angular.isDate(ngModel.$modelValue)) {
                date = new Date(ngModel.$modelValue)
                date.setFullYear(today.getFullYear(), today.getMonth(), today.getDate())
              } else {
                date = new Date(today.setHours(0, 0, 0, 0))
              }
            }
            scope.dateSelection(date)
          }

          scope.close = function () {
            var el = angular.element(document.getElementsByClassName('animateTable'))
            $timeout(function () {
              scope.isOpen = false
              element[0].focus()
              el.removeClass('selectDateClass')
            }, 100)
            el.addClass('selectDateClass')

          // scope.isOpen = false
          // element[0].focus()
          }

          var $popup = $compile(popupEl)(scope)
          // Prevent jQuery cache memory leak (template is now redundant after linking)
          popupEl.remove()

          if (appendToBody) {
            $document.find('body').append($popup)
          } else {
            element.after($popup)
          }

          scope.$on('$destroy', function () {
            $popup.remove()
            element.unbind('keydown', keydown)
            $document.unbind('click', documentClickBind)
          })
        }
      }
    }
  ])

  app.directive('datepickerPopupWrap', function () {
    return {
      restrict: 'EA',
      replace: true,
      transclude: true,
      templateUrl: 'template/datepicker/popup.html',
      link: function (scope, element, attrs) {
        element.bind('click', function (event) {
          event.preventDefault()
          event.stopPropagation()
        })
      }
    }
  })

  app.service('dateParser', ['$locale', 'orderByFilter', function ($locale, orderByFilter) {
    this.parsers = {}

    var formatCodeToRegex = {
      'yyyy': {
        regex: '\\d{4}',
        apply: function (value) {
          this.year = +value
        }
      },
      'yy': {
        regex: '\\d{2}',
        apply: function (value) {
          this.year = +value + 2000
        }
      },
      'y': {
        regex: '\\d{1,4}',
        apply: function (value) {
          this.year = +value
        }
      },
      'MMMM': {
        regex: $locale.DATETIME_FORMATS.MONTH.join('|'),
        apply: function (value) {
          this.month = $locale.DATETIME_FORMATS.MONTH.indexOf(value)
        }
      },
      'MMM': {
        regex: $locale.DATETIME_FORMATS.SHORTMONTH.join('|'),
        apply: function (value) {
          this.month = $locale.DATETIME_FORMATS.SHORTMONTH.indexOf(value)
        }
      },
      'MM': {
        regex: '0[1-9]|1[0-2]',
        apply: function (value) {
          this.month = value - 1
        }
      },
      'M': {
        regex: '[1-9]|1[0-2]',
        apply: function (value) {
          this.month = value - 1
        }
      },
      'dd': {
        regex: '[0-2][0-9]{1}|3[0-1]{1}',
        apply: function (value) {
          this.date = +value
        }
      },
      'd': {
        regex: '[1-2]?[0-9]{1}|3[0-1]{1}',
        apply: function (value) {
          this.date = +value
        }
      },
      'EEEE': {
        regex: $locale.DATETIME_FORMATS.DAY.join('|')
      },
      'EEE': {
        regex: $locale.DATETIME_FORMATS.SHORTDAY.join('|')
      }
    }

    function createParser (format) {
      var map = [],
        regex = format.split('')

      angular.forEach(formatCodeToRegex, function (data, code) {
        var index = format.indexOf(code)

        if (index > -1) {
          format = format.split('')

          regex[index] = '(' + data.regex + ')'
          format[index] = '$' // Custom symbol to define consumed part of format
          for (var i = index + 1, n = index + code.length; i < n; i++) {
            regex[i] = ''
            format[i] = '$'
          }
          format = format.join('')

          map.push({
            index: index,
            apply: data.apply
          })
        }
      })

      return {
        regex: new RegExp('^' + regex.join('') + '$'),
        map: orderByFilter(map, 'index')
      }
    }

    this.parse = function (input, format) {
      if (!angular.isString(input) || !format) {
        return input
      }

      format = $locale.DATETIME_FORMATS[format] || format

      if (!this.parsers[format]) {
        this.parsers[format] = createParser(format)
      }

      var parser = this.parsers[format],
        regex = parser.regex,
        map = parser.map,
        results = input.match(regex)

      if (results && results.length) {
        var fields = {
            year: 1900,
            month: 0,
            date: 1,
            hours: 0
          },
          dt

        for (var i = 1, n = results.length; i < n; i++) {
          var mapper = map[i - 1]
          if (mapper.apply) {
            mapper.apply.call(fields, results[i])
          }
        }

        if (isValid(fields.year, fields.month, fields.date)) {
          dt = new Date(fields.year, fields.month, fields.date, fields.hours)
        }

        return dt
      }
    }

    // Check if date is valid for specific month (and year for February).
    // Month: 0 = Jan, 1 = Feb, etc
    function isValid (year, month, date) {
      if (month === 1 && date > 28) {
        return date === 29 && ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0)
      }

      if (month === 3 || month === 5 || month === 8 || month === 10) {
        return date < 31
      }

      return true
    }
  }])

  app.factory('$position', ['$document', '$window', function ($document, $window) {
    function getStyle (el, cssprop) {
      if (el.currentStyle) { // IE
        return el.currentStyle[cssprop]
      } else if ($window.getComputedStyle) {
        return $window.getComputedStyle(el)[cssprop]
      }
      // finally try and get inline style
      return el.style[cssprop]
    }

    /**
     * Checks if a given element is statically positioned
     * @param element - raw DOM element
     */
    function isStaticPositioned (element) {
      return (getStyle(element, 'position') || 'static') === 'static'
    }

    /**
     * returns the closest, non-statically positioned parentOffset of a given element
     * @param element
     */
    var parentOffsetEl = function (element) {
      var docDomEl = $document[0]
      var offsetParent = element.offsetParent || docDomEl
      while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent)) {
        offsetParent = offsetParent.offsetParent
      }
      return offsetParent || docDomEl
    }

    return {
      /**
       * Provides read-only equivalent of jQuery's position function:
       * http://api.jquery.com/position/
       */
      position: function (element) {
        var elBCR = this.offset(element)
        var offsetParentBCR = {
          top: 0,
          left: 0
        }
        var offsetParentEl = parentOffsetEl(element[0])
        if (offsetParentEl != $document[0]) {
          offsetParentBCR = this.offset(angular.element(offsetParentEl))
          offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop
          offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft
        }

        var boundingClientRect = element[0].getBoundingClientRect()
        return {
          width: boundingClientRect.width || element.prop('offsetWidth'),
          height: boundingClientRect.height || element.prop('offsetHeight'),
          // top: elBCR.top - offsetParentBCR.top,
          left: elBCR.left - offsetParentBCR.left,
          right: boundingClientRect.right,
          total: this.left + this.width
        }
      },

      /**
       * Provides read-only equivalent of jQuery's offset function:
       * http://api.jquery.com/offset/
       */
      offset: function (element) {
        var boundingClientRect = element[0].getBoundingClientRect()
        return {
          width: boundingClientRect.width || element.prop('offsetWidth'),
          height: boundingClientRect.height || element.prop('offsetHeight'),
          top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
          left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
        }
      },

      /**
       * Provides coordinates for the targetEl in relation to hostEl
       */
      positionElements: function (hostEl, targetEl, positionStr, appendToBody) {
        var positionStrParts = positionStr.split('-')
        var pos0 = positionStrParts[0],
          pos1 = positionStrParts[1] || 'center'

        var hostElPos,
          targetElWidth,
          targetElHeight,
          targetElPos

        hostElPos = appendToBody ? this.offset(hostEl) : this.position(hostEl)

        targetElWidth = targetEl.prop('offsetWidth')
        targetElHeight = targetEl.prop('offsetHeight')

        var shiftWidth = {
          center: function () {
            return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2
          },
          left: function () {
            return hostElPos.left
          },
          right: function () {
            return hostElPos.left + hostElPos.width
          }
        }

        var shiftHeight = {
          center: function () {
            return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2
          },
          top: function () {
            return hostElPos.top
          },
          bottom: function () {
            return hostElPos.top + hostElPos.height
          }
        }

        switch (pos0) {
          case 'right':
            targetElPos = {
              top: shiftHeight[pos1](),
              left: shiftWidth[pos0]()
            }
            break
          case 'left':
            targetElPos = {
              top: shiftHeight[pos1](),
              left: hostElPos.left - targetElWidth
            }
            break
          case 'bottom':
            targetElPos = {
              top: shiftHeight[pos0](),
              left: shiftWidth[pos1]()
            }
            break
          default:
            targetElPos = {
              top: hostElPos.top - targetElHeight,
              left: shiftWidth[pos1]()
            }
            break
        }

        return targetElPos
      }
    }
  }])
});
define('easeMultiDateSelector',['angular'], function (angular) {
  'use strict'
  angular.module('easeMultiDateSelector', [])
    .config(['$provide', '$injector', function ($provide, $injector) {

      // extending datepicker (access to attributes and app scope through $parent)
      var datepickerDelegate = function ($delegate) {
        var directive = $delegate[0]

        // Override compile
        var link = directive.link

        directive.compile = function () {
          return function (scope, element, attrs, ctrls) {
            link.apply(this, arguments)
            if (!angular.isDefined(attrs.multiSelect)) return
            scope.selectedDates = []
            scope.$parent.$watchCollection(attrs.multiSelect, function (newVal) {
              scope.selectedDates = newVal || []
            })
            var ngModelCtrl = ctrls[1]
            ngModelCtrl.$viewChangeListeners.push(function () {
              var newVal = scope.$parent.$eval(attrs.ngModel)
              if (!newVal)
                return
              var dateVal = newVal.getTime(),
                selectedDates = scope.selectedDates
              // reset range
              if (!selectedDates.length || selectedDates.length > 1)
                return selectedDates.splice(0, selectedDates.length, dateVal)
              selectedDates.push(dateVal)
              var tempVal = Math.min.apply(null, selectedDates)
              var maxVal = Math.max.apply(null, selectedDates)
              // Start on the next day to prevent duplicating the first date
              tempVal = new Date(tempVal).setHours(24)
              while (tempVal < maxVal) {
                selectedDates.push(tempVal)
                // Set a day ahead after pushing to prevent duplicating last date
                tempVal = new Date(tempVal).setHours(24)
              }
            })
          }
        }
        return $delegate
      }
      if ($injector.has('datepickerDirective'))
        $provide.decorator('datepickerDirective', ['$delegate', datepickerDelegate])
      // extending daypicker (access to day and datepicker scope through $parent)
      var daypickerDelegate = function ($delegate, $timeout) {
        var directive = $delegate[0]
        // Override compile
        var link = directive.link
        directive.compile = function () {
          return function (scope, element, attrs, ctrls) {
            link.apply(this, arguments)
            var datepickerCtrl = ctrls[0]
            var ngModelCtrl = ctrls[1]
            // Listen for 'refreshDatepickers' event...
            scope.$on('refreshDatepickers', function refreshView () {
              console.log('refreshed dp')
              datepickerCtrl.activeDate.setYear(1960)
              datepickerCtrl.refreshView()
              $timeout(function () {
                datepickerCtrl.activeDate.setYear(new Date().getFullYear())
                datepickerCtrl.refreshView()
              })
            })

            if (!angular.isDefined(scope.$parent.selectedDates)) return
            var datepickerCtroller = ctrls
            scope.$watch(function () {
              return datepickerCtroller.activeDate.getTime()
            }, update)

            scope.$watch(scope.selectedDates, update)

            function update () {
              angular.forEach(scope.rows, function (row) {
                angular.forEach(row, function (day) {
                  day.selected = scope.selectedDates.indexOf(day.date.setHours(0, 0, 0, 0)) > -1
                  day.isStartDay = day.date.setHours(0, 0, 0, 0) === scope.selectedDates[0]
                  day.isEndDay = day.date.setHours(0, 0, 0, 0) === scope.selectedDates[1]
                  day.isToday = day.date.setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0)

                  // start date = end date
                  if (day.isStartDay && day.isEndDay) {
                    day.customClass = 'td-range'
                    day.displayLabel = ''
                  } else if (day.isStartDay) {
                    day.customClass = 'td-range'
                    day.displayLabel = 'START'
                  } else if (day.isEndDay) {
                    day.customClass = 'td-range'
                    day.displayLabel = 'END'
                  } else if (day.selected && !day.isStartDay && !day.isEndDay) {
                    day.customClass = 'td-selected'
                  } else {
                    day.customClass = ''
                  }
                })
              })
            }
          }
        }
        return $delegate
      }
      if ($injector.has('daypickerDirective'))
        $provide.decorator('daypickerDirective', ['$delegate', '$timeout', daypickerDelegate])
    }])
});
define('easeDateRangePicker',['angular','c1Date', 'easeMultiDateSelector'], function(angular) {
  'use strict';

  angular.module('easeDateRangePicker', ['easeMultiDateSelector'])
    .constant('RANGE_PICKER', {
      'START' : 1,
      'END' : 0,
      'TEMPLATE' : '/ease-ui/dist/partials/dateRangePicker.html',
      'MODAL_TYPE' : 'ease-date-range-modal'
    })
    .directive('dateRangePicker', dateRangeFn);

  function dateRangeFn() {
    function dateRangeCtrl($scope,EaseModalService, RANGE_PICKER,pubsubService,$state,$timeout) {
      var vm = this;
      var currentRange = false;
      var mode = false;
      vm.minDate = vm.minimumAcceptableDate ? new Date(vm.minimumAcceptableDate) :  new Date('1 Jan 1900');
      vm.maxDate = vm.maximumAcceptableDate ? new Date(vm.maximumAcceptableDate)  : new Date('31 Dec 2090');
      var currentRangeType = RANGE_PICKER['START'];
      vm.date, vm.startDate, vm.endDate;
      vm.selectedDatesRange = [];
      vm.modalType = RANGE_PICKER['MODAL_TYPE'];
      vm.hasFocus = true;
      vm.startDateBeforeMinDate, vm.endDateAfterMaxDate, vm.startDateAfterMaxDate, vm.endDateBeforeMinDate;
      vm.originalMinDate, vm.originalMaxDate, vm.isFormValid;
      vm.isStartDateInvalid = true;

      $scope.$watchCollection(angular.bind(vm, function() {
        return [this.minimumAcceptableDate, this.maximumAcceptableDate];
      }), function () {
        vm.minDate = vm.minimumAcceptableDate ? new Date(vm.minimumAcceptableDate) :  new Date('1 Jan 1900');
        vm.maxDate = vm.maximumAcceptableDate ? new Date(vm.maximumAcceptableDate)  : new Date('31 Dec 2090');
      });
      /**
       * Set the range for either start or end input box
       * @param {dt} dt is the current date selected by user
       * @_currentRange === 1 then set start else set end
       * @_mode === true then set dates manually
       */
      vm.setRange = function(dt) {
        var currentDate = c1Date(dt).format('abbrev').split(' ').slice(1).join(' ');
        !mode ? currentRange ^= true : currentRange = RANGE_PICKER[currentRangeType];
        if (currentRange) {
          vm.startDate = currentDate;
          vm.selectedDatesRange.length = 0;
          vm.endDate = null;
          mode = false;
          vm.hasFocus = false;
          vm.startDateBeforeMinDate = vm.startDateAfterMaxDate = false;
          vm.startDate = _isValidDate(new Date(vm.startDate)) ? vm.startDate : null;

          if(vm.startDate!==null) {
             vm.isStartDateInvalid = false;
          }

          $scope.$emit('onStartDateSelect',vm.startDate);
        } else {
          vm.endDate = currentDate;
          if (mode && vm.selectedDatesRange.length > 1) {
            var tempArray = vm.selectedDatesRange.splice(0,2);
            tempArray.pop();
            tempArray.push(new Date(vm.endDate).setHours(0,0,0,0));
            vm.selectedDatesRange = tempArray;
            _buildRange(tempArray);
            mode = false;

          }
          vm.hasFocus = true;
          vm.endDateAfterMaxDate = vm.endDateBeforeMinDate = false;
          vm.isFormValid = true;
          vm.endDate = _isValidDate(new Date(vm.endDate)) ? vm.endDate : null;
          $scope.$emit('onEndDateSelect',vm.endDate);
        }
      }

      vm.setRangeType = function(type) {
        currentRangeType = type;
        switch (currentRangeType) {
        case 'START':
          $scope.$emit('onStartDateReset');
          _resetDatePicker();
          vm.startDate = null;
          vm.endDate = null;
          vm.date = null;
          vm.startDateBeforeMinDate = vm.startDateAfterMaxDate = false;
          vm.isStartDateInvalid = true;
          break;
        case 'END':
          vm.endDate = null;
          vm.endDateAfterMaxDate = vm.endDateBeforeMinDate = false;
          break;
        }
        mode = true;
        vm.isFormValid = (!vm.startDateBeforeMinDate) && (!vm.startDateAfterMaxDate) && (!vm.endDateAfterMaxDate) && (!vm.endDateBeforeMinDate);
      }

      vm.setInputDate = function(dt) {

        if (dt) {

          _isValidDateRange(dt, currentRangeType);
          if (!vm.isFormValid){
            if(!vm.isValidEndDate){
               vm.startDate = _isValidDate(new Date(vm.startDate)) ? vm.startDate : null;
               $scope.$emit('onEndDateReset',vm.startDate);
            }
            return;
          }

          // Push END date to 23:59:59 so can be selected as the same date of START date
          vm.date = currentRangeType === 'END' ? new Date(dt).setHours(23, 59, 59) : dt;
          vm.setRange(c1Date(dt).format('abbrev').split(' ').slice(1).join(' '));
          vm.selectedDatesRange.push(new Date(dt).setHours(0, 0, 0, 0));
          if (vm.selectedDatesRange.length === 2) _buildRange(vm.selectedDatesRange);
        }

      }

      vm.openPicker = function() {
        if (!vm.originalMinDate && !vm.originalMaxDate) {
          vm.originalMinDate = vm.minimumAcceptableDate ? new Date(vm.minimumAcceptableDate) : new Date('1 Jan 1900');
          vm.originalMaxDate = vm.maximumAcceptableDate ? new Date(vm.maximumAcceptableDate) : new Date('31 Dec 2090');
        }
        _resetDatePicker();
        EaseModalService({ templateUrl: RANGE_PICKER['TEMPLATE'], controller: vm });
        var currentState = $state.current.name;
        var pubsubLOB = getPubSubLOB(currentState);
        pubsubService.pubsubPageView({
          scDLLevel1: 'ease',
          scDLLevel2: 'account details',
          scDLLevel3: 'filter dates',
          scDLLevel4: '',
          scDLLevel5: '',
          scDLCountry: 'us',
          scDLLanguage: 'english',
          scDLSystem: 'ease_web',
          scDLLOB: pubsubLOB
        });

      function getPubSubLOB(currentState) {
        if (currentState.indexOf('HomeLoans') !== -1) {
          return 'home loans';
        } else if (currentState.indexOf('AutoLoan') !== -1) {
          return 'coaf';
        } else if (currentState.indexOf('CreditCard') !== -1) {
          return 'card';
        } else {
          return '360';
        }
      }

      }

      vm.closeModal = function() {
        vm.startingDate = vm.startDate;
        vm.endingDate = vm.endDate;
        pubsubService.pubsubTrackAnalytics({ name : 'done:button' });

      }

      vm.close=function(){
        $scope.$emit('easeDatePickerModalClosed');
      }

      function _buildRange(selectedDates) {
        //This needs to be DRY
        if (selectedDates.length === 2) {
          var tempVal = Math.min.apply(null, selectedDates);
          var maxVal = Math.max.apply(null, selectedDates);
          tempVal = new Date(tempVal).setHours(24);
          while (tempVal < maxVal) {
            vm.selectedDatesRange.push(tempVal);
            // Set a day ahead after pushing to prevent duplicating last date
            tempVal = new Date(tempVal).setHours(24);
          }
        }
      }

      function _isValidDate(dt) {
          return ((dt instanceof Date)  ||  (Object.prototype.toString.call(dt) === '[object Date]'));
      }

      function _resetDatePicker() {
        vm.startDate = null;
        vm.endDate = null;
        vm.selectedDatesRange.length = 0;
        currentRange = false;
        mode = false;
        vm.date = null;
        vm.isStartDateInvalid = true;
        vm.isFormValid = true;
        vm.minDate = vm.minimumAcceptableDate ? new Date(vm.minimumAcceptableDate) :  new Date('1 Jan 1900');
        vm.maxDate = vm.maximumAcceptableDate ? new Date(vm.maximumAcceptableDate)  : new Date('31 Dec 2090');
        vm.startDateBeforeMinDate = vm.startDateAfterMaxDate = vm.endDateAfterMaxDate = vm.endDateBeforeMinDate = false;
      }

      function _isValidDateRange(dt, rangeType) {
        var newDate = new Date(dt);
        var isValidDate = _isValidDate(newDate);
        var isValid = true ;
        if(!isValidDate && rangeType === 'START'){
          vm.startDateBeforeMinDate = true;
          isValid = false;
        }else if(!isValidDate && rangeType === 'END'){
          vm.endDateAfterMaxDate = true;
          isValid = false;
        }
        if (rangeType === 'START' && isValidDate) {
          vm.startDateBeforeMinDate = !(isValid = newDate >= vm.minDate);
          if (isValid) {
            vm.startDateAfterMaxDate = !(isValid = newDate <= vm.maxDate);
            vm.isStartDateInvalid = false;
          }
        } else if(rangeType === 'END' && isValidDate) {
          vm.endDateAfterMaxDate = !(isValid = newDate <= vm.maxDate);
          if (isValid)
            vm.endDateBeforeMinDate = !(isValid = newDate >= vm.minDate);
        }
        vm.isValidStartDate = (vm.startDateBeforeMinDate ==false) && (vm.startDateAfterMaxDate == false);
        var endDateElem = document.getElementsByName("end_date")[0];
        if (vm.isValidStartDate && endDateElem.value == '') {
          vm.isStartDateInvalid = false;
          $timeout(function() {
            endDateElem.focus();
          }, 0);
        }
        vm.isValidEndDate =  (vm.endDateAfterMaxDate == false) && (vm.endDateBeforeMinDate == false);
        vm.isFormValid = isValid;
      }
    }
    dateRangeCtrl.$inject = ["$scope", "EaseModalService", "RANGE_PICKER", "pubsubService", "$state", "$timeout"];

    function _dateRangeLinker(scope, element, attributes, controller) {
      element.on('click', function() {
        controller.openPicker();
      });
    }

    return{
      restrict: 'A',
      scope: {
        startingDate : '=',
        endingDate : '=',
        maximumAcceptableDate : '=',
        minimumAcceptableDate : '='
      },
      controller: dateRangeCtrl,
      controllerAs: 'rangeCtrl',
      transclude: true,
      bindToController: true,
      link: _dateRangeLinker,
      template: '<a class="hand-pointer">Custom Dates</a>'
    }
  }
});
define('filterComponent',['angular', 'easeDateRangePicker'], function () {
  'use strict';

  angular.module('filterComponent', ['easeDateRangePicker'])
    .directive('filter', ['$timeout',filterFn])
    .directive('filterButtonBlur',['$timeout',blurFn]);

  function filterFn($scope,$timeout) {
    function filterController($scope,$timeout) {
      var vm = this;
      vm.displayDates = false;
      vm.startDate = null;
      vm.endDate = null;
      vm.dateRangeText = 'Custom Date Range';
      vm.maximumAcceptableDate;
      vm.minimumAcceptableDate;
      vm.selectedStatement;
      vm.minDate;
      vm.showCategory;
      vm.showStatementLink;
      vm.statement = 'Statement Period';
      vm.dateRangeDisplay = '';
      vm.buttons = {};
      vm.filterButton = false;
      vm.customMenuOptions;
      vm.selectedMenu = {};
      vm.categories;
      vm.categorySelected;
      vm.categoryDisplay=false;

      vm.filterParams = {
        rangeDates : {start:'',end:''},
        searchText : ''
      };

      $scope.$on('menuOptionsAvailable',function(evnt,menuOptions,merge) {
        if (!!merge) {
          if (angular.isArray(menuOptions)) {
            if (!angular.isDefined(vm.customMenuOptions)){
               vm.customMenuOptions = [];
            }
            vm.customMenuOptions = vm.customMenuOptions.concat(menuOptions)
            return;
          }
          angular.extend(vm.customMenuOptions,menuOptions);
        }
        else {
          vm.customMenuOptions = menuOptions;
        }

        vm.clearCategory();
      });

      $scope.$watchCollection(angular.bind(vm, function() {
        return [this.startDate, this.endDate]; // `this` IS the `this` above!!
      }), function () {
        vm.selectedStatement = null;
        vm.displayDates = !!vm.startDate || !!vm.endDate? true : false;

        if(vm.startDate&&vm.endDate&&vm.startDate!==vm.endDate) {
          vm.dateRangeDisplay = vm.startDate + ' - ' + vm.endDate;
        }
        else {
          vm.startDate ? vm.dateRangeDisplay = vm.endDate = vm.startDate : vm.dateRangeDisplay = vm.startDate = vm.endDate;
        }
        vm.resetMenuSelection();
        vm.filterParams.rangeDates = vm.displayDates ?
          {start: new Date(vm.startDate), end: new Date(vm.endDate)} : {start: null, end: null};
      });

      vm.handleMenuSelection = function(selectedMenu,clearSearchFilter) {
        vm.hideFilterMenu();
        vm.afterFilterMenuName = selectedMenu;
        if (!!clearSearchFilter){
          vm.filterParams.searchText = "";
        }
        $scope.$emit('onFilterMenuSelect',selectedMenu);
      }

      vm.hideFilterMenu = function() {
        for (var key in vm.buttons) {
        if (!angular.equals(key,'filterButton'))
          vm.buttons[key] = false;
        }
     }
      var getClassName = function(str) {
        return str.replace(/([A-Z])/g, function($1) {return '-'+$1.toLowerCase();}) + '-option' ;
      }

      vm.resetMenuSelection = function(whichButton,afterFilterMenuName){
          vm.afterFilterMenuName = afterFilterMenuName;
          $scope.$emit('onFilterMenuDeselect',whichButton);
      }
      $scope.$on('filteredbyStatement',function(evnt,statementObject) {
        if (!!statementObject) {
          vm.displayDates=true;
          if(vm.customMenuOptions){
            vm.resetMenuSelection('cardsButton','Card');
          }
          vm.clearCategory();
        }
         vm.dateRangeDisplay = '';
      });

      vm.selectCategory = function(category) {
        vm.categorySelected = category;
        vm.categoryDisplay = true;
        vm.hideFilterMenu();
        $scope.$emit('categorySelected', vm.categorySelected.value);
      };

      vm.clearCategory = function() {
        vm.categoryDisplay = false;
        vm.categorySelected = null;
        $scope.$emit('categoryClear');
      };

      vm.displayToggle = function(whichButton) {
        $timeout(function() {
          if (typeof vm.buttons[whichButton] === 'undefined') {
            vm.buttons[whichButton] = false;
          }

          if (vm.lastClickedButton &&
              vm.lastClickedButton!=='filterButton' &&
              vm.lastClickedButton!== whichButton) { // Hide menu when doubled clicked on it.
              vm.buttons[vm.lastClickedButton] = false;
          }
          vm.lastClickedButton = whichButton;
          vm.buttons[whichButton] = !vm.buttons[whichButton];
          if (vm.buttons[whichButton]) {
             $timeout(function() {
               if (document.getElementsByClassName(getClassName(whichButton))[0]) {
                    document.getElementsByClassName(getClassName(whichButton))[0].focus();
               }
             },200);
          }
         },200);
      };

     vm.isFilterVisible = function() {
        var tmpFilterCard= vm.afterFilterMenuName || '';
        return vm.buttons.filterButton||vm.displayDates||vm.categoryDisplay||(tmpFilterCard && tmpFilterCard.toLowerCase() !== 'card');
      }

      vm.selectStatementLink = function(){
          vm.displayToggle('dateButton');
        $scope.$emit('selectStatementLink');

      }


      vm.clearDates = function() {
        vm.startDate = null;
        vm.endDate = null;
        vm.displayDates = false;
        vm.selectedStatement=null;
        vm.resetMenuSelection('Date');
      }
    }

    return {
      restrict: 'AE',
      scope : {
        filterParams : '=filterCriteria',
        showStatementLink:'=?',
        selectedStatement:'=?',
        maximumAcceptableDate : '=',
        minimumAcceptableDate : '=',
        customMenuUrl : '=',
        showCategory:'=?',
        categories:'=?'
      },
      templateUrl: '/ease-ui/dist/partials/filter.html',
      bindToController: true,
      controller: ['$scope','$timeout', filterController],
      controllerAs: 'filterCtrl'
    }
  }

  function blurFn ($timeout) {
    return {
      restrict: 'A',
      link: function(scope,element,attrs){

        var list_blur_listening = true;

        element.bind('keydown', function(evt) {
          list_blur_listening = false;
          if (evt.which === 13 || evt.which === 32) {
            evt.currentTarget.click();
            scope.filterCtrl.hideFilterMenu();
            list_blur_listening = true;
          } else if (evt.which === 27) {
            $timeout(function () {
              scope.filterCtrl.hideFilterMenu();
           },200);
          }
        });

        element.bind('mousedown', function(evt) {
           list_blur_listening = false;
        });

      }
    }
  }
});
define('easeUtils-module',[
  'EaseProperties', 'optional', 'numeral',
  'ContentProperties', 'errorDetailsService', 'easeInterceptor',
  'easeUtils',
  'ContentProperties', 'EaseProperties', 'errorDetailsService', 'easeInterceptor', 'contentUtils',
  'customerPlatformDetailsUtils', 'displayModals', 'featureToggleUtils', 'messageUtils', 'prefetchUtils',
  'validationUtil',
  'commonModule', 'pubsubServiceModule', 'UniversalTranslate',
  'easeDropdownModule', 'dropdown', 'easeAccordion', 'easeGoogleMap',
  'accountServices', 'easeModal', 'easeLocalize', 'EaseTooltip',
  'EaseDatePicker', 'easeMultiDateSelector', 'easeDateRangePicker', 'filterComponent'
], function(angular) {
  require(['easeLodash'], function(){});
});


require(["easeUtils-module"]);

//# sourceMappingURL=easeCoreUtils-module.js.map
