import { RequestMethod, Response, ResponseOptions } from '@angular/http';

import { MockabilityResponses } from '@c1/mockability';
import {
  customerAccountSummary,
  customerContentAccountSummary,
  customerRetrieveMoneyMovementAccountsInternal,
  customerRetrieveMoneyMovementAccountsExternal,
  customerContentSnag,
  customerRetrievePaymentAccounts,
  customerContentAlertPrefs,
  customerContentProfileprefs,
  customerFeatures,
  customerFeaturesGroupName,
  customerAlertsCoaf,
  customerAlertsCard,
  customerContentAcctpreferences,
  customerContentAddExternalAccount,
  customerContactPointsEmails,
  customerPhones,
  customerRetrieveMessage,
  customerContentHeader,
  customerSessionTimeout,
  customerProfilePreferences,
  customerPlatformDetails
} from './shared.model';

export const sharedMocks: MockabilityResponses = [
  {
    url: /ease-app-web\/customer\/accountsummary$/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(customerAccountSummary) }))
  },
  {
    url: /ease-app-web\/customer\/content\/accountsummary\?localeInfo\=en-us$/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(customerContentAccountSummary) }))
  },
  {
    url: /ease-app-web\/customer\/retrieveMoneyMovementAccounts\?retrieveInternalAccount=Internal$/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(customerRetrieveMoneyMovementAccountsInternal) }))
  },
  {
    url: /ease-app-web\/customer\/retrieveMoneyMovementAccounts\?retrieveInternalAccount=External$/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(customerRetrieveMoneyMovementAccountsExternal) }))
  },
  {
    url: /ease-app-web\/customer\/retrievePaymentAccounts$/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(customerRetrievePaymentAccounts) }))
  },
  {
    url: /ease-app-web\/customer\/content\/snag\?localeInfo\=en-us$/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(customerContentSnag) }))
  },
  {
    url: /ease-app-web\/customer\/content\/alertprefs\?localeInfo\=en-us$/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(customerContentAlertPrefs) }))
  },
  {
    url: /ease-app-web\/customer\/content\/profileprefs\?localeInfo\=en-us$/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(customerContentProfileprefs) }))
  },
  {
    url: /ease-app-web\/customer\/features$/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(customerFeatures) }))
  },
  {
    url: /ease-app-web\/customer\/features?groupName=EASE.moneymovement$/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(customerFeaturesGroupName) }))
  },
  {
    url: /ease-app-web\/customer\/alerts\/coaf/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(customerAlertsCoaf) }))
  },
  {
    url: /ease-app-web\/customer\/alerts\/card/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(customerAlertsCard) }))
  },
  {
    url: /ease-app-web\/customer\/content\/acctpreferences\?localeInfo\=en-us$/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(customerContentAcctpreferences) }))
  },
  {
    url: /ease-app-web\/customer\/content\/addexternalaccount\?localeInfo\=en-us$/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(customerContentAddExternalAccount) }))
  },
  {
    url: /ease-app-web\/customer\/contact-points\/emails$/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(customerContactPointsEmails) }))
  },
  {
    url: /ease-app-web\/customer\/phones$/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(customerPhones) }))
  },
  {
    url: /ease-app-web\/customer\/messages\/retrieveMessage$/,
    method: RequestMethod.Post,
    response: new Response(new ResponseOptions({ body: JSON.stringify(customerRetrieveMessage) }))
  },
  {
    url: /ease-app-web\/customer\/content\/header\?localeInfo\=en-us$/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(customerContentHeader) }))
  },
  {
    url: /ease-app-web\/customer\/content\/sessiontimeout\?localeInfo\=en-us$/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(customerSessionTimeout) }))
  },
  {
    url: /ease-app-web\/customer\/profile\/preferences$/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(customerProfilePreferences) }))
  },
  {
    url: /ease-app-web\/customer\/customerPlatformDetails$/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: JSON.stringify(customerPlatformDetails) }))
  },
  {
    url: /ease-app-web\/.*\/prefetch$/,
    method: RequestMethod.Post,
    response: new Response(new ResponseOptions({ body: '' }))
  },
  {
    url: /ease-app-web\/customer\/keepalive$/,
    method: RequestMethod.Get,
    response: new Response(new ResponseOptions({ body: '' }))
  }
];
