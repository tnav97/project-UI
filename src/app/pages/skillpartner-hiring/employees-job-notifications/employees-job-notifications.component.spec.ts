import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesJobNotificationsComponent } from './employees-job-notifications.component';

describe('EmployeesJobNotificationsComponent', () => {
  let component: EmployeesJobNotificationsComponent;
  let fixture: ComponentFixture<EmployeesJobNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeesJobNotificationsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesJobNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
