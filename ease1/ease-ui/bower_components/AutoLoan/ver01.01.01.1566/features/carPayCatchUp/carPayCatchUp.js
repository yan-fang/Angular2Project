define(['angular',
    'noext!/ease-ui/bower_components/AutoLoan/ver01.01.01.1566/features/carPayCatchUp/carPayCatchUp.service.js?',
    'noext!/ease-ui/bower_components/AutoLoan/ver01.01.01.1566/features/carPayCatchUp/carPayCatchUp.controller.js?',
    'noext!/ease-ui/bower_components/AutoLoan/ver01.01.01.1566/features/carPayCatchUp/helpIsOnTheWay.controller.js?',
    'noext!/ease-ui/bower_components/AutoLoan/ver01.01.01.1566/features/carPayCatchUp/monthlyPayment.controller.js?',
    'noext!/ease-ui/bower_components/AutoLoan/ver01.01.01.1566/features/carPayCatchUp/whatAboutByDate.controller.js?',
    'noext!/ease-ui/bower_components/AutoLoan/ver01.01.01.1566/features/carPayCatchUp/contactUs.controller.js?',
    'noext!/ease-ui/bower_components/AutoLoan/ver01.01.01.1566/features/carPayCatchUp/planSummary.controller.js?',
    'noext!/ease-ui/bower_components/AutoLoan/ver01.01.01.1566/features/carPayCatchUp/carPayCatchupError.controller.js?',
    'noext!/ease-ui/bower_components/AutoLoan/ver01.01.01.1566/features/carPayCatchUp/customizePlan.controller.js?',
    'noext!/ease-ui/bower_components/AutoLoan/ver01.01.01.1566/features/carPayCatchUp/selectPaymentAccount.controller.js?',
    'noext!/ease-ui/bower_components/AutoLoan/ver01.01.01.1566/features/carPayCatchUp/areYouSure.controller.js?',
    'noext!/ease-ui/bower_components/AutoLoan/ver01.01.01.1566/features/carPayCatchUp/cancel-payment.directive.js?',
    'noext!/ease-ui/bower_components/AutoLoan/ver01.01.01.1566/features/carPayCatchUp/controllers/cancel-payment.controller.js?',
    'noext!/ease-ui/bower_components/AutoLoan/ver01.01.01.1566/features/carPayCatchUp/reviewPlan.controller.js?',
    'noext!/ease-ui/bower_components/AutoLoan/ver01.01.01.1566/features/carPayCatchUp/confirmation.controller.js?'],

  function(angular,
           carPayCatchUpService,
           carPayCatchUpController,
           helpIsOnTheWayController,
           monthlyPaymentController,
           whatAboutByDateController,
           cpcuContactUsController,
           planSummaryController,
           autoLoanCarPayCatchupErrorController,
           customizePlanController,
           selectPaymentAccountController,
           areYouSureController,
           cancelPaymentDirective,
           cancelPaymentController,
           reviewPlanController,
           carPayCatchupConfirmationController) {
    'use strict';

    return angular.module('CarPayCatchUpModule', [])
      .service('carPayCatchUpService', carPayCatchUpService)
      .controller('CarPayCatchUpController', carPayCatchUpController)
      .controller('HelpIsOnTheWayController', helpIsOnTheWayController)
      .controller('MonthlyPaymentController', monthlyPaymentController)
      .controller('WhatAboutByDateController', whatAboutByDateController)
      .controller('CPCUContactUsController', cpcuContactUsController)
      .controller('PlanSummaryController', planSummaryController)
      .controller('AutoLoanCarPayCatchupErrorController', autoLoanCarPayCatchupErrorController)
      .controller('CustomizePlanController', customizePlanController)
      .controller('SelectPaymentAccountController', selectPaymentAccountController)
      .controller('AreYouSureController', areYouSureController)
      .directive('cancelPayment', cancelPaymentDirective)
      .controller('CancelPaymentController', cancelPaymentController)
      .controller('ReviewPlanController', reviewPlanController)
      .controller('CarPayCatchupConfirmationController', carPayCatchupConfirmationController);
  });