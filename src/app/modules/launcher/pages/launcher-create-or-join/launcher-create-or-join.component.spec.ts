import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LauncherCreateOrJoinComponent } from './launcher-create-or-join.component';

describe('LauncherCreateOrJoinComponent', () => {
  let component: LauncherCreateOrJoinComponent;
  let fixture: ComponentFixture<LauncherCreateOrJoinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LauncherCreateOrJoinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LauncherCreateOrJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
