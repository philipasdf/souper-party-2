import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { LobbyRoutingModule } from './lobby-routing.module';
import { LobbyHomeComponent } from './lobby-home/lobby-home.component';


@NgModule({
  declarations: [
    LobbyHomeComponent
  ],
  imports: [
    SharedModule,
    LobbyRoutingModule,
  ]
})
export class LobbyModule { }
