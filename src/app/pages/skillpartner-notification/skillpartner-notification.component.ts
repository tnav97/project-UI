import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Registration } from 'src/app/api/flexcub-api/models';
import { AuthenticationService } from '../authentication/authentication.service';

import { SkillpartnerDashboardService } from '../skillpartner-dashboard/skillpartner-dashboard.service';

@Component({
  selector: 'app-skillpartner-notification',
  templateUrl: './skillpartner-notification.component.html',
  styleUrls: ['./skillpartner-notification.component.scss'],
  providers: [DatePipe],
})
export class SkillpartnerNotificationComponent implements OnInit {
  partnerId: number;
  groupArrays: any;
  user?: Registration;
  page: number = 1;
  count: number = 0;
  pageSize: number = 1;
  partnerNotificationItemList: any;
  unread: boolean = false;
  pageSizes: any = [5, 10, 15, 20];
  constructor(private authenticationService: AuthenticationService, private readonly skillpartnerDashboardService: SkillpartnerDashboardService) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }

  ngOnInit(): void {
    this.partnerId = this.user?.id;
    this.partnerNotification(this.partnerId);
  }

  partnerNotification(Id): void {
    this.skillpartnerDashboardService.partnerNotification(Id).subscribe((res) => {
      this.partnerNotificationItemList = res;
      this.partnerNotificationItemList = this.partnerNotificationItemList.reverse();
      var results = this.partnerNotificationItemList.reduce(function(results, org) {
        (results[org.jobId??'0'] = results[org.jobId??'0'] || []).push(org);
        return results;
    }, {})
    console.log(results)
    this.groupArrays = Object.keys(results).map((jobId) => {
      return {
        jobId,
        games: results[jobId],
      };

    });
    console.log(this.groupArrays);
    this.groupArrays = this.groupArrays.sort((a, b) => {
      return b.jobId.slice(4) - a.jobId.slice(4);
    });
    });

  }

  pageChanges(event: any) {
    this.page = event;
    this.partnerNotification(this.partnerId);
  }

  pageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.partnerNotification(this.partnerId);
  }
  onMarkRead(list): void {
    this.skillpartnerDashboardService.partnerMarkAsRead(list.id).subscribe((res) => {
      this.unread = true;
      this.partnerNotification(this.partnerId);
    });
  }
}
