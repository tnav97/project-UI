import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillownerLearnGrowComponent } from './skillowner-learn-grow.component';

describe('SkillownerLearnGrowComponent', () => {
  let component: SkillownerLearnGrowComponent;
  let fixture: ComponentFixture<SkillownerLearnGrowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillownerLearnGrowComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillownerLearnGrowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
