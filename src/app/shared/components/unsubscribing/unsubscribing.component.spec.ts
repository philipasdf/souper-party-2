import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsubscribingComponent } from './unsubscribing.component';

describe('UnsubscribingComponent', () => {
  let component: UnsubscribingComponent;
  let fixture: ComponentFixture<UnsubscribingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnsubscribingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsubscribingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
