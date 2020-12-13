import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { BrowserService } from './browser.service';

@Injectable({
  providedIn: 'root',
})
export class BrowserGuard implements CanActivate {
  constructor(private browserService: BrowserService, private router: Router) {}

  canActivate(next, state): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let isBrowserNotSupported = this.browserService.isChromeiOS() || this.browserService.isFirefoxiOS();

    if (isBrowserNotSupported) {
      this.router.navigate(['/landing-page']);
    }

    return !isBrowserNotSupported;
  }
}
