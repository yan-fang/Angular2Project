import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShellComponent } from './shell.component';
import { SelectivePreloadingStrategy } from './preloading-strategy';

// TODO: EWE-1911 - figure out how to import routes from other modules
const appRoutes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      {
        path: '',
        redirectTo: '/account-summary',
        pathMatch: 'full'
      },
      {
        path: 'credit-card',
        loadChildren: '@c1/creditcard/creditcard.module#CreditCardModule'
      },
      {
        path: 'account-summary',
        loadChildren: '@c1/customer/account-summary/account-summary.module#AccountSummaryModule'
      },
      {
        path: 'examples',
        loadChildren: '@c1/examples/examples.module#ExamplesModule',
        data: { preload: true }
      }
    ]
  },
  // L2s
  {
    path: '',
    loadChildren: './angular1ease/angular1ease.module#Angular1EaseModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {enableTracing: true , preloadingStrategy: SelectivePreloadingStrategy})
  ],
  providers: [
    SelectivePreloadingStrategy
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
