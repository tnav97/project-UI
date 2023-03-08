import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewSkillSeekerComponent } from './add-new-skill-seeker.component';

describe('AddNewSkillSeekerComponent', () => {
  let component: AddNewSkillSeekerComponent;
  let fixture: ComponentFixture<AddNewSkillSeekerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddNewSkillSeekerComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewSkillSeekerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
