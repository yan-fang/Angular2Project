import { RequestMethod, Response, ResponseOptions } from '@angular/http';

import { MockabilityResponses } from '@c1/mockability';
import {
  contentTransfer,
  transferGetAccounts,
  submitMoneyTransfer,
  getTransferDetails,
  deleteScheduledTransfer,
  updateTransferDetails
} from './transfer-dialog.model';

export const transferAccountsMocks: MockabilityResponses = [
  {
    url: /ease-app-web\/customer\/transfer\/getAccounts$/,
    method: RequestMethod.Post,
    response: new Response(new ResponseOptions({ body: JSON.stringify(transferGetAccounts) }))
  },
  {
    url: /ease-app-web\/customer\/content\/transfer\?localeInfo=en-us$/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(contentTransfer) }))
  },
  {
    url: /ease-app-web\/customer\/transfer\/submitMoneyTransfer$/,
    method: RequestMethod.Post,
    response: new Response(new ResponseOptions({ body: JSON.stringify(submitMoneyTransfer) }))
  },
  {
    url: /ease-app-web\/customer\/transfer\/getTransferDetails$/,
    method: RequestMethod.Post,
    response: new Response(new ResponseOptions({ body: JSON.stringify(getTransferDetails) }))
  },
  {
    url: /ease-app-web\/customer\/transfer\/deleteScheduledTransfer$/,
    method: RequestMethod.Post,
    response: new Response(new ResponseOptions({ body: JSON.stringify(deleteScheduledTransfer) }))
  },
  {
    url: /ease-app-web\/customer\/transfer\/updateTransferDetails$/,
    method: RequestMethod.Post,
    response: new Response(new ResponseOptions({ body: JSON.stringify(updateTransferDetails) }))
  }
];
