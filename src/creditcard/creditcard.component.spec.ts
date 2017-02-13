import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

import { CreditCardComponent } from './creditcard.component';
import { creditCardRoutes } from './creditcard.routes';

describe('CreditCardComponent', () => {
  let creditCardComponent: CreditCardComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditCardComponent ],
      imports: [
        RouterModule.forRoot(creditCardRoutes)
      ],
      providers: [{ provide: APP_BASE_HREF, useValue: '/' }]
    });

    creditCardComponent = TestBed.createComponent(CreditCardComponent).componentInstance;
  });

  it('should have the correct title', () => {
    expect(creditCardComponent.title).toEqual('CreditCard Title (L2)');
  });
});
