import { TestBed } from '@angular/core/testing';

import { SkillseekerInvoiceService } from './skillseeker-invoice.service';

describe('SkillseekerInvoiceService', () => {
  let service: SkillseekerInvoiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkillseekerInvoiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
