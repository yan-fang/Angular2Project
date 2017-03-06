import { CurrencyService } from './currency.service';

describe('CurrencyService', () => {
  let currencyService: CurrencyService;

  beforeEach(() => {
    currencyService = new CurrencyService();
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
