import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LauncherHomeComponent } from './pages/launcher-home/launcher-home.component';

const routes: Routes = [
  {
    path: 'launcher',
    component: LauncherHomeComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class LauncherRoutingModule { }
