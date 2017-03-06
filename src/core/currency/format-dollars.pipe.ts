import { Pipe, PipeTransform } from '@angular/core';

import { CurrencyService } from './currency.service';

@Pipe({
  name: 'c1FormatDollars',
  pure: true
})
export class FormatDollarsPipe implements PipeTransform {
  constructor(private currencyService: CurrencyService) {}

  transform(dollars: string) {
    return this.currencyService.formatDollars(dollars);
  }
}
