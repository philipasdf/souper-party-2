import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuickTypingPreparerComponent } from './quick-typing-preparer/quick-typing-preparer.component';

const routes: Routes = [
    { path: 'prepare-data/:partyName/:hostFireId', component: QuickTypingPreparerComponent }
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class QuickTypingRoutingModule { }
  