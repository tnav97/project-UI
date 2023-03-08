import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillseekerDescribejobComponent } from './skillseeker-describejob.component';

describe('SkillseekerDescribejobComponent', () => {
  let component: SkillseekerDescribejobComponent;
  let fixture: ComponentFixture<SkillseekerDescribejobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillseekerDescribejobComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillseekerDescribejobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
