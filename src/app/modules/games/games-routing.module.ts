import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'quick-typing',
    loadChildren: () => import('../../modules/games/quick-typing/quick-typing.module').then((m) => m.QuickTypingModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class GamesRoutingModule {}
