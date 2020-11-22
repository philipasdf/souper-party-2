import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector } from '@angular/core';
import { GameCountdownComponent } from './game-countdown.component';

@Injectable({ providedIn: 'root' })
export class GameCountdownService {
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private applicationRef: ApplicationRef
  ) {}

  startCountdown() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(GameCountdownComponent);
    const componentRef = componentFactory.create(this.injector);
    componentRef.instance.componentRef = componentRef;
    this.applicationRef.attachView(componentRef.hostView);
    componentRef.hostView.detectChanges();
    document.body.appendChild(componentRef.location.nativeElement);

    return componentRef;
  }
}
