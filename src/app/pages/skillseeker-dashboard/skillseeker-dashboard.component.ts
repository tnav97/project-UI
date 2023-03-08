import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Registration } from 'src/app/api/flexcub-api/models';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../authentication/authentication.service';
import { skillseekerdashboardService } from './skillseeker-dashboard.service';

@Component({
  selector: 'app-skillseeker-dashboard',
  templateUrl: './skillseeker-dashboard.component.html',
  styleUrls: ['./skillseeker-dashboard.component.scss'],
  providers: [DatePipe],
})
export class SkillseekerDashboardComponent implements OnInit {
  user?: Registration;
  name: string;
  seekerNotificationItemList: any;
  sortedData: any;
  currentStage: any;
  groupArrays: any;
  seekerId: Number;
  today = new Date();

  constructor(
    private authenticationService: AuthenticationService,
    private http: HttpClient,
    private readonly SkillseekerdashboardService: skillseekerdashboardService,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }
  ngOnInit(): void {
    this.name = this.user?.firstName;
    this.seekerId = this.user?.id;

    this.seekerNotification(this.seekerId);
  }

  seekerNotification(Id): void {
    this.SkillseekerdashboardService.getSeekerLastFiveNotification(Id).subscribe((res) => {
      this.seekerNotificationItemList = res;
      for (let i = 0; i < this.seekerNotificationItemList.length; i++) {
        this.SkillseekerdashboardService.getSelectionPhase(
          this.seekerNotificationItemList[i].jobId,
          this.seekerNotificationItemList[i].skillOwnerId
        ).subscribe((res) => {
          this.seekerNotificationItemList[i].date1 = `${res?.dateSlotsByOwner1} ${res?.timeSlotsByOwner1}`;
          this.seekerNotificationItemList[i].date2 = `${res?.dateSlotsByOwner2} ${res?.timeSlotsByOwner2}`;
          this.seekerNotificationItemList[i].date3 = `${res?.dateSlotsByOwner3} ${res?.timeSlotsByOwner3}`;
          this.seekerNotificationItemList[i].endtime1 = `${res?.dateSlotsByOwner1} ${res?.endTimeSlotsByOwner1}`;
          this.seekerNotificationItemList[i].endtime2 = `${res?.dateSlotsByOwner2} ${res?.endTimeSlotsByOwner2}`;
          this.seekerNotificationItemList[i].endtime3 = `${res?.dateSlotsByOwner3} ${res?.endTimeSlotsByOwner3}`;
        });
      }
      this.sortedData = [...this.seekerNotificationItemList].sort((a, b) => a.date - b.date);
      const groups = this.sortedData.reduce((groups, game) => {
        const date = game.date.split('T')[0];
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

      this.cdr.detectChanges();
      this.cdr.markForCheck();
    });
  }

  onAccept(list): void {
    this.SkillseekerdashboardService.updateSlotConfirmedBySeeker(list.jobId, list.ownerId).subscribe((res) => {
      this.SkillseekerdashboardService.acceptInterview(list.jobId, list.ownerId).subscribe((res) => {
        let req = {
          jobId: list.jobId,
          skillOwnerId: list.ownerId,
          stage: 1,
          interviewedBy: 'Skill seeker',
          modeOfInterview: 'Remote',
          feedback: 'Cleared',
        };
        this.SkillseekerdashboardService.updateDetailsForParticularRound(req).subscribe(
          (res) => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Accepted successfully',
              showConfirmButton: false,
              timer: 1500,
            });
          },
          (error) => {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: error,
              showConfirmButton: false,
              timer: 1500,
            });
          }
        );
        this.SkillseekerdashboardService.seekerMarkAsRead(list.id).subscribe((res) => {
          this.seekerNotification(this.seekerId);
        });
      });
    });
  }

  onReject(list): void {
    this.SkillseekerdashboardService.updateNewSlotBySeeker(list.jobId, list.ownerId).subscribe(
      (res) => {
        this.SkillseekerdashboardService.seekerMarkAsRead(list.id).subscribe((res) => {
          this.seekerNotification(this.seekerId);
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
      this.seekerNotification(this.seekerId);
    });
  }

  onMarkAllRead() {
    this.SkillseekerdashboardService.getSeekerLastFiveNotification(this.seekerId).subscribe((res) => {
      this.seekerNotificationItemList = res;
      for (let i = 0; i < this.seekerNotificationItemList.length; i++) {
        this.SkillseekerdashboardService.seekerMarkAsRead(this.seekerNotificationItemList[i].id).subscribe((res) => {
          this.seekerNotification(this.seekerId);
        });
      }
    });
  }

  onDateConfirm(list, scheduledate, endDate): void {
    this.SkillseekerdashboardService.candidateInterviewDetails(list.jobId, list.skillOwnerId).subscribe((res) => {
      this.currentStage = res.currentStage;
      var myarray = [];
      var myarray1 = [];
      myarray = scheduledate.split(' ');
      myarray1 = endDate.split(' ');
      if (
        this.datePipe.transform(list.requirementPhaseList[list.currentStage - 1].dateOfInterview, 'yyyy-MM-dd') >=
        this.datePipe.transform(scheduledate, 'yyyy-MM-dd')
      ) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: `The date ${this.datePipe.transform(
            list.requirementPhaseList[list.currentStage - 1].dateOfInterview,
            'MM-dd-yyyy'
          )} for the round - ${
            list.requirementPhaseList[list.currentStage - 1].requirementPhaseName
          }. Please make sure its greater than ${this.datePipe.transform(scheduledate, 'MM-dd-yyyy')}.`,
          showConfirmButton: false,
          timer: 3000,
        });
        return;
      }
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
        endTimeOfInterview: myarray1[1],
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
        this.seekerNotification(this.seekerId);
      });
    });
  }
}
