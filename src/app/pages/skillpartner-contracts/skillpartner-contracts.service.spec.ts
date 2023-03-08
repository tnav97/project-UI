import { TestBed } from '@angular/core/testing';

import { SkillpartnerContractsService } from './skillpartner-contracts.service';

describe('SkillpartnerContractsService', () => {
  let service: SkillpartnerContractsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkillpartnerContractsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
