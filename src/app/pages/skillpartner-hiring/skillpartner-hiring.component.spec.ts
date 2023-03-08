import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillpartnerHiringComponent } from './skillpartner-hiring.component';

describe('SkillpartnerHiringComponent', () => {
  let component: SkillpartnerHiringComponent;
  let fixture: ComponentFixture<SkillpartnerHiringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillpartnerHiringComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillpartnerHiringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
