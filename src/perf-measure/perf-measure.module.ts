import { NgModule, ModuleWithProviders } from '@angular/core';

import { NativePerformance, PerfMeasureService, perfMeasureServiceEnabled } from './perf-measure.service';

@NgModule({
  providers: [
    NativePerformance,
    PerfMeasureService,
    {
      provide: perfMeasureServiceEnabled,
      useValue: true
    }
  ]
})
export class PerfMeasureModule {
  static disable(): ModuleWithProviders {
    return {
      ngModule: PerfMeasureModule,
      providers: [{
        provide: perfMeasureServiceEnabled,
        useValue: false
      }]
    };
  }
}
