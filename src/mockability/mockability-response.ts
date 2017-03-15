import { RequestMethod, Response } from '@angular/http';
import { OpaqueToken } from '@angular/core';

export type ResponseFunction = () => Response;

export interface MockabilityResponse {
  method: RequestMethod;
  url: RegExp;
  response: Response | ResponseFunction;
}

export type MockabilityResponses = MockabilityResponse[];

export const MOCKABILITY_RESPONSES = new OpaqueToken('mockability.responses');
