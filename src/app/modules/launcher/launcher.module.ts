import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { LauncherRoutingModule } from './launcher-routing.module';
import { LauncherHomeComponent } from './pages/launcher-home/launcher-home.component';
import { LauncherCreateOrJoinComponent } from './pages/launcher-create-or-join/launcher-create-or-join.component';

@NgModule({
  declarations: [
    LauncherHomeComponent,
    LauncherCreateOrJoinComponent
  ],
  imports: [
    SharedModule,
    LauncherRoutingModule
  ]
})
export class LauncherModule { }
