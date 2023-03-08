import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationSkillownerComponent } from './registration-skillowner.component';

describe('RegistrationSkillownerComponent', () => {
  let component: RegistrationSkillownerComponent;
  let fixture: ComponentFixture<RegistrationSkillownerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrationSkillownerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationSkillownerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
