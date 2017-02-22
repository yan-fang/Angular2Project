import { Component, Input } from '@angular/core';

@Component({
  selector: 'c1-button',
  styleUrls: ['./button.component.scss'], // TODO: Fix dependency on `require`.
  templateUrl: 'button.component.html',
})
export class ButtonComponent {
  // The type of button. Can be `action`, `progressive`, `regressive`, or `destructive`.
  @Input() public type: string = 'progressive';
  // The style of button. Can be `true` for ghost.
  @Input() public ghost?: boolean;
  // Disabled
  @Input() public disabled?: boolean;

}
