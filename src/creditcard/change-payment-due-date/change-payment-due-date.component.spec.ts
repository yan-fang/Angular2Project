import { TestBed } from '@angular/core/testing';

import { ChangePaymentDueDateComponent } from './change-payment-due-date.component';

describe('ChangePaymentDueDateComponent', () => {
  let changePaymentDueDateComponent: ChangePaymentDueDateComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePaymentDueDateComponent ]
    });

    changePaymentDueDateComponent = TestBed.createComponent(ChangePaymentDueDateComponent).componentInstance;
  });

  it('should have the correct title', () => {
    expect(changePaymentDueDateComponent.title).toEqual('Change Payment Due Date Title (L3)');
  });
});
