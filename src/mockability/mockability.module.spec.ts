import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Http, Response, ResponseOptions, RequestMethod } from '@angular/http';

import { MockabilityModule, MOCKABILITY_RESPONSES } from './mockability.module';
import { MockabilityResponse } from './mockability-response';

describe('MockabilityModule', () => {
  it('should have a forRoot static method that returns the correct ModuleWithProviders', () => {
    const moduleWithProviders = MockabilityModule.forRoot([]);
    expect(moduleWithProviders.ngModule).toBe(MockabilityModule);
  });

  it('should work as a backend strategy for Http service', fakeAsync(() => {
    const testEndpoint = 'test-endpoint';
    const responses: MockabilityResponse[] = [
      {
        method: RequestMethod.Get,
        url: new RegExp(testEndpoint),
        response: new Response(new ResponseOptions({
          body: JSON.stringify({ testData: true })
        }))
      }
    ];

    const testBed = TestBed.configureTestingModule({
      imports: [
        MockabilityModule.forRoot(responses)
      ]
    });

    const http = testBed.get(Http) as Http;
    let serviceData: any;
    http.get(testEndpoint)
      .toPromise()
      .then((response) => serviceData = response.json());
    tick();

    expect(serviceData.testData).toBe(true);
  }));
});
