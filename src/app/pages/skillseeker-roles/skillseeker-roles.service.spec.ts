import { TestBed } from '@angular/core/testing';

import { SkillseekerRolesService } from './skillseeker-roles.service';

describe('SkillseekerRolesService', () => {
  let service: SkillseekerRolesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkillseekerRolesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
