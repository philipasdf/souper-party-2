import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import { Shot } from '../../models/shot.model';
import { ShotNotificationService } from './shot-notification.service';

@Component({
  selector: 'app-shot-notifications',
  templateUrl: './shot-notifications.component.html',
  styleUrls: ['./shot-notifications.component.css'],
})
export class ShotNotificationsComponent implements AfterViewInit {
  princessShots: Shot[] = [];
  burglarShots: Shot[] = [];

  constructor(private service: ShotNotificationService, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.service.princessNotifications$.subscribe((shots: Shot[]) => (this.princessShots = shots));
    this.service.burglarNotifications$.subscribe((shots: Shot[]) => (this.burglarShots = shots));
    this.service.clearNotifications$.subscribe(() => this.clearList());
  }

  private clearList() {
    this.burglarShots = [];
    this.princessShots = [];
  }
}
