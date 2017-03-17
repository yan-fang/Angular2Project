import { Directive, HostListener, Input, ElementRef } from '@angular/core';
import { MenuComponent } from './menu.component';

/*
 * This directive is used in conjunction with a c1-menu tag.  It is
 * responsible for toggling the display of the provided menu instance.
 */
@Directive({
  selector: '[c1MenuTriggerFor]'
})
export class MenuTriggerDirective {

  @Input('c1MenuTriggerFor') c1MenuTriggerFor: MenuComponent;

  @HostListener('document:click', ['$event.target']) onClick(target: any) {
   if (this.elementRef.nativeElement.contains(target)) {
      this.c1MenuTriggerFor.showMenu = !this.c1MenuTriggerFor.showMenu;
    } else {
      this.c1MenuTriggerFor.showMenu = false;
    }
  }

  constructor(private elementRef: ElementRef) { }
}
