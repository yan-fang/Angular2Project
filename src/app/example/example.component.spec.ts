import { ExampleComponent } from './example.component';
import { TestBed, async } from '@angular/core/testing';

describe('Testing the example component', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExampleComponent]
    }).compileComponents();
  }));

  it('should have a defined component', () => {
    const component = TestBed.createComponent(ExampleComponent).componentInstance;

    expect(component).toBeDefined('ExampleComponent is not defined');
  });

  it('should have falsy initial showCheck variable', () => {
    const component = TestBed.createComponent(ExampleComponent).componentInstance;
    expect(component.showCheck).toBeFalsy('showCheck should be false');
  });

  describe('Testing toggleCheck function', () => {
    it('should return true showCheck', () => {
      const component = TestBed.createComponent(ExampleComponent).componentInstance;
      component.showCheck = false;
      component.toggleCheck();
      expect(component.showCheck).toBeTruthy('showCheck should be true');
    });
  });
});
