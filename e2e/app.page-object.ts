import { browser, element, ElementFinder, by } from 'protractor';
import { expect, use } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

use(chaiAsPromised);

class EasePage {
  public navigateTo(url: string) {
    return browser.get(url);
  }

  public get(selector: string) {
    const el = element(by.css(selector));

    return browser.waitForAngular()
            .then(() => el.isPresent())
            .then(() => el);
  }

  public currentUrlEquals(targetUrl: string, failureMessage: string) {
    return browser.sleep(100)
            .then(() => browser.getCurrentUrl())
            .then((currentUrl: string) => {
              return expect(currentUrl).to.equal(targetUrl, failureMessage);
            });
  }
}

export const page = new EasePage();
