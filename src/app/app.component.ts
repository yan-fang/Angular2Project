import { Component } from '@angular/core';
import { MenuComponent } from '../components/menu/menu.component';

@Component({
    selector: 'c1-web-app',
    styleUrls: ['app.component.scss'],
    template: `
    <div>
        <c1-header></c1-header>
        <div class="menu-example">
            <c1-button [c1MenuTriggerFor]="menu">Menu Trigger</c1-button>
            <c1-menu #menu="c1Menu">
                <a c1MenuItem>Item 1</a>
                <a c1MenuItem>Item 2</a>
                <a c1MenuItem>Item 2</a>
            </c1-menu>
        </div>
        <c1-web-example></c1-web-example>

        <button routerLink="/account-summary/27272/Transfer">Show Transfer Dialog</button>
        <router-outlet></router-outlet>

        <c1-i18n-example></c1-i18n-example>
    </div>
    `
})
export class AppComponent {
  public menu: MenuComponent;
}
