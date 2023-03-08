import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Registration } from 'src/app/api/flexcub-api/models';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../authentication/authentication.service';
import { skillseekerdashboardService } from '../skillseeker-dashboard.service';

@Component({
  selector: 'app-list-items-notification',
  templateUrl: './list-items-notification.component.html',
  styleUrls: ['./list-items-notification.component.scss'],
})
export class ListItemsNotificationComponent implements OnInit {
  user?: Registration;
  name: string;
  seekerNotificationItemList: any;
  sortedData: any;
  currentStage: any;
  seekerId: Number;
  jobId: any;
  ownerId: any;

  constructor(
    private authenticationService: AuthenticationService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private readonly SkillseekerdashboardService: skillseekerdashboardService,
    private cdr: ChangeDetectorRef
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }
  ngOnInit(): void {
    this.name = this.user?.firstName;
    this.seekerId = this.user?.id;
    this.route.params.subscribe((params) => {
      this.jobId = params.jobId;
      this.ownerId = params.ownerId;
    }),
      // this.seekerNotification(this.seekerId);
      this.getSeekerNotificationByOwner(this.ownerId, this.jobId);
  }

  getSeekerNotificationByOwner(ownerId, jobId): void {
    this.SkillseekerdashboardService.getSeekerNotificationByOwner(ownerId, jobId).subscribe((res) => {
      this.seekerNotificationItemList = res;

      for (let i = 0; i < this.seekerNotificationItemList.length; i++) {
        if (this.seekerNotificationItemList.contentId === (2 || 4 || 6)) {
          this.SkillseekerdashboardService.getSelectionPhase(
            this.seekerNotificationItemList[i].jobId,
            this.seekerNotificationItemList[i].ownerId
          ).subscribe((res) => {
            this.seekerNotificationItemList[i].date1 = `${res?.dateSlotsByOwner1} ${res?.timeSlotsByOwner1}`;
            this.seekerNotificationItemList[i].date2 = `${res?.dateSlotsByOwner2} ${res?.timeSlotsByOwner2}`;
            this.seekerNotificationItemList[i].date3 = `${res?.dateSlotsByOwner3} ${res?.timeSlotsByOwner3}`;
          });
        }
      }
      this.sortedData = [...this.seekerNotificationItemList];
      this.cdr.detectChanges();
      this.cdr.markForCheck();
    });
  }
  // getSeekerNotificationByOwner(id, jobid){

  // }

  onAccept(list): void {
    this.SkillseekerdashboardService.updateSlotConfirmedBySeeker(list.jobId, list.ownerId).subscribe((res) => {
      this.SkillseekerdashboardService.acceptInterview(list.jobId, list.ownerId).subscribe((res) => {
        this.SkillseekerdashboardService.seekerMarkAsRead(list.id).subscribe((res) => {});
      });
    });
    this.getSeekerNotificationByOwner(this.ownerId, this.jobId);
  }

  onReject(list): void {
    this.SkillseekerdashboardService.updateNewSlotBySeeker(list.jobId, list.ownerId).subscribe(
      (res) => {
        this.SkillseekerdashboardService.seekerMarkAsRead(list.id).subscribe((res) => {
          this.getSeekerNotificationByOwner(this.ownerId, this.jobId);
        });
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'new slots is requested to owner notification',
          showConfirmButton: false,
          timer: 1500,
        });
      },
      (error) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: error,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    );
  }

  onMarkRead(list): void {
    this.SkillseekerdashboardService.seekerMarkAsRead(list.id).subscribe((res) => {
      this.getSeekerNotificationByOwner(this.ownerId, this.jobId);
    });
  }

  onMarkAllRead() {
    this.SkillseekerdashboardService.getSeekerLastFiveNotification(this.seekerId).subscribe((res) => {
      this.seekerNotificationItemList = res;
      for (let i = 0; i < this.seekerNotificationItemList.length; i++) {
        this.SkillseekerdashboardService.seekerMarkAsRead(this.seekerNotificationItemList[i].id).subscribe((res) => {
          this.getSeekerNotificationByOwner(this.ownerId, this.jobId);
        });
      }
    });
  }

  onDateConfirm(list, scheduledate): void {
    this.SkillseekerdashboardService.candidateInterviewDetails(list.jobId, list.skillOwnerId).subscribe((res) => {
      this.currentStage = res.currentStage;
      var myarray = [];
      myarray = scheduledate.split(' ');
      var req = {
        jobId: list.jobId,
        skillOwnerId: list.skillOwnerId,
        dateOfInterview: myarray[0],
        timeOfInterview: myarray[1],
        stage: this.currentStage,
      };
      this.SkillseekerdashboardService.acceptInterview(list.jobId, list.skillOwnerId).subscribe();
      let req2 = {
        jobId: list.jobId,
        skillOwnerId: list.skillOwnerId,
        stage: this.currentStage,
        interviewedBy: res?.requirementPhaseList[this.currentStage - 1].interviewedBy,
        dateOfInterview: myarray[0],
        timeOfInterview: myarray[1],
        modeOfInterview: res?.requirementPhaseList[this.currentStage - 1].modeOfInterview,
      };
      this.SkillseekerdashboardService.updateDetailsForParticularRound(req).subscribe(
        (res) => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Date is scheduled',
            showConfirmButton: false,
            timer: 500,
          });
          this.SkillseekerdashboardService.scheduleInterview(req2).subscribe();
          this.SkillseekerdashboardService.updateSlotConfirmedBySeeker(list.jobId, list.skillOwnerId).subscribe(
            (res) => {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Seeker confirmed ',
                showConfirmButton: false,
                timer: 500,
              });
            },
            (error) => {
              Swal.fire({
                position: 'center',
                icon: 'error',
                title: error,
                showConfirmButton: false,
                timer: 1500,
              });
            }
          );
        },
        (error) => {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: error,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      );
      this.SkillseekerdashboardService.seekerMarkAsRead(list.id).subscribe((req) => {
        this.getSeekerNotificationByOwner(this.ownerId, this.jobId);
      });
    });
  }
}
