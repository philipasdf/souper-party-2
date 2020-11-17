import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LauncherModule } from './modules/launcher/launcher.module';
import { LobbyRoutingModule } from './modules/lobby/lobby-routing.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { appReducers } from './shared/reducers/app.reducer';
import { PlayerEffects } from './shared/effects/player.effects';
import { PartyEffects } from './shared/effects/party.effects';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule, BUCKET } from '@angular/fire/storage';
import { LobbyModule } from './modules/lobby/lobby.module';
import { GamesRoutingModule } from './modules/games/games-routing.module';
import { GameEffects } from './shared/effects/game.effects';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    // angular core modules
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,

    // custom modules
    LauncherModule,
    LobbyModule,
    GamesRoutingModule,

    //ngx-translate
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
      defaultLanguage: 'de',
    }),

    // redux with ngrx
    EffectsModule.forRoot([PlayerEffects, PartyEffects, GameEffects]),
    StoreModule.forRoot(appReducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
    }),

    // firebase, firestore
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule.enablePersistence(),
    AngularFireStorageModule,
  ],
  providers: [{ provide: BUCKET, useValue: environment.firebase.storageBucket }],
  bootstrap: [AppComponent],
})
export class AppModule {}
