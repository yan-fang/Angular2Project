define(['angular'], function(angular) {
  'use strict';
  angular.module('EaseProperties', []).constant('EaseConstant', {
    //to use AWS mock data, simply add /mock in the end of this url, and remove for using the real services
    baseUrl: '/ease-app-web',
    kBuildVersion: '1490660920702',
    kBuildVersionPath: '1490660920702' ? '/ver1490660920702' : '',
    env: {
      type: 'dev',
      source: '/ease-ui/dist'
    },
    kEnglishLocale: 'en-US',
    kSpanishLocale: 'es-US',
    nextButtonImg: '/ease-ui/ver1490660920702/dist/features/AccountDetail/images/btn-next.svg',
    prevButtonImg: '/ease-ui/ver1490660920702/dist/features/AccountDetail/images/btn-prev.svg',
    atmFilterImg: '/ease-ui/ver1490660920702/dist/images/icon_filter.svg',
    datePickerImg: '/ease-ui/ver1490660920702/dist/images/date-picker.png',
    cautionImg: '/ease-ui/ver1490660920702/dist/images/modal-icon-caution.svg',
    kIdleTime: 540, //Timer for user idle duration
    kTimeoutTime: 60, //Timer for the countdown on session timeout modal
    kPrefetchCallTimeout:500, //Timeout set for prefetch call
    keepaliveInterval: 10 * 60,
    moduleName: 'summary',
    kUndefined: 'undefined',
    states: {
      kWelcome: 'welcome',
      kAccountSummaryError: 'accountSummary.error',
      kAccountSummary: 'accountSummary',
      kEscid: 'escid',
      kAccountDetailTransactions: 'accountDetails.transactions',
      kAccountDetailSettings: 'accountDetails.settings',
      kAccountPreferences: 'customerSettings.settings',
      kCreditCardDeepLink: 'ChooseAccount',
      kCreditCardDeepLinkUrl: '/Card/ChooseAccount',
      kVerify: 'verify',
      kProfile: 'customerSettings.profile'
    },
    kInitMessageCacheUrl: 'customer/messages/initMessagesCache',
    kAccountSummaryRetrieveUrl: 'customer/accountsummary',
    kGetMessageUrl: 'customer/messages/retrieveMessage',
    kGetCreditCardDetailsUrl: 'customer/carddetails',
    kFeaturesRetrieveUrl: 'customer/features',
    kLogoutUrl: 'customer/logout',
    kGetResponseMessageUrl: 'customer/messages/respondToMessage',
    kProfilePreferences: 'customer/profile/preferences',
    kProfileAddEmail: 'customer/contact-points/emails',
    kAcctPreferencesUpdateNickName: 'customer/updateNickname',
    kAcctPreferencesRetrievePaymentAccounts: 'customer/retrievePaymentAccounts',
    kRetrieveMoneyMovementAccounts: 'customer/retrieveMoneyMovementAccounts',
    kUmmMakeTransfer: 'customer/transfer/submitMoneyTransfer',
    kUmmUpdateMoneyTransfer: 'customer/transfer/updateTransferDetails',
    kUmmCancelTransfer: 'customer/transfer/deleteScheduledTransfer',
    kUmmTransferGetAccounts: 'customer/transfer/getAccounts',
    kUmmTransferGetDetails: 'customer/transfer/getTransferDetails',
    kAtmFinderUrl: 'customer/locations/banking',
    kbankDetailsUrl: 'customer/getBankDetails/',
    kSaveExtBankUrl: 'customer/addPaymentAccounts',
    kSaveExternalUrl: 'customer/editExtPaymentAccounts',
    kAddExtBankUrl: 'customer/addExtPaymentAccounts',
    kDeleteExtBankUrl: 'customer/deletePaymentAccounts',
    kDeleteExtAccountUrl: 'customer/deleteExtPaymentAccounts',
    keepaliveUrl: '/customer/keepalive',
    kGetEmailUrl: 'customer/contact-points/emails',
    kDeleteEmailUrl: 'customer/contact-points/emails/delete',
    kDeletePhoneUrl: 'customer/phone',
    kDeleteSmallBusinessPhoneUrl: 'customer/business/phones/delete',
    kGetPhoneNumbersUrl: 'customer/phones',
    kGetSmallBusinessPhoneNumbersUrl: 'customer/business/phones',
    kGetKnownPhoneNumbersUrl: 'customer/getKnownPhones',
    kPutPhoneNumbersUrl: 'customer/phone',
    kPutSmallBusinessPhoneNumbersUrl: 'customer/business/phones/add',
    kPostSmallBusinessPhoneNumbersUrl: 'customer/business/phones/update',
    kAllPhonesUrl: 'customer/saveAllPhones',
    kplatformVerificationUrl: 'customer/verify',
    defaultServiceCallTimeout: 1000,
    profileImage: '',
    kTransferAmountUpperBound: '999999.99',
    kTransferAmountLowerBound: '0.01',
    kchangePassword: 'customer/security/password',
    kchangeUserName: 'customer/security/username',
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
    kPathUMMPaymentemplate: '/ease-ui/ver1490660920702/dist/features/UMMPayment/',
    kPathTransactiontemplate: '/ease-ui/ver1490660920702/dist/features/Transfer',
    kPathCroptemplate: '/ease-ui/ver1490660920702/dist/features/CustomerSettings/html/',
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
      al: ['/ease-ui/bower_components/AutoLoan/partials/', 'AutoLoan.html', 'AutoLoan-transactions.html'],
      sa: ['/ease-ui/bower_components/saving-retail/partials/', 'saving.html', 'saving-transactions.html'],
      sa360: ['/ease-ui/bower_components/saving-360/partials/', 'saving-360.html', 'saving-360-transactions.html'],
      dda: ['/ease-ui/bower_components/checking-retail/partials/', 'checking.html', 'checking-transactions.html'],
      dda360: ['/ease-ui/bower_components/checking-360/partials/', 'checking-360.html',
        'checking-360-transactions.html'
      ],
      mma: ['/ease-ui/bower_components/mma/partials/', 'mma.html', 'mma-transactions.html'],
      cd: ['/ease-ui/bower_components/cd/partials/', 'cd.html', 'cd-transactions.html'],
      hl: ['/ease-ui/bower_components/HomeLoans/partials/', 'HomeLoans.html', 'HomeLoans-transactions.html'],
      mla: ['/ease-ui/bower_components/HomeLoans/partials/', 'HomeLoans.html', 'HomeLoans-transactions.html'],
      hil: ['/ease-ui/bower_components/HomeLoans/partials/', 'HomeLoans.html', 'HomeLoans-transactions.html'],
      hlc: ['/ease-ui/bower_components/HomeLoans/partials/', 'HomeLoans.html', 'HomeLoans-transactions.html'],
      cc: ['/ease-ui/bower_components/CreditCard/partials/', 'CreditCard.html', 'CreditCard-transactions.html']
    },
    kCacheRefresh: 'cacheRefresh',
    cacheRefresh: {
      nickname: ['customer/cacheRefresh', 'CreditCard/cacheRefresh', 'Bank/cacheRefresh'],
      accountSummary: ['customer/cacheRefresh'],
      transfers: ['customer/cacheRefresh', 'Bank/cacheRefresh']
    },
    customerSettings: {
      kSettings: 'ease.core.profileprefs.accountprefs.label',
      kPersonalInfo: 'ease.core.profileprefs.pagetitle.label',
      kSignOut: 'ease.core.profileprefs.signout.label',
      kAlerts: 'ease.core.profileprefs.messagesalerts.label',
      accountPreference: {
        baseImageLocation: '/ease-ui/ver1490660920702/dist/features/CustomerSettings/images/',
        deleteICON: '/ease-ui/ver1490660920702/dist/features/CustomerSettings/images/clearfield.png',
        editICON: '/ease-ui/ver1490660920702/dist/features/CustomerSettings/images/customerSettingsEdit.png',
        checkICON: '/ease-ui/ver1490660920702/dist/features/CustomerSettings/images/profileCheckmarkIcon.png',
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
    kDefaultPdfUrl: '/ease-ui/ver1490660920702/dist/file/NotFound.pdf',
    kDefaultPdfScale: 1.6,

    easeHeaderOptions: {
      capOneIcon: '/ease-ui/ver1490660920702/dist/features/AccountSummary/images/capital_one_logo.svg',
      sneakPeekIcon: '/ease-ui/ver1490660920702/dist/features/Login/images/sneak-peek.svg',
      profileOptionsPartial: '/ease-ui/dist/features/SummaryHeader/html/partials/authenticatedProfile.html',
      backButtonPartial: '/ease-ui/dist/features/SummaryHeader/html/partials/backButton.html',
      navAuthenticated: '/ease-ui/dist/features/SummaryHeader/html/partials/authenticatedNav.html'
    },
    easeFooterOptions: {
      fdic: '/ease-ui/ver1490660920702/dist/features/GlobalFooter/images/fdic.jpg',
      house: '/ease-ui/ver1490660920702/dist/features/GlobalFooter/images/house.jpg',
      norton: '/ease-ui/ver1490660920702/dist/features/GlobalFooter/images/norton.jpg'
    },
    features: {
      transferFeatureName: 'ease.core.transferbutton.v1',
      transferScheduledCancelFeatureName: 'ease.core.transferscheduledcancel.v1',
      transferScheduledEditFeatureName: 'ease.core.transferschedulededit.v1',
      transferScheduledFeature: 'ease.core.transferscheduled.v1',
      transferFrequencyFeature: 'ease.core.transferfrequency.v1',
      coafSingleAccountTransactionViewFeature: 'ease.coaf.singleaccounttrxview.v1',
      globalMessageFeatureName: 'ease.core.globalmessaging.v1',
      addExternalAccountFeature: 'ease.core.managePaymentService.v1',
      nickNameFeature: 'ease.core.accountnickname.v1',
      usabillaFeature: 'ease.core.usabilla.v1',
      adobeTargetFeature: 'ease.core.adobeTarget.v1',
      chat247: 'ease.core.chat247.v1',
      cardDetails: 'ease.core.carddetails.v1',
      manageExternalAccountFeature: 'ease.core.manageexternalaccounts.v1',
      enableRetailNavigation: 'ease.core.enableretailnavigation.v1',
      manageExternalDelAccountFeature: 'ease.core.manageexternaldelaccounts.v1',
      enableMudFlap: 'ease.core.mudflap.v1',
      isRetailToggleRestricted: 'ease.retail.accounttiles.v1',
      enableEscapeHatch: 'ease.core.escapehatch.v1',
      enableCofiTileNavigation: 'ease.core.cofi.v1',
      enableCofiTileDisplay: 'ease.cofi.accounttiles.display.v1',
      cofiCTAButton: 'ease.core.cofi.ctabutton.v1',
      enableATMFinder: 'ease.core.atmfinder.v1',
      enableHELOCScheduled: 'ease.core.helocscheduled.v1',
      showCICLinkFeature: 'ease.core.personalinfo.CICLink.v1',
      enableShowEmail: 'ease.core.showEmail.v1',
      enableAddEmail: 'ease.core.addEmail.v1',
      enableEditEmail: 'ease.core.editEmail.v1',
      enableChangePassword: 'ease.core.changepassword.v1',
      enableChangeUsername: 'ease.core.changeusername.v1',
      enableEditUsername: 'ease.core.editusername.v1',
      enableShowPhone: 'ease.core.showPhone.v1',
      enableEditPhone:'ease.core.editPhone.v1',
      enableShowSmallBusinessPhone: 'ease.core.showSmallBusinessPhone.v1',
      enableEditSmallBusinessPhone: 'ease.core.editSmallBusinessPhone.v1',
      enableEditPassword: 'ease.core.editpassword.v1',
      enableDisplayAlerts: 'ease.core.displayalerts.v1',
      enableDisplayCoafAlerts: 'ease.coaf.displayalerts.v1',
      enableDisplayCardAlerts: 'ease.card.displayalerts.v1',
      enableEditAlerts: 'ease.core.editalerts.v1',
      enableEditCardAlerts: 'ease.card.editalerts.v1',
      enableDisplaySecurityAlerts: 'ease.card.displaysecurityalerts.v1',
      enableDisplayOsrAlerts: 'ease.card.displayosralerts.v1',
      enableShowAddress: 'ease.core.showaddress.v1',
      enableEditBankAddress: 'ease.core.editbankaddress.v1',
      enableEditCardAddress: 'ease.core.editcardaddress.v1',
      enableEditGreetingName: 'ease.core.editgreeting.v1',
      enableMigrateFeature: 'ease.core.displaymigrate.v1',
      enablePhoneOnMigrate: 'ease.core.migrate.displayphone.v1',
      enableEmailOnMigrate: 'ease.core.migrate.displayemail.v1',
      enableEditPicture: 'ease.core.editpicture.v1',
      enableShowLanguage: 'ease.core.showLanguage.v1',
      enableEditLanguage: 'ease.core.editLanguage.v1',
      combinedmoneymovementAccounts: 'ease.core.combinedmoneymovement.v1',
      retrieveMoneyMovementAccounts: 'ease.core.retrievemoneymovement.v1',
      defaultPaymentAccount: 'ease.core.defaultpaymentaccounts.v1',
      editExternalAccountFeature: 'ease.core.manageexternaleditaccounts.v1',
      groups: {
        security: 'EASE.security',
        alerts: 'EASE.alerts',
        migrate: 'EASE.migrate',
        moneymovement: 'EASE.moneymovement'
      }
    },
    busEvtExceptionCause: 'Business Event ID is passed as null',
    busEvtExceptionMesage: 'Please pass in a valid Business event ID',
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
      editTransfer: '/:moneyTransferReferenceId/TransferEdit',
      cancelTransfer: '/:moneyTransferReferenceId/TransferCancel',
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
      },
      'heloc': {
        'external': {
          'cutOffHour': 15,
          'before': 5,
          'after': 6
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
