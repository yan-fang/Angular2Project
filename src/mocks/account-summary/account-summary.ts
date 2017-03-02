import { RequestMethod, Response, ResponseOptions } from '@angular/http';

import { MockabilityResponses } from '@c1/mockability';
import { accounts } from './account-summary.model';

export const accountSummaryMocks: MockabilityResponses = [
  {
    url: /api\/customer\/accountSummary/,
    method: RequestMethod.Get,
    response: () => {
      return new Response(new ResponseOptions({ body: JSON.stringify(accounts) }));
    }
  }
];
