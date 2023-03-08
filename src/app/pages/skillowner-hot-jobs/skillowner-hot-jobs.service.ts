import { Injectable } from '@angular/core';
import { NotificationControllerService } from 'src/app/api/flexcub-api/services/notification-controller.service';

@Injectable({
  providedIn: 'root',
})
export class SkillownerHotJobsService {
  constructor(private readonly notificationController: NotificationControllerService) {}

  getJobSpecificNotificationForOwner(id, jobid) {
    return this.notificationController.getJobSpecificNotificationForOwner({ skillOwnerId: id, jobId: jobid });
  }
}
