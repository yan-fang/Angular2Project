import { RequestMethod, Response, ResponseOptions } from '@angular/http';

import { MockabilityResponses } from '@c1/mockability';
import {
  accountSummary,
  contentHeader,
  contentTransfer,
  sessionTimeout,
  profilePreferences,
  transferGetAccounts,
  customerFeatures,
  submitMoneyTransfer,
  getTransferDetails,
  deleteScheduledTransfer,
  updateTransferDetails
} from './transfer-dialog.model';

export const transferAccountsMocks: MockabilityResponses = [
  {
    url: /transfer\/getAccounts/,
    method: RequestMethod.Post,
    response: new Response(new ResponseOptions({ body: JSON.stringify(transferGetAccounts) }))
  },
  {
    url: /accountsummary/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(accountSummary) }))
  },
  {
    url: /content\/header/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(contentHeader) }))
  },
  {
    url: /content\/transfer/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(contentTransfer) }))
  },
  {
    url: /content\/sessiontimeout/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(sessionTimeout) }))
  },
  {
    url: /customer\/profile\/preferences/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(profilePreferences) }))
  },
  {
    url: /customer\/features/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(customerFeatures) }))
  },
  {
    url: /customer\/transfer\/submitMoneyTransfer/,
    method: RequestMethod.Post,
    response: new Response(new ResponseOptions({ body: JSON.stringify(submitMoneyTransfer) }))
  },
  {
    url: /customer\/transfer\/getTransferDetails/,
    method: RequestMethod.Post,
    response: new Response(new ResponseOptions({ body: JSON.stringify(getTransferDetails) }))
  },
  {
    url: /customer\/transfer\/deleteScheduledTransfer/,
    method: RequestMethod.Post,
    response: new Response(new ResponseOptions({ body: JSON.stringify(deleteScheduledTransfer) }))
  },
  {
    url: /customer\/transfer\/updateTransferDetails/,
    method: RequestMethod.Post,
    response: new Response(new ResponseOptions({ body: JSON.stringify(updateTransferDetails) }))
  }
];
