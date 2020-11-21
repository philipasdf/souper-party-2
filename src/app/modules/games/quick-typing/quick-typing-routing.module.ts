import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuickTypingGameComponent } from './quick-typing-game/quick-typing-game.component';
import { QuickTypingPreparerComponent } from './quick-typing-preparer/quick-typing-preparer.component';

const routes: Routes = [
  {
    path: 'prepare-data/:partyName/:hostFireId/:gameIndex',
    component: QuickTypingPreparerComponent,
  },
  { path: ':partyName/:playerFireId', component: QuickTypingGameComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuickTypingRoutingModule {}
