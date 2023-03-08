import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Registration } from 'src/app/api/flexcub-api/models';
import { AuthenticationService } from '../authentication/authentication.service';
import { SkillownerDashboardService } from '../skillowner-dashboard/skillowner-dashboard.service';

@Component({
  selector: 'app-skillowner-notification',
  templateUrl: './skillowner-notification.component.html',
  styleUrls: ['./skillowner-notification.component.scss'],
  providers: [DatePipe],
})
export class SkillownerNotificationComponent implements OnInit {
  ownerId: number;
  user?: Registration;
  page: number = 1;
  groupArrays: any;
  count: number = 0;
  pageSize: number = 1;
  ownerNotificationItemList: any;
  unread: boolean = false;
  pageSizes: any = [5, 10, 15, 20];
  constructor(private authenticationService: AuthenticationService, private readonly SkillownerdashboardService: SkillownerDashboardService) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }

  ngOnInit(): void {
    this.ownerId = this.user?.id;

    this.ownerNotification(this.ownerId);
  }

  ownerNotification(Id): void {
    this.SkillownerdashboardService.ownerNotification(Id).subscribe((res) => {
      this.ownerNotificationItemList = res;
      this.ownerNotificationItemList = this.ownerNotificationItemList.reverse();

    var results = this.ownerNotificationItemList.reduce(function(results, org) {
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
    this.ownerNotification(this.ownerId);
  }

  pageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.ownerNotification(this.ownerId);
  }
  onMarkRead(list): void {
    this.SkillownerdashboardService.ownerMarkAsRead(list.id).subscribe((res) => {
      this.unread = true;
      this.ownerNotification(this.ownerId);
    });
  }
}
