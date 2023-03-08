import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillownerHotJobsComponent } from './skillowner-hot-jobs.component';

describe('SkillownerHotJobsComponent', () => {
  let component: SkillownerHotJobsComponent;
  let fixture: ComponentFixture<SkillownerHotJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillownerHotJobsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillownerHotJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
