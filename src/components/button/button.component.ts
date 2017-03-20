import { Component, Input } from '@angular/core';
import { ButtonTypes } from './button.component.type';

@Component({
  selector: 'c1-button',
  styleUrls: ['./button.component.scss'],
  templateUrl: 'button.component.html',
})
export class ButtonComponent {
  @Input() public type: ButtonTypes = 'progressive';
  // The style of button. Can be `true` for ghost.
  @Input() public ghost?: boolean = false;
  // Disabled
  @Input() public disabled?: boolean = false;

}
