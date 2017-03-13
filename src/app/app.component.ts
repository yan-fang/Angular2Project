import { Component } from '@angular/core';

@Component({
    selector: 'c1-web-app',
    styleUrls: ['app.component.scss'],
    template: `
    <div>
        <c1-header></c1-header>
        <p class="sample--color-blue">SCSS Sample</p>
        <c1-web-example></c1-web-example>

        <button routerLink="/account-summary/27272/Transfer">Show Transfer Dialog</button>
        <router-outlet></router-outlet>

        <c1-i18n-example></c1-i18n-example>
    </div>
    `
})
export class AppComponent {}
