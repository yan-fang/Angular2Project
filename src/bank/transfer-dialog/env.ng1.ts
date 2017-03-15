import { Injector } from '@angular/core';

export type Response = {
  requireDeps: string[];
  angularDeps: string[];
  runFunctions: Function[]
};

export function addEnvDeps(requireDeps: string[], angularDeps: string[], injector: Injector): Response {
  const registerMockabilityResponses = injector.get('registerMockabilityResponsesWithAngular1', null);

  if (registerMockabilityResponses) {
    return ({
      requireDeps: [...requireDeps, 'angularMocks'],
      angularDeps: [...angularDeps, 'ngMockE2E'],
      runFunctions: [registerMockabilityResponses]
    });

  } else {
    return ({
      requireDeps,
      angularDeps,
      runFunctions: []
    });
  }
}
