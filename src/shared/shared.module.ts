import { NgModule } from '@angular/core';

import { CurrencyService, FormatCentsPipe, FormatDollarsPipe } from './currency';

@NgModule({
  declarations: [
    FormatCentsPipe,
    FormatDollarsPipe
  ],
  exports: [
    FormatCentsPipe,
    FormatDollarsPipe
  ],
  providers: [
    CurrencyService
  ]
})
export class SharedModule {}
