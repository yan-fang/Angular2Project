import { FormatDollarsPipe } from './format-dollars.pipe';
import { CurrencyService } from './currency.service';

describe('FormatDollarsPipe', () => {
  let currencyService = new CurrencyService();
  let formatDollarsPipe = new FormatDollarsPipe(currencyService);

  it('transforms "1234" to "1,234', () => {
    expect(formatDollarsPipe.transform('1234')).toEqual('1,234');
  });

  it('transforms "12" to "12', () => {
    expect(formatDollarsPipe.transform('12')).toEqual('12');
  });

  it('transforms "0" to "0"', () => {
    expect(formatDollarsPipe.transform('0')).toEqual('0');
  });

  it('transforms "1234567" to "1,234,567"', () => {
    expect(formatDollarsPipe.transform('1234567')).toEqual('1,234,567');
  });

  it('calls CurrencyService.formatDollars', () => {
    spyOn(currencyService, 'formatDollars');

    formatDollarsPipe.transform('12');

    expect(currencyService.formatDollars).toHaveBeenCalledWith('12');
  });
});
