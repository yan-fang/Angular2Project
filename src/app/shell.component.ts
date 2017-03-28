import { Component } from '@angular/core';

@Component({
  selector: 'c1-web-app-shell',
  template: `
      <c1-header></c1-header>
      <nav>
        <a routerLink="/account-summary" routerLinkActive="active">Account Summary (L1)</a>
        <a routerLink="/examples" routerLinkActive="active">Example (L2)</a>
        <a routerLink="/credit-card" routerLinkActive="active">CreditCard (L2)</a>
        <a routerLink="/360Savings/jLie63PFC7p99LNqLe4M4S7YfkyAxIgaGvbHvfqcYh1TmhqspejGjGAlqeHuZLDc" routerLinkActive="active">
          Bank 360 Savings(L2)
        </a>
        <a routerLink="/RewardsChecking/RBf6iH+ucQ6mIf884wU8AvzPXWB7dvZyyhpWnuomzPM=" routerLinkActive="active">
          Bank Checking (L2)
        </a>
        <a routerLink="/AutoLoan/QBu%252FQ+LfJI1bkC0GH%252FSflxkuLUodPDy7GPN5hLFA854u8wn+CdK3Mmvd99dR3LTx" routerLinkActive="active">
          Autoloan (L2)
        </a>
      </nav>
      <router-outlet></router-outlet>
    `
})
export class ShellComponent { }
