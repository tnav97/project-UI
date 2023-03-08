import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { addDays } from 'date-fns';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { TimepickerConfig } from 'ngx-bootstrap/timepicker';
import { forkJoin } from 'rxjs';
import { Registration } from 'src/app/api/flexcub-api/models/registration';
import { AppService } from 'src/app/app.service';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../authentication/authentication.service';
import { skillseekerdashboardService } from '../skillseeker-dashboard/skillseeker-dashboard.service';
import { SkillownerDashboardService } from './skillowner-dashboard.service';
declare var $: any;

export function getTimepickerConfig(): TimepickerConfig {
  return Object.assign(new TimepickerConfig(), {
    allowEmptyTime: true,
  });
}

@Component({
  selector: 'app-skillowner-dashboard',
  templateUrl: './skillowner-dashboard.component.html',
  styleUrls: ['./skillowner-dashboard.component.scss'],
  providers: [DatePipe, { provide: TimepickerConfig, useFactory: getTimepickerConfig }],
})
export class SkillownerDashboardComponent implements OnInit {
  user?: Registration;
  toggleSideBar: boolean = false;
  togglebutton: boolean = false;
  name: string;
  ownerId: number;
  jobTitle: string;
  sortedData: any;
  today = new Date();
  today1 = new Date();
  today2 = new Date();
  date1 = new Date();
  ownerNotificationItemList: any;
  candidateData: any;
  datestring: any;
  groupArrays: any;
  myDate: string = '';
  test = [new Date(), new Date()];
  // showFrom: boolean = false;
  show: boolean = false;
  show1: boolean = false;
  show2: boolean = false;
  show3: boolean = false;

  firstFormGroup = this._formBuilder.group({
    datePicker: ['', Validators.required],
    timePicker1: ['', Validators.required],
    timePicker2: ['', Validators.required],
  });

  secondFormGroup = this._formBuilder.group({
    datePicker: ['', Validators.required],
    timePicker1: ['', Validators.required],
    timePicker2: ['', Validators.required],
  });

  thirdFormGroup = this._formBuilder.group({
    datePicker: ['', Validators.required],
    timePicker1: ['', Validators.required],
    timePicker2: ['', Validators.required],
  });

  mytime: Date | undefined = new Date();
  to: Date | undefined = new Date();
  disabledDates: any;
  disabledDates2: any;
  disabledDates3: any;
  minDates: any;
  minDates2: any;
  minDates3: any;
  preminDates: any;
  preminDates2: any;
  preminDates3: any;
  maxDates: any;
  maxDates2: any;
  maxDates3: any;
  closeShow: Boolean = true;
  isLinear = true;
  slotsGroup: any[] = [];
  bsConfig: Partial<BsDatepickerConfig> = { containerClass: 'theme-dark-blue' };

  constructor(
    private authenticationService: AuthenticationService,
    private readonly SkillownerdashboardService: SkillownerDashboardService,
    private router: Router,
    private datePipe: DatePipe,
    private readonly _appService: AppService,
    private readonly skillseekerdashboardService: skillseekerdashboardService,
    private cdr: ChangeDetectorRef,
    private _formBuilder: UntypedFormBuilder
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
    this.date1.setTime(this.today.getTime() + 60 * 60 * 1000);
  }

  ngOnInit(): void {
    this.name = this.user?.firstName;
    this.ownerId = this.user?.id;
    var universalValue = localStorage.getItem('universalSlot');
    if (this.user?.loginCount === 1 && !universalValue) {
      this.togglebutton = true;
      this.closeShow = false;
      $('#exampleModal').modal({ backdrop: 'static', keyboard: false });
      $('#exampleModal').modal('show');
    }
    this.ownerNotification(this.ownerId);
    this.initSlotGroup();
  }

  initSlotGroup(): void {
    const form = () => {
      return this._formBuilder.group({
        date: [null, Validators.compose([Validators.required])],
        start: [null, Validators.compose([Validators.required])],
        end: [null, Validators.compose([Validators.required])],
      });
    };
    for (let i = 1; i <= 3; i++) {
      const j = { label: `Slot ${i}`, minDate: new Date(), datesDisabled: [], min: null, form: form() };
      this.slotsGroup.push(j);
    }
  }

  slotSelection(type: 'date' | 'start' | 'end', i: number): void {
    const ii = i + 1;
    const j = this.slotsGroup[ii] ?? null;
    const k = this.slotsGroup[i] ?? null;
    if (!j || !k) return;

    const definition = {
      date: () => {
        const n = k?.form?.get('date')?.value;
        const minDate = n ? addDays(new Date(n), 1) : new Date();
        (j?.form as UntypedFormGroup)?.get('date')?.setValue(null);
        j.minDate = minDate;
      },
      start: () => {},
      end: () => {},
    };

    definition[type] ? setTimeout(() => definition[type](), 500) : null;
  }

  get _slotGroup(): boolean {
    return this.slotsGroup.every((n) => n?.form?.valid);
  }

  handler(i) {
    if (
      i == 1 &&
      this.datePipe.transform(this.firstFormGroup.get('datePicker').value, 'yyyy-MM-dd') === this.datePipe.transform(this.today, 'yyyy-MM-dd')
    ) {
      this.show1 = true;
    }
    if (
      i == 2 &&
      this.datePipe.transform(this.secondFormGroup.get('datePicker').value, 'yyyy-MM-dd') === this.datePipe.transform(this.today, 'yyyy-MM-dd')
    ) {
      this.show2 = true;
    }
    if (
      i == 3 &&
      this.datePipe.transform(this.thirdFormGroup.get('datePicker').value, 'yyyy-MM-dd') === this.datePipe.transform(this.today, 'yyyy-MM-dd')
    ) {
      this.show3 = true;
    }
    if (!this.show1) {
      this.preminDates = this.today1.setHours(8);
    }
    if (!this.show2) {
      this.preminDates2 = this.today1.setHours(8);
    }
    if (!this.show3) {
      this.preminDates3 = this.today1.setHours(8);
    }
    var date = new Date(this.firstFormGroup.get('datePicker').value);

    date.setDate(date.getDate() + 1);

    var date2 = new Date(this.secondFormGroup.get('datePicker').value);

    date2.setDate(date2.getDate() + 1);

    this.disabledDates = [new Date(this.secondFormGroup.get('datePicker').value), new Date(this.thirdFormGroup.get('datePicker').value)];
    this.disabledDates2 = date;
    this.disabledDates3 = date2;
  }

  isValid(event: boolean): void {
    this.minDates = new Date(this.firstFormGroup.get('timePicker1').value);
    this.minDates2 = new Date(this.secondFormGroup.get('timePicker1').value);
    this.minDates3 = new Date(this.thirdFormGroup.get('timePicker1').value);
  }

  careerProfile(ownerId: number): void {
    this.router.navigate(['/sodashboard/careerProfile/ownerId/' + ownerId]);
  }

  closeBar(): void {
    this.toggleSideBar = false;
  }

  onSubmit() {
    const request = { jobId: this.candidateData.jobId, skillOwnerEntityId: this.candidateData.skillOwnerEntityId };
    this.slotsGroup.forEach((ele, i: number) => {
      let ii = i + 1;
      const form = ele?.form;
      Object.assign(request, {
        [`dateSlotsByOwner${ii}`]: this._appService.convertTime(form?.get('date')?.value),
        [`timeSlotsByOwner${ii}`]: this.datePipe.transform(form?.get('start')?.value, 'HH:mm'),
        [`endTimeSlotsByOwner${ii}`]: this.datePipe.transform(form?.get('end')?.value, 'HH:mm'),
      });
    });
    this.SkillownerdashboardService.updateSlotBySkillOwner(request).subscribe((res) => {
      this.toggleSideBar = false;

      this.SkillownerdashboardService.ownerMarkAsRead(this.candidateData.id).subscribe((res) => {
        this.ownerNotification(this.ownerId);
      });
    });
  }

  onToggle() {
    this.togglebutton = true;
  }

  onUniversalSlot() {
    const request = { skillOwnerEntityId: this.ownerId };
    this.slotsGroup.forEach((ele, i: number) => {
      let ii = i + 1;
      const form = ele?.form;
      Object.assign(request, {
        [`dateSlotsByOwner${ii}`]: this._appService.convertTime(form?.get('date')?.value),
        [`timeSlotsByOwner${ii}`]: this.datePipe.transform(form?.get('start')?.value, 'HH:mm'),
        [`endTimeSlotsByOwner${ii}`]: this.datePipe.transform(form?.get('end')?.value, 'HH:mm'),
      });
    });
    this.SkillownerdashboardService.insertCommonSlotByOwner(request).subscribe((res) => {
      this.toggleSideBar = false;
      $('#exampleModal').modal('hide');
      if (this.user.loginCount == 1) {
        localStorage.setItem('universalSlot', 'true');
      }

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Universal slot added successfully',
        showConfirmButton: false,
        timer: 1500,
      });
      if (this.user.loginCount !== 1) {
        localStorage.removeItem('universalSlot');
      }
      this.SkillownerdashboardService.ownerMarkAsRead(this.candidateData.id).subscribe((res) => {
        this.ownerNotification(this.ownerId);
      });
    });
  }

  ownerNotification(Id): void {
    this.SkillownerdashboardService.getOwnerLastFiveNotification(Id).subscribe((res) => {
      this.ownerNotificationItemList = res;
      const groups = this.ownerNotificationItemList.reduce((groups, game) => {
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

      this.sortedData = [...this.ownerNotificationItemList].sort((a, b) => a.date - b.date).reverse();
      if (res[0]?.jobId) {
        this.skillseekerdashboardService.getCandidateItems(res[0]?.jobId).subscribe((res1) => {});
      }
    });
    this.cdr.detectChanges();
    this.cdr.markForCheck();
  }

  onSelect(list): void {
    this.toggleSideBar = true;
    this.candidateData = list;
  }

  onSelect2(list): void {
    this.toggleSideBar = true;
    this.candidateData = list;
    this.togglebutton = true;
  }

  onAccept(list): void {
    var request = {
      jobId: list.jobId,
      skillOwnerEntityId: list.skillOwnerEntityId,
      accepted: true,
    };

    this.SkillownerdashboardService.acceptRejectBySkillOwner(request).subscribe(
      (res) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Accepted successfully',
          showConfirmButton: false,
          timer: 1500,
        });
        this.SkillownerdashboardService.ownerMarkAsRead(list.id).subscribe((res) => {
          this.ownerNotification(this.ownerId);
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

  onAccept2(list): void {
    this.skillseekerdashboardService.candidateInterviewDetails(list.jobId, list.skillOwnerEntityId).subscribe((res) => {
      // let req2 = {
      //   jobId: list.jobId,
      //   skillOwnerId: list.skillOwnerEntityId,
      //   stage: res?.currentStage,
      //   interviewedBy: res?.requirementPhaseList[res?.currentStage - 1].interviewedBy,
      //   dateOfInterview: res?.requirementPhaseList[res?.currentStage - 1].dateOfInterview,
      //   timeOfInterview: res?.requirementPhaseList[res?.currentStage - 1].timeOfInterview,
      //   modeOfInterview: res?.requirementPhaseList[res?.currentStage - 1].modeOfInterview,
      // };
      // this.skillseekerdashboardService.scheduleInterview(req2).subscribe();
      forkJoin([
        this.SkillownerdashboardService.acceptInterview(list.jobId, list.skillOwnerEntityId),
        this.SkillownerdashboardService.ownerMarkAsRead(list.id),
      ]).subscribe(
        (res) => {
          this.ownerNotification(this.ownerId);
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
    });
  }

  onMarkRead(list): void {
    this.SkillownerdashboardService.ownerMarkAsRead(list.id).subscribe((res) => {
      this.ownerNotification(this.ownerId);
    });
  }

  onMarkAllRead() {
    this.SkillownerdashboardService.getOwnerLastFiveNotification(this.ownerId).subscribe((res) => {
      this.ownerNotificationItemList = res;
      if (this.ownerNotificationItemList.length > 0) {
        for (let i = 0; i < this.ownerNotificationItemList.length; i++) {
          this.SkillownerdashboardService.ownerMarkAsRead(this.ownerNotificationItemList[i].id).subscribe((res) => {
            this.ownerNotification(this.ownerId);
          });
        }
      }
    });
  }

  onReject(list): void {
    var request = {
      jobId: list.jobId,
      skillOwnerEntityId: list.skillOwnerEntityId,
      accepted: false,
    };

    this.SkillownerdashboardService.acceptRejectBySkillOwner(request).subscribe(
      (res) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Rejected successfully',
          showConfirmButton: false,
          timer: 1500,
        });
        this.SkillownerdashboardService.ownerMarkAsRead(list.id).subscribe((res) => {
          this.ownerNotification(this.ownerId);
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
}
