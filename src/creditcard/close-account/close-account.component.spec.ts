import { TestBed } from '@angular/core/testing';

import { CloseAccountComponent } from './close-account.component';

describe('CloseAccountComponent', () => {
  let closeAccountComponent: CloseAccountComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseAccountComponent ]
    });

    closeAccountComponent = TestBed.createComponent(CloseAccountComponent).componentInstance;
  });

  it('should be defined', () => {
    expect(closeAccountComponent).toBeDefined();
  });

  it('should have the correct title', () => {
    expect(closeAccountComponent.title).toEqual('Close Account Title');
  });
});
