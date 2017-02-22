import { NgModule } from '@angular/core';

import { ToggleGuard } from './toggle.guard';
import { ToggleRepositoryService } from './toggle-repository.service';

@NgModule({
  providers: [
    ToggleGuard,
    ToggleRepositoryService
  ]
})
export class ToggleModule {}
