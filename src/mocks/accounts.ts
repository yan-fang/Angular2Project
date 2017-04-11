import { RequestMethod, Response, ResponseOptions } from '@angular/http';

import { MockabilityResponses } from '@c1/mockability';

export const requests: MockabilityResponses = [
  {
    url: /api\/card-accounts$/,
    method: RequestMethod.Get,
    response: () => {
      return new Response(new ResponseOptions({ body: JSON.stringify([{ accountId: '12345' }]) }));
    }
  }
];
