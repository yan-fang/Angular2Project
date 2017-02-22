/*

Plain text tests for <c1-button />. (WIP / DRAFT)

1. Should be defined

2. Should assign classes based on 4 types
  - progressive (default)
  - regressive
  - destructive
  - action

3. Should allow type to be `ghost`

4. Should disable the native button element if disabled

*/

import { TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { ButtonComponent } from './button.component';

xdescribe('Testing the <c1-button> component', () => {
  let component: ButtonComponent;
  let debug: DebugElement;
  let element: HTMLElement;
  let fixture: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonComponent]
    });

    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    debug = fixture.debugElement.query(By.css('button'));
    element = fixture.nativeElement;
  });

  it('should have a defined component', () => {
    expect(component).toBeDefined('ButtonComponent is not defined');
  });

  describe('Setting the component\'s class', () => {

    it('should set a class based on the type property', () => {
      fixture.detectChanges();

      fixture.detectChanges();
      expect(element.children[0].className.indexOf('c1-button--type-progressive') !== -1)
      .toBeTruthy('ButtonComponent is missing progressive class');

      component.type = 'action';
      fixture.detectChanges();
      expect(element.children[0].className.indexOf('c1-button--type-action') !== -1)
      .toBeTruthy('ButtonComponent is missing action class');

    });

    it('should set a class based on the ghost property', () => {
      component.ghost = true;
      fixture.detectChanges();
      expect(element.children[0].className.indexOf('c1-button--style-ghost') !== -1)
      .toBeTruthy('ButtonComponent is missing --ghost class');
    });

  });

});
