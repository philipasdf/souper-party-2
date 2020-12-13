import { Component, OnInit } from '@angular/core';
import { BrowserService } from '../browser.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
})
export class LandingPageComponent implements OnInit {
  browser;
  userAgent;
  version = '13.12. 14:47 set image cache';

  constructor(private browserService: BrowserService) {}

  ngOnInit(): void {
    this.browser = this.browserService.getBrowser();
    this.userAgent = this.browserService.getUserAgent();
  }
}
