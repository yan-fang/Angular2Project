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
    url: /ease-app-web\/AutoLoan\/getAccountById/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(getAccountById) }))
  },
  {
    url: /ease-app-web\/AutoLoan\/dynamicAccountService/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(dynamicAccountService) }))
  },
  {
    url: /ease-app-web\/AutoLoan\/paymentPlan/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(paymentPlan) }))
  },
  {
    url: /ease-app-web\/AutoLoan\/paymentPlan\/(.*)\/getCurrentDate/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(paymentPlanGetCurrentDate) }))
  },
  {
    url: /ease-app-web\/AutoLoan\/paymentPlan\/(.*)\/getPaymentPlan/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(paymentPlanGetPaymentPlan) }))
  },
  {
    url: /ease-app-web\/AutoLoan\/accounts\/(.*)\/due\-date\-change\-history/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(dueDateChangeHistory) }))
  },
  {
    url: /ease-app-web\/AutoLoan\/accounts\/(.*)\/payment-catchup/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(paymentCatchup) }))
  },
  {
    url: /ease-app-web\/AutoLoan\/accounts\/(.*)\/calculator/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(calculator) }))
  },
  {
    url: /ease-app-web\/AutoLoan\/UmmPayments/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(ummPayments) }))
  },
  {
    url: /ease-app-web\/AutoLoan\/getPaymentAmounts/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(getPaymentAmounts) }))
  },
  {
    url: /ease-app-web\/AutoLoan\/paymentInstruction/,
    method: RequestMethod.Post,
    response: new Response(new ResponseOptions({ body: JSON.stringify(paymentInstruction) }))
  },
  {
    url: /ease-app-web\/AutoLoan\/accounts\/(.*)\/events/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(accounts) }))
  },
  {
    url: /ease-app-web\/AutoLoan\/accounts\/(.*)\/calculator\?oneTimePaymentAmount/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(accountsCalculatoroneTimePaymentAmount) }))
  },
  {
    url: /ease-app-web\/AutoLoan\/accounts\/(.*)\/calculator\?totalMonthlyPaymentAmount/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(accountsCalculatorTotalMonthlyPaymentAmount) }))
  },
  {
    url: /ease-app-web\/AutoLoan\/accounts\/(.*)\/documents\?fromDate/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(accountDocumentsFromDate) }))
  },
  {
    url: /ease-app-web\/AutoLoan\/accounts\/(.*)\/ddceligibility/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(accountDdcEligibility) }))
  },
  {
    url: /ease-app-web\/AutoLoan\/preferences\/paperless/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(preferencesPaperless) }))
  }
];
