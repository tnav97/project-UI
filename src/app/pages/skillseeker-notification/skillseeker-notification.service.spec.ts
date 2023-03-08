import { TestBed } from '@angular/core/testing';

import { SkillseekerNotificationService } from './skillseeker-notification.service';

describe('SkillseekerNotificationService', () => {
  let service: SkillseekerNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkillseekerNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
