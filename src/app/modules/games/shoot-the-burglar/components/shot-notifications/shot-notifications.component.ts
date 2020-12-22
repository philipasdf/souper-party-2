import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Shot } from '../../models/shot.model';
import { ShotNotificationService } from './shot-notification.service';

@Component({
  selector: 'app-shot-notifications',
  templateUrl: './shot-notifications.component.html',
  styleUrls: ['./shot-notifications.component.css'],
})
export class ShotNotificationsComponent implements AfterViewInit {
  @ViewChild('list')
  list: ElementRef;

  constructor(private service: ShotNotificationService, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.service.princessNotifications$.subscribe((not: { name: string; shot: Shot }) =>
      this.appendPrincessElement(not.name, not.shot)
    );
    this.service.burglarNotifications$.subscribe((not: { name: string; shot: Shot }) =>
      this.appendBurglarElement(not.name, not.shot)
    );
    this.service.clearNotifications$.subscribe(() => this.clearList());
  }

  private appendPrincessElement(name: string, shot: Shot) {
    const text = `${name} -1`;
    this.appendListElement(text, 'wrong-shot');
  }

  private appendBurglarElement(name: string, shot: Shot) {
    const text = `${name} ${shot.shotTime}ms`;
    let classes = 'correct-shot';

    if (this.list.nativeElement.childNodes.length === 0) {
      classes += ' first-shot';
    }

    this.appendListElement(text, classes);
  }

  private appendListElement(text: string, classes: string) {
    const li = this.renderer.createElement('li');
    li.innerHTML = text;
    this.renderer.setAttribute(li, 'class', classes);
    this.renderer.appendChild(this.list.nativeElement, li);
  }

  private clearList() {
    this.list.nativeElement.childNodes.forEach((node) =>
      setTimeout(() => this.renderer.removeChild(this.list.nativeElement, node))
    );
  }
}
