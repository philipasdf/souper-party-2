import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { LobbyRoutingModule } from './lobby-routing.module';


@NgModule({
  declarations: [
  ],
  imports: [
    SharedModule,
    LobbyRoutingModule,
  ]
})
export class LobbyModule { }
