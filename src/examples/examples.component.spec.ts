import { TestBed, async } from '@angular/core/testing';

import { C1ComponentsModule } from '@c1/components';

import { ExamplesComponent } from './examples.component';
import { I18nExampleComponent } from './i18n-example/i18n-example.component';

describe('Testing the example component', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ExamplesComponent,
        I18nExampleComponent
      ],
      imports: [
        C1ComponentsModule
      ]
    }).compileComponents();
  }));

  it('should have a defined component', () => {
    const component = TestBed.createComponent(ExamplesComponent).componentInstance;

    expect(component).toBeDefined('ExamplesComponent is not defined');
  });

  it('should have falsy initial showCheck variable', () => {
    const component = TestBed.createComponent(ExamplesComponent).componentInstance;
    expect(component.showCheck).toBeFalsy('showCheck should be false');
  });

  describe('Testing toggleCheck function', () => {
    it('should return true showCheck', () => {
      const component = TestBed.createComponent(ExamplesComponent).componentInstance;
      component.showCheck = false;
      component.toggleCheck();
      expect(component.showCheck).toBeTruthy('showCheck should be true');
    });
  });
});
