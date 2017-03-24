import { Component } from '@angular/core';

@Component({
    selector: 'c1-web-app-shell',
    template: `
      <c1-header></c1-header>
      <nav>
        <a routerLink="/account-summary" routerLinkActive="active">Account Summary (L1)</a>
        <a routerLink="/examples" routerLinkActive="active">Example (L2)</a>
        <a routerLink="/credit-card" routerLinkActive="active">CreditCard (L2)</a>
        <!--<a routerLink="/360Checking/123" routerLinkActive="active">Bank (L2)</a>-->
      </nav>
      <router-outlet></router-outlet>
    `
})
export class ShellComponent {}
