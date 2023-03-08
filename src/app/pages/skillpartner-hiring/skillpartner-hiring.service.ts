import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OwnerStatusUpdate } from 'src/app/api/flexcub-api/models';
import { NotificationControllerService, SkillOwnerControllerService, SkillPartnerControllerService } from 'src/app/api/flexcub-api/services';

@Injectable({
  providedIn: 'root',
})
export class SkillpartnerHiringService {
  constructor(
    private readonly notificationController: NotificationControllerService,
    private readonly skillOwnerController: SkillOwnerControllerService,
    private readonly skillPartnerControllerService: SkillPartnerControllerService
  ) {}

  getOwnerDetailsInSeeker(id) {
    return this.notificationController.getOwnerDetailsInPartner({ partnerId: id });
  }
  getJobHistoryInSeeker(id) {
    return this.notificationController.getJobHistoryInSeeker({ ownerId: id });
  }
  getSkillOwner(ownerId) {
    return this.skillOwnerController.getById({ id: ownerId });
  }
  downloadImage(ownerId) {
    return this.skillOwnerController.downloadImage({ id: ownerId });
  }
  getNotificationForParticularOwner(id, jobid) {
    return this.notificationController.getNotificationForParticularOwner({ ownerId: id, jobId: jobid });
  }

  historyOfJobs(id){
    return this.notificationController.historyOfJobs({ ownerId: id});
  }

  skillOwnerStatusUpdate(req): Observable<OwnerStatusUpdate> {
    return this.skillPartnerControllerService.skillOwnerStatusUpdate({ body: req });
  }
  skillOwnerRateUpdate(req): Observable<any> {
    return this.skillPartnerControllerService.skillOwnerRateUpdate({ body: req });
  }
}
