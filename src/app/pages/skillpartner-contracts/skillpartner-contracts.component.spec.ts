import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillpartnerContractsComponent } from './skillpartner-contracts.component';

describe('SkillpartnerContractsComponent', () => {
  let component: SkillpartnerContractsComponent;
  let fixture: ComponentFixture<SkillpartnerContractsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillpartnerContractsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillpartnerContractsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
