import { TestBed, async } from '@angular/core/testing';

import { CheckboxComponent } from './checkbox.component';

// TO DO: Unit Tests
xdescribe('Testing the checkbox component', () => {
  let fixture: any;
  let component: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CheckboxComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;

  }));

  it('should have a defined component', () => {
    expect(component).toBeDefined('CheckboxComponent is not defined');
  });

});

