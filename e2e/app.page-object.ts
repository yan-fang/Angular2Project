import { browser, element, by } from 'protractor';
import { expect, use } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

use(chaiAsPromised);

class EasePage {
  public navigateTo(url: string) {
    return browser.get(url);
  }

  public navigateBack() {
    browser.navigate().back();
  }

  public get(selector: string) {
    const el = element(by.css(selector));

    return browser.waitForAngular()
            .then(() => el.isPresent())
            .then(() => el);
  }

  public getButton(text: string) {
    const el = element(by.buttonText(text));
    return browser.waitForAngular()
      .then(() => el.isPresent())
      .then(() => el);
  }

  public elementAppears(selector: string, description: string): Promise<any> {
    const button = element(by.css(selector));
    return browser.driver.wait(() => button.isPresent(), 1000, `'${description}' has not appeared`);
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
