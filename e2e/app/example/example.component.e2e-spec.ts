import { ElementFinder } from 'protractor';

import { EasePage } from '../../app.page-object';

describe('example.component', () => {
  let page: EasePage;

  beforeAll(() => {
    page = new EasePage();

    page.navigateTo('/');
  });

  describe('Validate element for selector "c1-web-example > h1"', () => {
    let h1: ElementFinder;

    beforeAll(() => {
      h1 = page.get('c1-web-example > h1');
    });

    it('should have the correct text', () => {
      expect(h1.getText()).toEqual('Example Page');
    });
  });
});
