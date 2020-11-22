import { Component, ComponentRef, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-game-countdown',
  templateUrl: './game-countdown.component.html',
  styleUrls: ['./game-countdown.component.css'],
})
export class GameCountdownComponent implements OnInit {
  componentRef: ComponentRef<any>;

  COUNTDOWN_FROM = 3;
  displayCountdown = this.COUNTDOWN_FROM;

  constructor() {}

  ngOnInit(): void {
    interval(1000)
      .pipe(
        take(this.COUNTDOWN_FROM),
        map((val) => val + 1)
      )
      .subscribe(
        (val) => {
          if (val < this.COUNTDOWN_FROM) {
            this.displayCountdown--;
          }
        },
        (err) => {},
        () => {
          this.componentRef.destroy();
        }
      );
  }
}
