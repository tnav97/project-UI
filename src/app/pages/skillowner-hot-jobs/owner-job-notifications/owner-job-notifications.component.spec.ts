import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerJobNotificationsComponent } from './owner-job-notifications.component';

describe('OwnerJobNotificationsComponent', () => {
  let component: OwnerJobNotificationsComponent;
  let fixture: ComponentFixture<OwnerJobNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OwnerJobNotificationsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerJobNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
