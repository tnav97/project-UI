import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewSkillPartnerComponent } from './add-new-skill-partner.component';

describe('AddNewSkillPartnerComponent', () => {
  let component: AddNewSkillPartnerComponent;
  let fixture: ComponentFixture<AddNewSkillPartnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddNewSkillPartnerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddNewSkillPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
