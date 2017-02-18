import { RequestMethod, Response, ResponseOptions } from '@angular/http';

import { MockabilityResponse } from 'mockability';

export const requests: MockabilityResponse[] = [
  {
    url: /api\/card-accounts/,
    method: RequestMethod.Get,
    response: () => {
      return new Response(new ResponseOptions({ body: JSON.stringify([{ accountId: '12345' }]) }));
    }
  }
];
