import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillownerDashboardComponent } from './skillowner-dashboard.component';

describe('SkillownerDashboardComponent', () => {
  let component: SkillownerDashboardComponent;
  let fixture: ComponentFixture<SkillownerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillownerDashboardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillownerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
