import { TestBed } from '@angular/core/testing';

import { SkillpartnerNotificationService } from './skillpartner-notification.service';

describe('SkillpartnerNotificationService', () => {
  let service: SkillpartnerNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkillpartnerNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
