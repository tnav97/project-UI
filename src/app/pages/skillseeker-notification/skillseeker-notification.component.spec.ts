import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillseekerNotificationComponent } from './skillseeker-notification.component';

describe('SkillseekerNotificationComponent', () => {
  let component: SkillseekerNotificationComponent;
  let fixture: ComponentFixture<SkillseekerNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillseekerNotificationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillseekerNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
