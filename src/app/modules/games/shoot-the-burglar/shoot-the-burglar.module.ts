import { NgModule } from '@angular/core';
import { ShootTheBurglarRoutingModule } from './shoot-the-burglar-routing.module';
import { ShootTheBurglarPreparerComponent } from './components/preparer/shoot-the-burglar-preparer.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ShootTheBurglarGameComponent } from './components/game/shoot-the-burglar-game.component';
import { StoreModule } from '@ngrx/store';
import { shotReducer } from './reducers/shot.reducer';
import { EffectsModule } from '@ngrx/effects';
import { ShotEffects } from './effects/shot.effects';
import { RevealedComponent } from './components/revealed/revealed.component';

@NgModule({
  imports: [
    SharedModule,
    ShootTheBurglarRoutingModule,
    StoreModule.forFeature('shot', shotReducer),
    EffectsModule.forFeature([ShotEffects]),
  ],
  declarations: [ShootTheBurglarPreparerComponent, ShootTheBurglarGameComponent, RevealedComponent],
})
export class ShootTheBurglar {}
