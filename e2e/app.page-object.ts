import { browser, element, ElementFinder, by } from 'protractor';

export class EasePage {
  public navigateTo(url: string): void {
    browser.get(url);
  }

  public get(selector: string): ElementFinder {
    return element(by.css(selector));
  }
}
