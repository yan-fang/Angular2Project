import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from '@c1/app';
import { environment, Environments } from '@c1/shared';
import { PerfMeasureService } from '@c1/perf-measure';

if (environment === Environments.Production) {
  enableProdMode();
}

// TODO: EWE-961 - console methods This will go away once EWE-961 is implemented.
platformBrowserDynamic().bootstrapModule(AppModule)
  .then(moduleRef => {
    console.log(`Bootstrap success`);
    const perf: PerfMeasureService = moduleRef.injector.get(PerfMeasureService);
    /**
     * Time when useful content is on the screen. Since not pre-rendering, content
     * does not appear until after bootstrapping.
     */
    perf.mark('angular-meaningful-content');

    /**
     * Time when the user can interact with the application. Since not pre-rendering,
     * this is the same time as meaningful content.
     */
    perf.mark('angular-interactive');
  })
  .catch(err => console.error(`Bootstrap error`, err));
