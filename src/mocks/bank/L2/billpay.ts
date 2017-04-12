import { RequestMethod, Response, ResponseOptions } from '@angular/http';

import { MockabilityResponses } from '@c1/mockability';
import {
  billPayFeatureToggle,
  billPayPayee
} from './billpay.model';

export const billPayMocks: MockabilityResponses = [
  {
    url: /ease-app-web\/BillPay\/featureToggle$/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(billPayFeatureToggle) }))
  },
  {
    url: /ease-app-web\/BillPay\/payee\?accountReferenceId/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(billPayPayee) }))
  }
];
