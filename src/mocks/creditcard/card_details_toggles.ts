import { RequestMethod, Response, ResponseOptions } from '@angular/http';

import { MockabilityResponses } from 'mockability';
import { response } from './card_details_toggles.model';

export const cardDetailsToggles: MockabilityResponses = [
  {
    url: /api\/ease\/card_details_toggles/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({
      body: JSON.stringify(response)
    }))
  }
];
