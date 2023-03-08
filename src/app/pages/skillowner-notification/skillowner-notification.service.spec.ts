import { TestBed } from '@angular/core/testing';

import { SkillownerNotificationService } from './skillowner-notification.service';

describe('SkillownerNotificationService', () => {
  let service: SkillownerNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkillownerNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
