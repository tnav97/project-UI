import { TestBed } from '@angular/core/testing';

import { SkillseekerContractsService } from './skillseeker-contracts.service';

describe('SkillseekerContractsService', () => {
  let service: SkillseekerContractsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkillseekerContractsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
