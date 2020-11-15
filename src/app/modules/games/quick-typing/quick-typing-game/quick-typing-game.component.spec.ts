import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickTypingGameComponent } from './quick-typing-game.component';

describe('QuickTypingGameComponent', () => {
  let component: QuickTypingGameComponent;
  let fixture: ComponentFixture<QuickTypingGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickTypingGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickTypingGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
