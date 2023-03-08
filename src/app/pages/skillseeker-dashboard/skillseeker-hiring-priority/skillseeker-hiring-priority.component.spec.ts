import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillseekerHiringPriorityComponent } from './skillseeker-hiring-priority.component';

describe('SkillseekerHiringPriorityComponent', () => {
  let component: SkillseekerHiringPriorityComponent;
  let fixture: ComponentFixture<SkillseekerHiringPriorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillseekerHiringPriorityComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillseekerHiringPriorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
