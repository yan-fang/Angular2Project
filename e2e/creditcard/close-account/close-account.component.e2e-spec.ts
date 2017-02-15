import { ElementFinder } from 'protractor';

import { EasePage } from '../../app.page-object';

describe('close-account.component', () => {
  let page: EasePage;

  beforeAll(() => {
    page = new EasePage();

    page.navigateTo('/creditcard/close-account');
  });

  describe('Validate element for selector "c1-creditcard-close-account"', () => {
    let h2: ElementFinder;

    beforeAll(() => {
      h2 = page.get('c1-creditcard-close-account > h2');
    });

    it('should have the correct text', () => {
      expect(h2.getText()).toEqual('Close Account Title (L3)');
    });
  });
});
