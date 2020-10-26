import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { LauncherRoutingModule } from './launcher-routing.module';
import { LauncherHomeComponent } from './pages/launcher-home/launcher-home.component';


@NgModule({
  declarations: [
    LauncherHomeComponent
  ],
  imports: [
    SharedModule,
    LauncherRoutingModule
  ]
})
export class LauncherModule { }
