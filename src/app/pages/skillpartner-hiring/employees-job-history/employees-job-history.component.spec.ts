import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesJobHistoryComponent } from './employees-job-history.component';

describe('EmployeesJobHistoryComponent', () => {
  let component: EmployeesJobHistoryComponent;
  let fixture: ComponentFixture<EmployeesJobHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmployeesJobHistoryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesJobHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
