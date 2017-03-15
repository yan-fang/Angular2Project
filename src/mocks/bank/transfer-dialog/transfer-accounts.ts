import { RequestMethod, Response, ResponseOptions } from '@angular/http';

import { MockabilityResponses } from '@c1/mockability';
import { transferAccounts } from './transfer-accounts.model';
import { transferContent } from './transfer-content.model';

export const transferAccountsMocks: MockabilityResponses = [
  {
    url: /getAccounts/,
    method: RequestMethod.Post,
    response: new Response(new ResponseOptions({ body: JSON.stringify(transferAccounts) }))
  },
    {
    url: /content\/transfer/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(transferContent) }))
  }
];
