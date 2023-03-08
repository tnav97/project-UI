import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Registration } from 'src/app/api/flexcub-api/models';
import { AuthenticationService } from '../../authentication/authentication.service';
import { SkillownerDashboardService } from '../../skillowner-dashboard/skillowner-dashboard.service';
import { SkillownerHotJobsService } from '../skillowner-hot-jobs.service';

@Component({
  selector: 'app-owner-job-notifications',
  templateUrl: './owner-job-notifications.component.html',
  styleUrls: ['./owner-job-notifications.component.scss'],
  providers: [DatePipe],
})
export class OwnerJobNotificationsComponent implements OnInit {
  ownerId: number;
  jobId: string;
  user?: Registration;
  page: number = 1;
  count: number = 0;
  pageSize: number = 3;
  ownerNotificationItemList: any;
  hotjobNotification: any;
  pageSizes: any = [5, 10, 15, 20];
  constructor(
    private authenticationService: AuthenticationService,
    private readonly SkillownerdashboardService: SkillownerDashboardService,
    private route: ActivatedRoute,
    private skillownerhotjobsService: SkillownerHotJobsService
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }

  // ngOnInit(): void {
  //   this.ownerId = this.user?.id;

  //   this.ownerNotification(this.ownerId);
  //   this.getJobSpecificNotificationForOwner(this.ownerId,)
  // }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.ownerId = params.ownerId;
      this.jobId = params.jobId;

      this.getJobSpecificNotificationForOwner(this.ownerId, this.jobId);
    }),
      (this.ownerId = this.user?.id);

    // this.partnerNotification(this.partnerId);
  }

  getJobSpecificNotificationForOwner(ownerId, jobId) {
    this.skillownerhotjobsService.getJobSpecificNotificationForOwner(ownerId, jobId).subscribe((res) => {
      this.hotjobNotification = res;
    });
  }

  ownerNotification(Id): void {
    this.SkillownerdashboardService.ownerNotification(Id).subscribe((res) => {
      this.ownerNotificationItemList = res;
      this.ownerNotificationItemList = this.ownerNotificationItemList.reverse();
    });
  }

  pageChanges(event: any) {
    this.page = event;
    this.ownerNotification(this.ownerId);
  }

  pageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.ownerNotification(this.ownerId);
  }
}
