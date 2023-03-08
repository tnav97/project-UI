import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillownerNotificationComponent } from './skillowner-notification.component';

describe('SkillownerNotificationComponent', () => {
  let component: SkillownerNotificationComponent;
  let fixture: ComponentFixture<SkillownerNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillownerNotificationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillownerNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
