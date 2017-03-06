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


  ngOnInit() {
    let amount = this.account.availableBalance.toString().split('.');

    this.dollars = amount[0];
    this.cents = amount[1];
    this.backgroundImage = 'url(/public/static/img/product/L1-tile-bank-checking.jpg)';
  }
}
