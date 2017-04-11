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
    url: /ease-app-web\/Bank\/getAccountById\/(.*)productId\=3000/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(savingsAccount) }))
  },
  {
    url: /ease-app-web\/Bank\/getAccountById\/(.*)productId\=IM218/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(checkingAccount) }))
  },
  {
    url: /ease-app-web\/Bank\/upcoming\-transactions\/(.*)productId\=3000/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(savingsUpcomingTransactions) }))
  },
  {
    url: /ease-app-web\/Bank\/upcoming\-transactions\/(.*)productId\=IM218/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(checkingUpcomingTransactions) }))
  },
  {
    url: /ease-app-web\/Bank\/accounts$/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(accounts) }))
  }
];
