import { Pipe, PipeTransform } from '@angular/core';

import { CurrencyService } from './currency.service';

@Pipe({
  name: 'c1FormatCents',
  pure: true
})
export class FormatCentsPipe implements PipeTransform {
  constructor(private currencyService: CurrencyService) {}

  transform(cents: string | undefined): string {
    return this.currencyService.formatCents(cents);
  }
}
