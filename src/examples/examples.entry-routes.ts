import { Routes } from '@angular/router';

export const examplesEntryRoutes: Routes = [
  {
    path: 'examples',
    loadChildren: '@c1/examples/examples.module#ExamplesModule'
  }
];
