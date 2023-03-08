import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/operators';
import { SkillOwnerEntity } from 'src/app/api/flexcub-api/models';
import { FileReadingControllerService, NotificationControllerService } from 'src/app/api/flexcub-api/services';
import { SkillOwnerControllerService } from 'src/app/api/flexcub-api/services/skill-owner-controller.service';
import { fileUploadUrl } from 'src/app/core/Constants/constant';

@Injectable({
  providedIn: 'root',
})
export class SkillpartnerDashboardService {
  constructor(
    private router: Router,
    private http: HttpClient,
    private readonly skillOwnerController: SkillOwnerControllerService,
    private readonly notificationController: NotificationControllerService,
    private readonly fileReadingController: FileReadingControllerService
  ) {}

  insertDetails5(request: SkillOwnerEntity[]): Observable<SkillOwnerEntity[]> {
    return this.skillOwnerController.insertDetails3({ body: request });
  }

  uploadExcel(params: {
    id: string;
    body?: {
      file: Array<Blob>;
    };
  }): Observable<HttpEvent<any>> {
    return this.http.post(fileUploadUrl + params.id, params.body).pipe(
      map((data: any) => {
        return data;
      })
    );
  }
  getPartnerLastFiveNotification(id) {
    return this.notificationController.getLastFiveNotificationOfPartner({ partnerId: id });
  }

  getSpTemplate() {
    return this.fileReadingController.downloadTemplate();
  }

  partnerNotification(Id) {
    return this.notificationController.partnerNotification({ id: Id });
  }

  partnerMarkAsRead(Id): Observable<boolean> {
    return this.notificationController.partnerMarkAsRead({ id: Id });
  }
}
