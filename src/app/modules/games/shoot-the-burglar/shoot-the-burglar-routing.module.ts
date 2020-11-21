import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShootTheBurglarGameComponent } from './game/shoot-the-burglar-game.component';
import { ShootTheBurglarPreparerComponent } from './preparer/shoot-the-burglar-preparer.component';

const routes: Routes = [
  {
    path: 'prepare-data/:partyName/:hostFireId/:gameIndex',
    component: ShootTheBurglarPreparerComponent,
  },
  { path: ':partyName/:playerFireId', component: ShootTheBurglarGameComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShootTheBurglarRoutingModule {}
