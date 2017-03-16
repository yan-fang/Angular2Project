import { ElementFinder } from 'protractor';
import { binding, when, then } from 'cucumber-tsflow';
import { expect } from 'chai';
import { page } from '../app.page-object';

/**
 * @description
 *
 * Contains all functionality for interacting with elements safely.
 */
@binding()
class ElementCheckStepDefinitions {

  @when(/^I click (?:'|")(.*)(?:'|")$/)
  public click(selector: string) {
    return page.get(selector)
            .then((el: ElementFinder) => el.click());
  }

  @then(/^The text of (?:'|")(.*)(?:'|") should be (?:'|")(.*)(?:'|")$/)
  public textShouldBe(selector: string, expectedValue: string) {
    return page.get(selector)
      .then((el: ElementFinder) => el.getText())
      .then((titleText: string) => {
        return expect(titleText).to.equal(expectedValue, `The text should be "${expectedValue}"`);
      });
  }

  @then(/^The (?:'|")(.*)(?:'|") of (?:'|")(.*)(?:'|") should be (?:'|")(.*)(?:'|")$/)
  public cssValueShouldBe(cssValue: string, selector: string, expectedValue: string) {
    return page.get(selector)
      .then((el: ElementFinder) => el.getCssValue(cssValue))
      .then((value: string) => {
        return expect(value).to.equal(expectedValue, `The ${cssValue} should be "${expectedValue}"`);
      });
  }
}

export = ElementCheckStepDefinitions;
