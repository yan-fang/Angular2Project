import { Directive, HostBinding } from '@angular/core';

@Directive({
  selector: '[c1MenuItem]',
})
export class MenuItemDirective {
  @HostBinding('attr.role') role = 'menuItem';
}
