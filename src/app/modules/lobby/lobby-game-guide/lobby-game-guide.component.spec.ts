import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbyGameGuideComponent } from './lobby-game-guide.component';

describe('LobbyGameGuideComponent', () => {
  let component: LobbyGameGuideComponent;
  let fixture: ComponentFixture<LobbyGameGuideComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LobbyGameGuideComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LobbyGameGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
