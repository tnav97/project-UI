import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Registration } from 'src/app/api/flexcub-api/models/registration';
import { AuthenticationService } from '../authentication/authentication.service';
import { SkillpartnerDashboardService } from './skillpartner-dashboard.service';

@Component({
  selector: 'app-skillpartner-dashboard',
  templateUrl: './skillpartner-dashboard.component.html',
  styleUrls: ['./skillpartner-dashboard.component.scss'],
})
export class SkillpartnerDashboardComponent implements OnInit {
  user?: Registration;
  name: string;
  partnerNotificationItemList: any;
  groupArrays: any;
  sortedData: any;
  partnerId: number;

  constructor(
    private authenticationService: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private readonly SkillpartnerdashboardService: SkillpartnerDashboardService
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }

  ngOnInit(): void {
    this.name = this.user?.firstName;
    this.partnerId = this.user?.id;
    this.partnerNotification(this.partnerId);
  }

  partnerNotification(Id): void {
    this.SkillpartnerdashboardService.getPartnerLastFiveNotification(Id).subscribe((res) => {
      this.partnerNotificationItemList = res;
      const groups = this.partnerNotificationItemList.reduce((groups, game) => {
        const date = game.date?.split('T')[0];
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(game);
        return groups;
      }, {});

      // Edit: to add it in the array format instead
      this.groupArrays = Object.keys(groups).map((date) => {
        return {
          date,
          games: groups[date],
        };
      });
    });
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  onMarkRead(list): void {
    this.SkillpartnerdashboardService.partnerMarkAsRead(list.id).subscribe((res) => {
      this.partnerNotification(this.partnerId);
    });
  }

  onMarkAllRead() {
    this.SkillpartnerdashboardService.getPartnerLastFiveNotification(this.partnerId).subscribe((res) => {
      this.partnerNotificationItemList = res;
      if (this.partnerNotificationItemList.length > 0) {
        for (let i = 0; i < this.partnerNotificationItemList.length; i++) {
          this.SkillpartnerdashboardService.partnerMarkAsRead(this.partnerNotificationItemList[i].id).subscribe((res) => {
            this.partnerNotification(this.partnerId);
          });
        }
      }
    });
  }
}
