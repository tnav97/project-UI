import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillseekerHiringComponent } from './skillseeker-hiring.component';

describe('SkillseekerHiringComponent', () => {
  let component: SkillseekerHiringComponent;
  let fixture: ComponentFixture<SkillseekerHiringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillseekerHiringComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillseekerHiringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
