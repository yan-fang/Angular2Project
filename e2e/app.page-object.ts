import { browser, element, by } from 'protractor';

export class EasePage {
  public navigateTo(url: string) {
    return browser.get(url);
  }

  public get(selector: string) {
    return element(by.css(selector));
  }
}
