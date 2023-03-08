import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillseekerbasicinfoComponent } from './skillseekerbasicinfo.component';

describe('SkillseekerbasicinfoComponent', () => {
  let component: SkillseekerbasicinfoComponent;
  let fixture: ComponentFixture<SkillseekerbasicinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillseekerbasicinfoComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillseekerbasicinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
