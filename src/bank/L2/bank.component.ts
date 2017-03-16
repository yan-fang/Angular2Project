import { Component, ElementRef, Injector } from '@angular/core';
import { setUpLocationSync } from '@angular/router/upgrade';
import { UpgradeModule } from '@angular/upgrade/static';

import { prepareBank } from './bank.ng1';

@Component({
  selector: 'c1-bank',
  styles: [`
      @import '/bower_components/EASECoreLite/styles/main.css';
      @import '/bower_components/easeUIComponents/dist/ease-ui-components.css';
    `],
  template: `
      <div id="page-content" aria-hidden="false">
        <escape-hatch role="banner"></escape-hatch>
        <ease-header id="headerEaseC1" class="header"></ease-header>
        <div class="ui-view-container" role="main" aria-label="main-content">
          <div ui-view ng-animate-children></div>
        </div>
        <!-- Footer -->
        <footer id="footer" data-ng-controller="GlobalFooterController
          as footerCtrl" data-ng-include="footerCtrl.displayFooter()"
          role="contentinfo" aria-label="footer" ng-animate-children>
        </footer>
      </div>
    `
})
export class BankComponent {
  constructor(el: ElementRef, upgrade: UpgradeModule, injector: Injector) {
    prepareBank(injector).then((moduleName: string) => {
      upgrade.bootstrap(el.nativeElement, [moduleName]);
      setUpLocationSync(upgrade);
    });
  }
}
