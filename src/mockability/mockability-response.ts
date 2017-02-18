import { RequestMethod, Response } from '@angular/http';

export type ResponseFunction = () => Response;

export interface MockabilityResponse {
  method: RequestMethod;
  url: RegExp;
  response: Response | ResponseFunction;
}
