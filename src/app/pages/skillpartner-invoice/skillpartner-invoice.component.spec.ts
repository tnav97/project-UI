import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillpartnerInvoiceComponent } from './skillpartner-invoice.component';

describe('SkillpartnerInvoiceComponent', () => {
  let component: SkillpartnerInvoiceComponent;
  let fixture: ComponentFixture<SkillpartnerInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillpartnerInvoiceComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillpartnerInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
