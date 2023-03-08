import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Registration } from 'src/app/api/flexcub-api/models';
import { AuthenticationService } from '../authentication/authentication.service';
import { skillseekerdashboardService } from '../skillseeker-dashboard/skillseeker-dashboard.service';

@Component({
  selector: 'app-skillseeker-notification',
  templateUrl: './skillseeker-notification.component.html',
  styleUrls: ['./skillseeker-notification.component.scss'],
  providers: [DatePipe],
})
export class SkillseekerNotificationComponent implements OnInit {
  unread: boolean = false;
  sortedId: any;
  groupArrays: any;
  notificationMarked:any
  read: boolean;
  seekerId: number;
  user?: Registration;
  page: number = 1;
  count: number = 0;
  pageSize: number = 1;
  seekerNotificationItemList: any;
  // pageSizes: any = [5, 10, 15, 20];
  constructor(private authenticationService: AuthenticationService, private readonly SkillseekerdashboardService: skillseekerdashboardService) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }

  ngOnInit(): void {
    this.seekerId = this.user?.id;
    this.seekerNotification(this.seekerId);
  }

  seekerNotification(Id): void {
    this.SkillseekerdashboardService.seekerNotification(Id).subscribe((res) => {
      this.seekerNotificationItemList = res;
      console.log(this.seekerNotificationItemList);

  //     for(let i=0;i<this.seekerNotificationItemList.length;i++){
  //     var results = this.seekerNotificationItemList.reduce((result,org)=>{
  //       (result[this.seekerNotificationItemList[i].contentId] = result[this.seekerNotificationItemList[i].contentId] || []).push(org);
  //             return results;
  //   },{})
  // }
  // console.log(results);
  // const groupBy = (array, key) => {
  //   // Return the end result
  //   return array.reduce((result, currentValue) => {
  //     // If an array already present for key, push it to the array. Else create an array and push the object
  //     (result[currentValue[key]] = result[currentValue[key]] || []).push(
  //       currentValue
  //     );
  //     console.log(result)
  //     // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
  //     return result;
  //   }, {}); // empty object is the initial value for result object
  // };
  // const personGroupedByColor = groupBy(this.seekerNotificationItemList, 'contentId');


  // this.sortedId = [...this.seekerNotificationItemList].sort((a, b) => a.contenId - b.contentId)
  // const groups = this.sortedId.reduce((groups,orgs){
  //   const contentId = game.contentId
  //   if (!groups[contentId]) {
  //     groups[contentId] = [];
  //   }
  //   groups[contentId].push(game);
  //   return groups;
  // },{});



      // this.sortedData = [...this.seekerNotificationItemList].sort((a, b) => a.date - b.date);
      // const groups = this.sortedData.reduce((groups, game) => {
      //   const date = game.date.split('T')[0];
      //   if (!groups[date]) {
      //     groups[date] = [];
      //   }
      //   groups[date].push(game);
      //   return groups;
      // }, {});

      // // Edit: to add it in the array format instead
      // this.groupArrays = Object.keys(groups).map((date) => {
      //   return {
      //     date,
      //     games: groups[date],
      //   };
      // });



      var results = this.seekerNotificationItemList.reduce(function(results, org) {
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
    this.seekerNotification(this.seekerId);
  }

  pageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.seekerNotification(this.seekerId);
  }

  onMarkRead(list): void {
    this.SkillseekerdashboardService.seekerMarkAsRead(list.id).subscribe((res) => {
      console.log(this.notificationMarked);
      this.seekerNotification(this.seekerId);
    });
  }
}
