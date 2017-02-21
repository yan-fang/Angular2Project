import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from 'app/app.module';

// TODO: EWE-961 - console methods This will go away once EWE-961 is implemented.
platformBrowserDynamic().bootstrapModule(AppModule)
  .then(success => console.log(`Bootstrap success`, success))
  .catch(err => console.error(`Bootstrap error`, err));
