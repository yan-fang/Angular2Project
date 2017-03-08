import { Injectable } from '@angular/core';

@Injectable()
export class CurrencyService {
  formatCents(cents = '00'): string {
    return cents.length === 1 ? cents + '0' : cents;
  }

  formatDollars(dollars: string): string {
    return dollars.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
