import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LobbyHomeComponent } from './lobby-home/lobby-home.component';

const routes: Routes = [
  {
    path: 'lobby/:partyName/:playerFireId',
    component: LobbyHomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class LobbyRoutingModule { }
