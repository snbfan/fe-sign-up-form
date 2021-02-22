import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { BackendCommunicationService } from './services/backend-communication.service';

@NgModule({
  declarations: [],
  providers: [
    BackendCommunicationService
  ],
  imports: [
    HttpClientModule,
  ],
})
export class CoreModule { }
