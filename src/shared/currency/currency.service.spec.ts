import { CurrencyService } from './currency.service';

describe('CurrencyService', () => {
  let currencyService: CurrencyService;

  beforeEach(() => {
    currencyService = new CurrencyService();
  });

  describe('splitDecimalPoint()', () => {
    it('should return an array with value split between dollars and cents', () => {
      let splitDollarAmount = CurrencyService.splitAtDecimalPoint(2678.97);
      expect(splitDollarAmount.length).toBe(2);
      expect(splitDollarAmount[0]).toBe('2678');
      expect(splitDollarAmount[1]).toBe('97');
    });
  });
  describe('unFormatAmount()', () => {
    it('should return 1234567 when given 1,234,567', () => {
      let convertedAmount = currencyService.formatDollars('1234567');
      expect(convertedAmount).toBe('1,234,567');
      expect(CurrencyService.unFormatAmount(convertedAmount)).toBe('1234567');
    });
  });

  describe('formatCents()', () => {
    it('should return "90" when given "9"', () => {
      expect(currencyService.formatCents('9')).toEqual('90');
    });

    it('should return "00" when given undefined', () => {
      expect(currencyService.formatCents(undefined)).toEqual('00');
      expect(currencyService.formatCents()).toEqual('00');
    });
  });

  describe('formatDollars()', () => {
    it('should return "0" when given "0"', () => {
      expect(currencyService.formatDollars('0')).toEqual('0');
    });

    it('should return "12" when given "12"', () => {
      expect(currencyService.formatDollars('12')).toEqual('12');
    });

    it('should return "1,234" when given "1234"', () => {
      expect(currencyService.formatDollars('1234')).toEqual('1,234');
    });

    it('should return "1,234,567" when given "1234567"', () => {
      expect(currencyService.formatDollars('1234567')).toEqual('1,234,567');
    });
  });
});
