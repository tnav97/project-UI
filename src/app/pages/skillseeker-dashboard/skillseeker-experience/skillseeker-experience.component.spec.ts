import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillseekerExperienceComponent } from './skillseeker-experience.component';

describe('SkillseekerExperienceComponent', () => {
  let component: SkillseekerExperienceComponent;
  let fixture: ComponentFixture<SkillseekerExperienceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillseekerExperienceComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillseekerExperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
