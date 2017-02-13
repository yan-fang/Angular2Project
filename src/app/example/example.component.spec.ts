import { ExampleComponent } from './example.component';
import { TestBed } from '@angular/core/testing';

describe('Testing the example component', () => {
  let component: ExampleComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExampleComponent]
    });

    const fixture = TestBed.createComponent(ExampleComponent);
    component = fixture.componentInstance;
  });

  it('should have a defined component', () => {
    expect(component).toBeDefined('ExampleComponent is not defined');
  });

  it('should have falsy initial showCheck variable', () => {
    expect(component.showCheck).toBeFalsy('showCheck should be false');
  });

  describe('Testing toggleCheck function', () => {
    it('should return true showCheck', () => {
      component.showCheck = false;
      component.toggleCheck();
      expect(component.showCheck).toBeTruthy('showCheck should be true');
    });
  });
});
