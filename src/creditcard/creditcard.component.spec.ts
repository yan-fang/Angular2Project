import { TestBed } from '@angular/core/testing';

import { CreditCardComponent } from './creditcard.component';

describe('CreditCardComponent', () => {
  let creditCardComponent: CreditCardComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditCardComponent ]
    });

    creditCardComponent = TestBed.createComponent(CreditCardComponent).componentInstance;
  });

  it('should have the correct title', () => {
    expect(creditCardComponent.title).toEqual('CreditCard Title');
  });
});
