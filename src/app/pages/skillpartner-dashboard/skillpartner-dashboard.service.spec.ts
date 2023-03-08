import { TestBed } from '@angular/core/testing';

import { SkillpartnerDashboardService } from './skillpartner-dashboard.service';

describe('SkillpartnerDashboardService', () => {
  let service: SkillpartnerDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkillpartnerDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
