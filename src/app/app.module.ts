import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { CoreModule } from './core/core.module';
import { SignUpFormModule } from './modules/sign-up-form/sign-up-form.module';
import { PageTemplateComponent } from './modules/page-template/page-template.component';

@NgModule({
  declarations: [
    PageTemplateComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    SignUpFormModule,
  ],
  bootstrap: [
    PageTemplateComponent,
  ],
})
export class AppModule { }
