import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillpartnerDashboardComponent } from './skillpartner-dashboard.component';

describe('SkillpartnerDashboardComponent', () => {
  let component: SkillpartnerDashboardComponent;
  let fixture: ComponentFixture<SkillpartnerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillpartnerDashboardComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillpartnerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
