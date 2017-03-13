import { ElementFinder } from 'protractor';

import { EasePage } from '../app.page-object';

describe('creditcard.component', () => {
  let page: EasePage;

  beforeAll(() => {
    page = new EasePage();

    page.navigateTo('/credit-card');
  });

  describe('Validate element for selector "c1-creditcard"', () => {
    let h2: ElementFinder;

    beforeAll(() => {
      h2 = page.get('c1-creditcard > h2');
    });

    it('should have the correct text', () => {
      expect(h2.getText()).toEqual('CreditCard Title (L2)');
    });
  });
});
