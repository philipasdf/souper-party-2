import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LauncherModule } from './modules/launcher/launcher.module';
import { LobbyRoutingModule } from './modules/lobby/lobby-routing.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    // angular core modules
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,

    // custom modules
    LauncherModule,
    LobbyRoutingModule,

    //ngx-translate
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'de'
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
