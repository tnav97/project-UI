import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Registration } from 'src/app/api/flexcub-api/models';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../authentication/authentication.service';
import { SkillpartnerDashboardService } from '../../skillpartner-dashboard/skillpartner-dashboard.service';
import { SkillpartnerHiringService } from '../skillpartner-hiring.service';

@Component({
  selector: 'app-employees-job-notifications',
  templateUrl: './employees-job-notifications.component.html',
  styleUrls: ['./employees-job-notifications.component.scss'],
  providers: [DatePipe],
})
export class EmployeesJobNotificationsComponent implements OnInit {
  partnerId: number;
  jobId: any;
  ownerId: any;
  user?: Registration;
  page: number = 1;
  count: number = 0;
  pageSize: number = 3;
  partnerNotificationItemList: any;
  pageSizes: any = [5, 10, 15, 20];
  relatedNotification: any;

  // relatedNotification: import("d:/Flexi-UI/src/app/api/flexcub-api/models").NotificationDetails[];
  constructor(
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private readonly skillpartnerDashboardService: SkillpartnerDashboardService,
    private readonly skillpartnerHiringService: SkillpartnerHiringService,
    private router: Router
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.jobId = params.id;
      this.ownerId = params.ownerId;
      this.getNotificationForParticularOwner(this.ownerId, this.jobId);
    }),
      (this.partnerId = this.user?.id);
    // this.partnerNotification(this.partnerId);
  }

  // partnerNotification(Id): void {
  //   this.skillpartnerDashboardService.partnerNotification(Id).subscribe((res) => {
  //     this.partnerNotificationItemList = res;
  //     this.partnerNotificationItemList = this.partnerNotificationItemList.reverse();
  //   });
  // }

  getNotificationForParticularOwner(ownerId, jobid) {
    this.skillpartnerHiringService.getNotificationForParticularOwner(ownerId, jobid).subscribe((res) => {
      this.relatedNotification = res;
      if (this.relatedNotification.length == 0) {
        this.router.navigate(['/spHiring/jobsHistory/', ownerId]).then(() => {
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Notification not exist',
            showConfirmButton: false,
            timer: 1500,
          });
        });
      }
    });
  }

  pageChanges(event: any) {
    this.page = event;
    this.getNotificationForParticularOwner(this.ownerId, this.jobId);
  }

  pageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.getNotificationForParticularOwner(this.ownerId, this.jobId);
  }
}
