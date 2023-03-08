import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillpartnerNotificationComponent } from './skillpartner-notification.component';

describe('SkillpartnerNotificationComponent', () => {
  let component: SkillpartnerNotificationComponent;
  let fixture: ComponentFixture<SkillpartnerNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillpartnerNotificationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillpartnerNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
