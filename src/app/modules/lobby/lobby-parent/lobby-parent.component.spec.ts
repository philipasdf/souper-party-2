import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbyParentComponent } from './lobby-parent.component';

describe('LobbyParentComponent', () => {
  let component: LobbyParentComponent;
  let fixture: ComponentFixture<LobbyParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LobbyParentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LobbyParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
