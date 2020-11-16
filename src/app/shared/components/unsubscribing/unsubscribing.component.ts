import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-unsubscribing',
  template: ''
})
export class UnsubscribingComponent implements OnDestroy {

  unsub$ = new Subject();

  ngOnDestroy() {
    this.unsub$.next();
    this.unsub$.complete();
  }
  
}
