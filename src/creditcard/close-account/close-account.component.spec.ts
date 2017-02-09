import { TestBed } from '@angular/core/testing';

import { CloseAccountComponent } from 'creditcard/close-account/close-account.component';

describe('CloseAccountComponent', () => {
  let closeAccountComponent: CloseAccountComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseAccountComponent ]
    });

    closeAccountComponent = TestBed.createComponent(CloseAccountComponent).componentInstance;
  });

  it('should have the correct title', () => {
    expect(closeAccountComponent.title).toEqual('Close Account Title');
  });
});
