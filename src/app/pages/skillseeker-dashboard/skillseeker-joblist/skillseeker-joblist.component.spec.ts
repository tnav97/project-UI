import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillseekerJoblistComponent } from './skillseeker-joblist.component';

describe('SkillseekerJoblistComponent', () => {
  let component: SkillseekerJoblistComponent;
  let fixture: ComponentFixture<SkillseekerJoblistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillseekerJoblistComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillseekerJoblistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
