import { Response, ResponseOptions } from '@angular/http';

import { MockabilityResponses } from '@c1/mockability';
import { requestActionsMap, RequestAction } from './request-action-map';

let responses: MockabilityResponses = [];

Object
  .keys(requestActionsMap)
  .forEach((key: string) => {
    responses.push(makeResponse(requestActionsMap[key]));
  });

export const responseDefinitions = responses;

function makeResponse(requestAction: RequestAction) {
  return {
    url: requestAction.urlRegex,
    method: requestAction.method,
    response: new Response(new ResponseOptions({
      body: JSON.stringify(requestAction.responseData)
    }))
  };
}
