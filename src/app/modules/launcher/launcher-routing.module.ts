import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LauncherHomeComponent } from './pages/launcher-home/launcher-home.component';
import { LauncherCreateOrJoinComponent } from './pages/launcher-create-or-join/launcher-create-or-join.component';

const routes: Routes = [
  {
    path: 'launcher',
    component: LauncherHomeComponent,
  },
  {
    path: 'launcher/createorjoin',
    component: LauncherCreateOrJoinComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class LauncherRoutingModule {}
