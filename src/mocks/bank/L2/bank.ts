import { RequestMethod, Response, ResponseOptions } from '@angular/http';

import { MockabilityResponses } from '@c1/mockability';
import {
  savingsAccount,
  accounts,
  savingsUpcomingTransactions,
  checkingUpcomingTransactions,
  checkingAccount
} from './bank.model';

export const bankMocks: MockabilityResponses = [
  {
    url: /Bank\/getAccountById\/(.*)productId\=3000/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(savingsAccount) }))
  },
  {
    url: /Bank\/getAccountById\/(.*)productId\=IM218/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(checkingAccount) }))
  },
  {
    url: /Bank\/upcoming\-transactions\/(.*)productId\=3000/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(savingsUpcomingTransactions) }))
  },
  {
    url: /Bank\/upcoming\-transactions\/(.*)productId\=IM218/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(checkingUpcomingTransactions) }))
  },
  {
    url: /Bank\/accounts/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(accounts) }))
  }
];
