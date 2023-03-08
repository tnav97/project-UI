import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillseekerCreateNewJobComponent } from './skillseeker-create-new-job.component';

describe('SkillseekerCreateNewJobComponent', () => {
  let component: SkillseekerCreateNewJobComponent;
  let fixture: ComponentFixture<SkillseekerCreateNewJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillseekerCreateNewJobComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillseekerCreateNewJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
