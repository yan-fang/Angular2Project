import { Injectable } from '@angular/core';

@Injectable()
export class CurrencyService {
  static splitAtDecimalPoint(amount: number): string[] {
      return amount.toString().split('.');
  }
  // Needs to be called on formatted currency like 1,234,567
    // for api calls returns 1234567
  static unFormatAmount(amount: string): string {
    return amount.replace(/[^0-9.]/g, '').toString();
  }
  formatCents(cents = '00'): string {
    return cents.length === 1 ? cents + '0' : cents;
  }

  formatDollars(dollars: string): string {
    return dollars.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
