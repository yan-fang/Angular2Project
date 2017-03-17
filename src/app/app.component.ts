import { Component } from '@angular/core';

@Component({
    selector: 'c1-web-app',
    template: `
    <div>
        <c1-header></c1-header>
        <nav>
          <a routerLink="/account-summary" routerLinkActive="active">Account Summary (L1)</a>
          <a routerLink="/examples" routerLinkActive="active">Example (L2)</a>
          <a routerLink="/credit-card" routerLinkActive="active">CreditCard (L2)</a>
        </nav>
        <router-outlet></router-outlet>
    </div>
    `
})
export class AppComponent {}
