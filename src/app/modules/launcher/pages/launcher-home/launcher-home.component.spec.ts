import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LauncherHomeComponent } from './launcher-home.component';

describe('LauncherHomeComponent', () => {
  let component: LauncherHomeComponent;
  let fixture: ComponentFixture<LauncherHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LauncherHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LauncherHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
