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
    expect(component).toBeDefined();
  });

  it('should have falsy initial showCheck variable', () => {
    expect(component.showCheck).toBeFalsy;
  });
});
