import { RequestMethod } from '@angular/http';
import { MockabilityResponses, MOCKABILITY_RESPONSES } from './mockability-response';

export function registerMockabilityResponses(mockabilityResponses: MockabilityResponses): Function {
  function register($httpBackend: any): void {
    mockabilityResponses.forEach(m => {
      const r: any = m.response;
      const response = r.text ? r.text() : r().text(); // either Response or () => Response
      const method = {
        [RequestMethod.Get]: 'whenGET',
        [RequestMethod.Post]: 'whenPOST',
        [RequestMethod.Delete]: 'whenDELETE',
        [RequestMethod.Options]: 'whenOPTIONS',
        [RequestMethod.Head]: 'whenHEAD',
        [RequestMethod.Patch]: 'whenPATCH'
      };
      $httpBackend[method[m.method]](m.url).respond(response);
    });
    $httpBackend.whenGET(/.*/).passThrough(); // the rest should make real http requests
  }

  (<any>register).$inject = ['$httpBackend'];

  return register;
}

/**
 * Provider registering all mockabilty responses with $httpBackend.
 * It doesn't actually depend on the Angular 1 binary.
 */
export const ANGULAR1_MOCKABILITY = {
  provide: 'registerMockabilityResponsesWithAngular1',
  useFactory: registerMockabilityResponses,
  deps: [MOCKABILITY_RESPONSES]
};
