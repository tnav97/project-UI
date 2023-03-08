import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillownerTimesheetsComponent } from './skillowner-timesheets.component';

describe('SkillownerTimesheetsComponent', () => {
  let component: SkillownerTimesheetsComponent;
  let fixture: ComponentFixture<SkillownerTimesheetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillownerTimesheetsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillownerTimesheetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
