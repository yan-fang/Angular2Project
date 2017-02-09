import { Component } from '@angular/core';

@Component({
    selector: 'c1-web-app',
    template: `
    <div>
        <c1-web-example></c1-web-example>
        <router-outlet></router-outlet>
    </div>
    `
})
export class AppComponent {}
