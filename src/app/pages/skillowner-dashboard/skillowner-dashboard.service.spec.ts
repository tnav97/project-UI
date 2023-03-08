import { TestBed } from '@angular/core/testing';

import { SkillownerDashboardService } from './skillowner-dashboard.service';

describe('SkillownerDashboardService', () => {
  let service: SkillownerDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkillownerDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
