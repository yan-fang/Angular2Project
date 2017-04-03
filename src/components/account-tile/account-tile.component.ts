import { Component, HostBinding, Input, OnInit } from '@angular/core';

import { Account } from '@c1/customer';
import { CurrencyService } from '@c1/shared';

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

  get encodedReferenceId() {
    return encodeURIComponent(this.account.referenceId);
  }

  ngOnInit() {
    let amount = CurrencyService.splitAtDecimalPoint(this.account.availableBalance);

    this.dollars = amount[0];
    this.cents = amount[1];
    this.backgroundImage = 'url(/public/static/img/product/L1-tile-bank-checking.jpg)';
  }
}
