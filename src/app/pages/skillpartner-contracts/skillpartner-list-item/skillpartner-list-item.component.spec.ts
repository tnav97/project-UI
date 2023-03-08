import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillpartnerListItemComponent } from './skillpartner-list-item.component';

describe('SkillpartnerListItemComponent', () => {
  let component: SkillpartnerListItemComponent;
  let fixture: ComponentFixture<SkillpartnerListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillpartnerListItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillpartnerListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
