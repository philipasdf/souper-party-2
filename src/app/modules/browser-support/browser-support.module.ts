import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserSupportRoutingModule } from './browser-support-routing.module';
import { LandingPageComponent } from './landing-page/landing-page.component';

@NgModule({
  declarations: [LandingPageComponent],
  imports: [CommonModule, BrowserSupportRoutingModule],
})
export class BrowserSupportModule {}
