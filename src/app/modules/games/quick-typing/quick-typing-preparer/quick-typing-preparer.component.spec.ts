import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickTypingPreparerComponent } from './quick-typing-preparer.component';

describe('QuickTypingPreparerComponent', () => {
  let component: QuickTypingPreparerComponent;
  let fixture: ComponentFixture<QuickTypingPreparerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuickTypingPreparerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickTypingPreparerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
