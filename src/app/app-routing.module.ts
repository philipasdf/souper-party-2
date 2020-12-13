import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrowserGuard } from './modules/browser-support/browser.guard';

const routes: Routes = [{ path: '', pathMatch: 'full', redirectTo: 'launcher', canActivate: [BrowserGuard] }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
