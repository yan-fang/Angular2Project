import { Component, HostBinding, Input, OnInit } from '@angular/core';

import { Account } from '@c1/app';

@Component({
  selector: 'c1-account-tile',
  styleUrls: ['./account-tile.component.scss'],
  templateUrl: './account-tile.component.html'
})
export class AccountTileComponent implements OnInit {
  public cents: string;
  public dollars: string;

  @HostBinding('style.backgroundImage') public backgroundImage: string;
  @Input() public account: Account;

  private amountArray: string[];

  ngOnInit() {
    this.backgroundImage = 'url(/public/static/img/product/L1-tile-bank-checking.jpg)';
    this.amountArray = this.account.availableBalance.toString().split('.');

    this.formatCents(this.amountArray[1]);
    this.formatDollars(this.amountArray[0]);
  }

  // TODO: Put into a currency service.
  formatCents(cents: string | undefined) {
    if (typeof cents === 'undefined') {
      this.cents = '00';
    } else if (cents.length === 1) {
      this.cents += '0';
    } else {
      this.cents = cents;
    }
  }

  // TODO: Put into a currency service.
  formatDollars(dollars: string) {
    this.dollars = dollars.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
