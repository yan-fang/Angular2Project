import { FormatCentsPipe } from './format-cents.pipe';

import { CurrencyService } from './currency.service';

describe('FormatCentsPipe', () => {
  let currencyService = new CurrencyService();
  let formatCentsPipe = new FormatCentsPipe(currencyService);

  it('transforms "8" to "80"', () => {
    expect(formatCentsPipe.transform('8')).toEqual('80');
  });

  it('transforms undefined to "00"', () => {
    expect(formatCentsPipe.transform(undefined)).toEqual('00');
  });

  it('calls CurrencyService.formatCents', () => {
    spyOn(currencyService, 'formatCents');

    formatCentsPipe.transform('9');

    expect(currencyService.formatCents).toHaveBeenCalledWith('9');
  });
});
