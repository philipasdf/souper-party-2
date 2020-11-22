import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'shoot-the-burglar',
    loadChildren: () => import('./shoot-the-burglar/shoot-the-burglar.module').then((m) => m.ShootTheBurglar),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class GamesRoutingModule {}
