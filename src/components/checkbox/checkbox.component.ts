
import { Component, Input, HostBinding, Output, EventEmitter  } from '@angular/core';
import {  AlignTypes, LabelTypes } from './checkbox.component.type';

let nextId = 0;

// Change event object emitted by CheckboxComponent.
export class CheckboxChange {
  // The source of the event.
  source: CheckboxComponent;
  // The new `checked` value of the checkbox.
  checked: boolean;
}


@Component({
  selector: 'c1-checkbox',
  styleUrls: ['./checkbox.component.scss'],
  templateUrl: './checkbox.component.html',
})
export class CheckboxComponent {

  isChecked: boolean = false;
  isDisabled: boolean = false;

  // tslint:disable-next-line:no-input-rename
  @Input('aria-label') ariaLabel: string = '';
  // tslint:disable-next-line:no-input-rename
  @Input('aria-labelledby') ariaLabelledby: string = '';

  // The label alignment (before or after the input)
  @Input() get align(): AlignTypes {
    return this.labelPosition === 'after' ? 'start' : 'end';
  }

  set align(v) {
    this.labelPosition = (v === 'start') ? 'after' : 'before';
  }

  // TO DO (Andrew): add css modifier HostBinding for label position.
  @HostBinding('class.c1-checkbox--label-modifier-after')
  @Input() labelPosition: LabelTypes = 'after';

  // ID of the native input element inside `<c1-checkbox>`
  @Input() id: string = `checkbox-${++nextId}`;

  get inputId(): string {
    return `c1-input-${this.id}`;
  }

  // TabIndex
  @Input() tabIndex: number = 0;

  // TO DO (Andrew): Material uses `coerceBooleanProperty(value)`. Might want to add that.
  @HostBinding('class.c1-checkbox--disabled')
  @Input()
  get disabled(): boolean { return this.isDisabled; }
  set disabled(value) { this.isDisabled = value; }

  // The value attribute of the native input element
  @Input() value: string;
  @Input() name: string = 'null';

  @HostBinding('class.c1-checkbox--checked')
  @Input()
  get checked() {
    return this.isChecked;
  }

  @Output() change: EventEmitter<CheckboxChange> = new EventEmitter<CheckboxChange>();

  emitChangeEvent() {
    let event = new CheckboxChange();
    event.source = this;
    event.checked = this.checked;

    this.change.emit(event);
  }


  set checked(checked: boolean) {
    if (checked !== this.checked) {
      this.isChecked = checked;
    }
  }

  //  Toggles the `checked` state of the checkbox.
  toggle(): void {
    this.checked = !this.checked;
  }

  onInputClick(event: Event) {
    // We have to stop propagation for click events on the visual hidden input element.
    // By default, when a user clicks on a label element, a generated click event will be
    // dispatched on the associated input element. Since we are using a label element as our
    // root container, the click event on the `checkbox` will be executed twice.
    // The real click event will bubble up, and the generated click event also tries to bubble up.
    // This will lead to multiple click events.
    // Preventing bubbling for the second event will solve that issue.
    event.stopPropagation();
    // TO DO (Andrew): Handle the event, via emitter, do output.

     if (!this.disabled) {
      this.toggle();
      this.emitChangeEvent();
    }
  }

  onInputBlur() {
    // TO DO (Andrew) : handle blur
  }

  onInteractionEvent() {
    this.toggle();
    this.emitChangeEvent();
  }
}
