import { Component } from '@angular/core';

@Component({
    selector: 'c1-web-app',
    template: `
      <router-outlet></router-outlet>
      <div ui-view ng-animate-children></div>
    `
})
export class AppComponent {}
