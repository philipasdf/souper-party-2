import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LobbyGameGuideComponent } from './lobby-game-guide/lobby-game-guide.component';
import { LobbyHomeComponent } from './lobby-home/lobby-home.component';

const routes: Routes = [
  {
    path: 'lobby/:partyName/:playerFireId',
    component: LobbyHomeComponent
  },
  {
    path: 'lobby/:partyName/:playerFireId/game-guide',
    component: LobbyGameGuideComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class LobbyRoutingModule { }
