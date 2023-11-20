/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

//It bootstarps the angular application by taking AppModule as argument
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
