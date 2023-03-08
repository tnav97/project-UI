import { TestBed } from '@angular/core/testing';

import { SkillpartnerInvoiceService } from './skillpartner-invoice.service';

describe('SkillpartnerInvoiceService', () => {
  let service: SkillpartnerInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkillpartnerInvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
