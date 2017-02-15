import { ElementFinder } from 'protractor';

import { EasePage } from '../app.page-object';

describe('app.component', () => {
  let page: EasePage;

  beforeAll(() => {
    page = new EasePage();

    page.navigateTo('/');
  });

  describe('Validate element for Selector "c1-web-app > div > p"', () => {
    let p: ElementFinder;

    beforeAll(() => {
      p = page.get('c1-web-app > div > p');
    });

    it('should display message SCSS Sample', () => {
      expect(p.getText()).toEqual('SCSS Sample');
    });

    it('should have the correct color', () => {
      // #018BBB -> rgba(1, 139, 187, 1)
      expect(p.getCssValue('color')).toEqual('rgba(1, 139, 187, 1)');
    });

    it('should have the correct font-size', () => {
      // 2em -> 32px
      expect(p.getCssValue('font-size')).toEqual('32px');
    });
  });
});
