import { ElementFinder } from 'protractor';

import { EasePage } from '../../app.page-object';

describe('change-payment-due-date.component', () => {
  let page: EasePage;

  beforeAll(() => {
    page = new EasePage();

    page.navigateTo('/credit-card/change-payment-due-date');
  });

  describe('Validate element for selector "c1-creditcard-change-payment-due-date"', () => {
    let h2: ElementFinder;

    beforeAll(() => {
      h2 = page.get('c1-creditcard-change-payment-due-date > h2');
    });

    it('should have the correct text', () => {
      expect(h2.getText()).toEqual('Change Payment Due Date Title (L3)');
    });
  });
});
