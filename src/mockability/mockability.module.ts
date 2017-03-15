import { NgModule, ModuleWithProviders, Inject } from '@angular/core';
import { HttpModule, Http, BaseRequestOptions, Response } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { MockabilityResponse, ResponseFunction, MOCKABILITY_RESPONSES } from './mockability-response';
import { ANGULAR1_MOCKABILITY } from './mockability.ng1';

export function mockHttpFactory(backend: MockBackend, options: BaseRequestOptions) {
  return new Http(backend, options);
}

@NgModule({
  imports: [
    HttpModule
  ],
  providers: [
    BaseRequestOptions,
    MockBackend,
    {
      provide: Http,
      deps: [MockBackend, BaseRequestOptions],
      useFactory: mockHttpFactory
    },
    ANGULAR1_MOCKABILITY
  ]
})
export class MockabilityModule {
  public static forRoot(responses: () => MockabilityResponse[]): ModuleWithProviders {
    return {
      ngModule: MockabilityModule,
      providers: [
        { provide: MOCKABILITY_RESPONSES, useFactory: responses, deps: [] }
      ]
    };
  }

  private static respondForMatchingRequest(connection: MockConnection, responses: MockabilityResponse[]) {
    responses.forEach((response) => {
      if (MockabilityModule.responseMatches(connection, response)) {
        if (typeof response.response === 'function') {
          // cast to our function type and invoke
          const getResponse = (response.response as ResponseFunction);
          connection.mockRespond(getResponse());
        } else {
          connection.mockRespond((response.response as Response));
        }
      }
    });
  }

  private static responseMatches(connection: MockConnection, response: MockabilityResponse): boolean {
    return connection.request.method === response.method
      && response.url.test(connection.request.url);
  }

  constructor(private backend: MockBackend, @Inject(MOCKABILITY_RESPONSES) private responses: MockabilityResponse[]) {
    this.subscribeToMockBackend();
  }

  private subscribeToMockBackend() {
    this.backend.connections.subscribe((connection: MockConnection) => {
      MockabilityModule.respondForMatchingRequest(connection, this.responses);
    });
  }
}
