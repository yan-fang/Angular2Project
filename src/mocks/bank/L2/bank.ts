import { RequestMethod, Response, ResponseOptions } from '@angular/http';

import { MockabilityResponses } from '@c1/mockability';
import { accountSummary, accountById, accounts, upcomingTransactions } from './bank.model';

export const bankMocks: MockabilityResponses = [
  {
    url: /accountsummary/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(accountSummary) }))
  },
  {
    url: /Bank\/getAccountById/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(accountById) }))
  },
  {
    url: /Bank\/accounts/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(accounts) }))
  },
  {
    url: /Bank\/upcoming\-transactions/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(upcomingTransactions) }))
  }
];
