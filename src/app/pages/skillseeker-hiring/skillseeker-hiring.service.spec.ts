import { TestBed } from '@angular/core/testing';

import { SkillseekerHiringService } from './skillseeker-hiring.service';

describe('SkillseekerHiringService', () => {
  let service: SkillseekerHiringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkillseekerHiringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
