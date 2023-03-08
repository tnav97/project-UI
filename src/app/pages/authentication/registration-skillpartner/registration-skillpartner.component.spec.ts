import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationSkillpartnerComponent } from './registration-skillpartner.component';

describe('RegistrationSkillpartnerComponent', () => {
  let component: RegistrationSkillpartnerComponent;
  let fixture: ComponentFixture<RegistrationSkillpartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrationSkillpartnerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationSkillpartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
