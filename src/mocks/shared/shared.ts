import { RequestMethod, Response, ResponseOptions } from '@angular/http';

import { MockabilityResponses } from '@c1/mockability';
import {
  customerRetrieveMoneyMovementAccounts,
  contentSnag,
  customerRetrievePaymentAccounts,
  customerContentAlertPrefs,
  customerContentProfileprefs,
  customerFeatures,
  customerAlertsCoaf,
  customerAlertsCard,
  customerContentAcctpreferences,
  customerContentAddExternalAccount,
  customerContactPointsEmails,
  customerPhones
} from './shared.model';

export const sharedMocks: MockabilityResponses = [
  {
    url: /customer\/retrieveMoneyMovementAccounts/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(customerRetrieveMoneyMovementAccounts) }))
  },
  {
    url: /customer\/retrievePaymentAccounts/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(customerRetrievePaymentAccounts) }))
  },
  {
    url: /content\/snag/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(contentSnag) }))
  },
  {
    url: /customer\/content\/alertprefs/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(customerContentAlertPrefs) }))
  },
  {
    url: /customer\/content\/profileprefs/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(customerContentProfileprefs) }))
  },
  {
    url: /customer\/features/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(customerFeatures) }))
  },
  {
    url: /customer\/alerts\/coaf/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(customerAlertsCoaf) }))
  },
  {
    url: /customer\/alerts\/card/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(customerAlertsCard) }))
  },
  {
    url: /customer\/content\/acctpreferences/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(customerContentAcctpreferences) }))
  },
  {
    url: /customer\/content\/addexternalaccount/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(customerContentAddExternalAccount) }))
  },
  {
    url: /customer\/contact\-points\/emails/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(customerContactPointsEmails) }))
  },
  {
    url: /customer\/phones/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(customerPhones) }))
  }
];
