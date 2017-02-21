import { NgModule, ModuleWithProviders, Inject, OpaqueToken } from '@angular/core';
import { HttpModule, Http, BaseRequestOptions, Response } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { MockabilityResponse, ResponseFunction } from './mockability-response';

export const MOCKABILITY_RESPONSES = new OpaqueToken('mockability.responses');

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
      useFactory: (backend: MockBackend, options: BaseRequestOptions) => new Http(backend, options)
    }
  ]
})
export class MockabilityModule {
  public static forRoot(responses: MockabilityResponse[]): ModuleWithProviders {
    return {
      ngModule: MockabilityModule,
      providers: [
        { provide: MOCKABILITY_RESPONSES, useValue: responses }
      ]
    };
  }

  private static respondForMatchingRequest(
    connection: MockConnection,
    responses: MockabilityResponse[]
  ) {
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
  private static responseMatches(
    connection: MockConnection,
    response: MockabilityResponse
  ): boolean {
    return connection.request.method === response.method
      && response.url.test(connection.request.url);
  }
  constructor(
    private backend: MockBackend,
    @Inject(MOCKABILITY_RESPONSES) private responses: MockabilityResponse[]
  ) {
    this.subscribeToMockBackend();
  }
  private subscribeToMockBackend() {
    this.backend.connections.subscribe((connection: MockConnection) => {
      MockabilityModule.respondForMatchingRequest(connection, this.responses);
    });
  }
}
