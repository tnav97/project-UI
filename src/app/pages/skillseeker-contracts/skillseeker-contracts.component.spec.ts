import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillseekerContractsComponent } from './skillseeker-contracts.component';

describe('SkillseekerContractsComponent', () => {
  let component: SkillseekerContractsComponent;
  let fixture: ComponentFixture<SkillseekerContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillseekerContractsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillseekerContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
