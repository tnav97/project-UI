import { TestBed } from '@angular/core/testing';

import { SkillownerTimesheetsService } from './skillowner-timesheets.service';

describe('SkillownerTimesheetsService', () => {
  let service: SkillownerTimesheetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkillownerTimesheetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
