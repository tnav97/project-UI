import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillseekerInvoiceComponent } from './skillseeker-invoice.component';

describe('SkillseekerInvoiceComponent', () => {
  let component: SkillseekerInvoiceComponent;
  let fixture: ComponentFixture<SkillseekerInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillseekerInvoiceComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillseekerInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
