import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationSkillseekerComponent } from './registration-skillseeker.component';

describe('RegistrationSkillseekerComponent', () => {
  let component: RegistrationSkillseekerComponent;
  let fixture: ComponentFixture<RegistrationSkillseekerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrationSkillseekerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationSkillseekerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
