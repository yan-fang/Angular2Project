import { binding, given, then } from 'cucumber-tsflow';
import { page } from '../app.page-object';

/**
 * @description
 *
 * Contains all functionality for handling browser navigation safely.
 */
@binding()
class NavigationStepDefinitions {
  @given(/^I login$/)
  public login() {
    return page.navigateTo('http://localhost:3001');
  }

  @given(/^I login to (?:'|")(.*)(?:'|")$/)
  public loginTo(targetUrl: string) {
    return page.navigateTo(targetUrl);
  }

  @then(/^The url should be (?:'|")(.*)(?:'|")$/)
  public urlShouldBe(url: string) {
    return page.currentUrlEquals(url, 'Url does not match');
  }
}

export = NavigationStepDefinitions;
