
function buildPaymentPath(file) {
  return 'noext!/ease-ui/bower_components/AutoLoan/ver01.01.01.1566/features/payment/' + file + '?';
}

define([
  'angular',
  buildPaymentPath('payment-controller.js'),
  buildPaymentPath('payment-service.js'),
  buildPaymentPath('paymentplan/paymentplan-controller.js'),
  buildPaymentPath('payoff/payoff-controller.js'),
  buildPaymentPath('payoff/payoff-service.js')
], function(angular, paymentControllers, paymentServices, paymentPlan, payoffControllers, payoffServices) {

  return angular.module('AutoLoanPaymentModule', [])
    .service('autoLoanPaymentService', paymentServices.autoLoanPaymentService)
    .service('autoLoanPaymentAddAccountService', paymentServices.autoLoanPaymentAddAccountService)
    .service('refreshTransactionsService', paymentServices.refreshTransactionsService)
    .controller('AutoLoanPaymentController', paymentControllers.AutoLoanPaymentController)
    .controller('AutoLoanOneTimePaymentController', paymentControllers.AutoLoanOneTimePaymentController)
    .controller('AutoLoanPaymentSuccessController', paymentControllers.AutoLoanPaymentSuccessController)
    .controller('AutoLoanOneTimePaymentCancel', paymentControllers.AutoLoanOneTimePaymentCancel)
    .controller('AutoLoanPaymentCancelSuccess', paymentControllers.AutoLoanPaymentCancelSuccess)
    .controller('AutoLoanPaymentDetails', paymentControllers.AutoLoanPaymentDetails)

    .service('autoLoanPaymentPlanUtil', paymentPlan.autoLoanPaymentPlanUtil)
    .service('createAutoLoanPaymentService', paymentPlan.createAutoLoanPaymentService)
    .service('deleteAutoLoanPaymentService', paymentPlan.deleteAutoLoanPaymentService)
    .controller('AutoLoanPaymentPlanController', paymentPlan.AutoLoanPaymentPlanController)
    .controller('AutoLoanPaymentPlanSuccessController', paymentPlan.AutoLoanPaymentPlanSuccessController)
    .controller('AutoLoanPaymentPlanDetailsController', paymentPlan.AutoLoanPaymentPlanDetailsController)
    .controller('AutoLoanPaymentPlanDeleteController', paymentPlan.AutoLoanPaymentPlanDeleteController)
    .controller('AutoLoanPaymentPlanDeleteSuccessController', paymentPlan.AutoLoanPaymentPlanDeleteSuccessController)

    .service('autoLoanPaymentPayoffUtil', payoffServices.autoLoanPaymentPayoffUtil)
    .controller('AutoLoanPayOffPaymentController', payoffControllers.AutoLoanPayOffPaymentController)
    .controller('AutoLoanPayOffSummaryController', payoffControllers.AutoLoanPayOffSummaryController);
});
