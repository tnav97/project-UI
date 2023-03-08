import { TestBed } from '@angular/core/testing';

import { SkillownerHotJobsService } from './skillowner-hot-jobs.service';

describe('SkillownerHotJobsService', () => {
  let service: SkillownerHotJobsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkillownerHotJobsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
