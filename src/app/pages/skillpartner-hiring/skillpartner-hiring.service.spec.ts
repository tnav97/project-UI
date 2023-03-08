import { TestBed } from '@angular/core/testing';

import { SkillpartnerHiringService } from './skillpartner-hiring.service';

describe('SkillpartnerHiringService', () => {
  let service: SkillpartnerHiringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkillpartnerHiringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
