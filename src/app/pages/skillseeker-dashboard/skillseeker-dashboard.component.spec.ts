import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillseekerDashboardComponent } from './skillseeker-dashboard.component';

describe('SkillseekerDashboardComponent', () => {
  let component: SkillseekerDashboardComponent;
  let fixture: ComponentFixture<SkillseekerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillseekerDashboardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillseekerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
