import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { LauncherRoutingModule } from './launcher-routing.module';
import { LauncherHomeComponent } from './pages/launcher-home/launcher-home.component';
import { LauncherCreateOrJoinComponent } from './pages/launcher-create-or-join/launcher-create-or-join.component';
import { StoreModule } from '@ngrx/store';
import { playerReducer } from 'src/app/shared/reducers/player.reducer';
import { EffectsModule } from '@ngrx/effects';
import { PlayerEffects } from 'src/app/shared/effects/player.effects';


@NgModule({
  declarations: [
    LauncherHomeComponent,
    LauncherCreateOrJoinComponent
  ],
  imports: [
    SharedModule,
    LauncherRoutingModule,
    StoreModule.forFeature('player', playerReducer),
    EffectsModule.forFeature([PlayerEffects])
  ]
})
export class LauncherModule { }
