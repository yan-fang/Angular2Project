import { RequestMethod, Response, ResponseOptions } from '@angular/http';

import { MockabilityResponses } from '@c1/mockability';
import {
  getAccountById,
  dynamicAccountService,
  paymentPlan,
  paymentPlanGetCurrentDate,
  paymentPlanGetPaymentPlan,
  dueDateChangeHistory,
  paymentCatchup,
  calculator,
  ummPayments,
  getPaymentAmounts,
  paymentInstruction,
  accounts,
  accountsCalculatoroneTimePaymentAmount,
  accountsCalculatorTotalMonthlyPaymentAmount,
  accountDocumentsFromDate,
  accountDdcEligibility,
  preferencesPaperless
} from './auto-loan.model';

export const autoLoanMocks: MockabilityResponses = [
  {
    url: /AutoLoan\/getAccountById/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(getAccountById) }))
  },
  {
    url: /AutoLoan\/dynamicAccountService/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(dynamicAccountService) }))
  },
  {
    url: /AutoLoan\/paymentPlan/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(paymentPlan) }))
  },
  {
    url: /AutoLoan\/paymentPlan\/(.*)\/getCurrentDate/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(paymentPlanGetCurrentDate) }))
  },
  {
    url: /AutoLoan\/paymentPlan\/(.*)\/getPaymentPlan/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(paymentPlanGetPaymentPlan) }))
  },
  {
    url: /AutoLoan\/accounts\/(.*)\/due\-date\-change\-history/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(dueDateChangeHistory) }))
  },
  {
    url: /AutoLoan\/accounts\/(.*)\/payment-catchup/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(paymentCatchup) }))
  },
  {
    url: /AutoLoan\/accounts\/(.*)\/calculator/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(calculator) }))
  },
  {
    url: /AutoLoan\/UmmPayments/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(ummPayments) }))
  },
  {
    url: /AutoLoan\/getPaymentAmounts/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(getPaymentAmounts) }))
  },
  {
    url: /AutoLoan\/paymentInstruction/,
    method: RequestMethod.Post,
    response: new Response(new ResponseOptions({ body: JSON.stringify(paymentInstruction) }))
  },
  {
    url: /AutoLoan\/accounts\/(.*)\/events/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(accounts) }))
  },
  {
    url: /AutoLoan\/accounts\/(.*)\/calculator\?oneTimePaymentAmount/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(accountsCalculatoroneTimePaymentAmount) }))
  },
  {
    url: /AutoLoan\/accounts\/(.*)\/calculator\?totalMonthlyPaymentAmount/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(accountsCalculatorTotalMonthlyPaymentAmount) }))
  },
  {
    url: /AutoLoan\/accounts\/(.*)\/documents\?fromDate/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(accountDocumentsFromDate) }))
  },
  {
    url: /AutoLoan\/accounts\/(.*)\/ddceligibility/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(accountDdcEligibility) }))
  },
  {
    url: /AutoLoan\/preferences\/paperless/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(preferencesPaperless) }))
  }
];
