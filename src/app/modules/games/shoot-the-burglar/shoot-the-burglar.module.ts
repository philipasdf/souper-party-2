import { NgModule } from '@angular/core';
import { ShootTheBurglarRoutingModule } from './shoot-the-burglar-routing.module';
import { ShootTheBurglarPreparerComponent } from './preparer/shoot-the-burglar-preparer.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ShootTheBurglarGameComponent } from './game/shoot-the-burglar-game.component';

@NgModule({
  imports: [SharedModule, ShootTheBurglarRoutingModule],
  declarations: [ShootTheBurglarPreparerComponent, ShootTheBurglarGameComponent],
})
export class ShootTheBurglar {}
