import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LauncherHomeComponent } from './pages/launcher-home/launcher-home.component';
import { LauncherCreateOrJoinComponent } from './pages/launcher-create-or-join/launcher-create-or-join.component';
import { BrowserGuard } from '../browser-support/browser.guard';

const routes: Routes = [
  {
    path: 'launcher',
    component: LauncherHomeComponent,
    canActivate: [BrowserGuard],
  },
  {
    path: 'launcher/createorjoin',
    component: LauncherCreateOrJoinComponent,
    canActivate: [BrowserGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class LauncherRoutingModule {}
