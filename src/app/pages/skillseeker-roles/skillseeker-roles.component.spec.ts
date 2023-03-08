import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillseekerRolesComponent } from './skillseeker-roles.component';

describe('SkillseekerRolesComponent', () => {
  let component: SkillseekerRolesComponent;
  let fixture: ComponentFixture<SkillseekerRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillseekerRolesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillseekerRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
