// TODO (Andrew): Add accessiblity, more options.

import { Component, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'c1-menu',
  styleUrls: ['./menu.component.scss'],
  template: `
    <ng-content></ng-content>
    <div class="c1-menu-list" *ngIf="showMenu">
      <ng-content select="[c1-menu-list]"></ng-content>
    </div>
  `,
})
export class MenuComponent {
  public showMenu: boolean = false;

  constructor(private elementRef: ElementRef) { }

  @HostListener('document:click', ['$event.target']) onClick(target: any) {
   if (this.elementRef.nativeElement.contains(target)) {
      this.showMenu = !this.showMenu;
    } else {
      this.showMenu = false;
    }
  }
}
