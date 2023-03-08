import { Options } from '@angular-slider/ngx-slider';
import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, first } from 'rxjs/operators';
import { FeedbackRate } from 'src/app/api/flexcub-api/models';
import { ownerImgUrl } from 'src/app/core/Constants/constant';
import Swal from 'sweetalert2';
import { skillseekerdashboardService } from '../skillseeker-dashboard.service';

interface SliderDetails {
  requirementPhaseList: customStepDefinition[];
  value: number;
  showTicksValues: boolean;
  showSelectionBar: boolean;
  floor?: number;
  ceil?: number;
}

interface customStepDefinition {
  stage: number;
  requirementPhaseName: string;
}

@Component({
  selector: 'app-list-items-edit',
  templateUrl: './list-items-edit.component.html',
  styleUrls: ['./list-items-edit.component.scss'],
  providers: [DatePipe],
})
export class ListItemsEditComponent implements OnInit {
  jobId: string;
  rating_Value:FeedbackRate[]=[]
  jobTitle: string;
  skillOwnerId: number;
  sliders: SliderDetails[] = [];
  currentStage: number;
  sliderList: any = [];
  isLoading: boolean = false;
  formForm: any;
  viewProcess: boolean = true;
  show: boolean = false;
  scheduleInterviewForm: UntypedFormGroup;
  updateInterviewForm: UntypedFormGroup;
  skillOwnerIdValue: number;
  stages = [];
  soImgUrl = ownerImgUrl;
  today = new Date();
  today1 = new Date();
  show1: boolean = false;
  preminDates: any;
  minDates: any;

  @Input('skillOwnerId')
  set parentData(data: any) {
    this.getQueryParams();
    if (data) {
      this.skillOwnerIdValue = data;
      this.candidateInterviewDetails(this.jobId, data);
    }
  }
  @Input() formDisplay;
  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly skillseekerdashboardService: skillseekerdashboardService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.feedback();
    this.scheduleInterviewForm = new UntypedFormGroup({
      dateOfInterview: new UntypedFormControl('', Validators.required),
      interviewedBy: new UntypedFormControl('', Validators.required),
      modeOfInterview: new UntypedFormControl('', Validators.required),
      timePicker1: new UntypedFormControl('', Validators.required),
      timePicker2: new UntypedFormControl('', Validators.required),
    });
    this.updateInterviewForm = new UntypedFormGroup({
      dateOfInterview: new UntypedFormControl('', Validators.required),
      timePicker1: new UntypedFormControl('', Validators.required),
      timePicker2: new UntypedFormControl('', Validators.required),
      interviewedBy: new UntypedFormControl('', Validators.required),
      feedback: new UntypedFormControl('', Validators.required),
      ratings: new UntypedFormControl('', Validators.required),
      stage: new UntypedFormControl('', Validators.required),
      modeOfInterview: new UntypedFormControl('', Validators.required),
    });
  }

  feedback(){
    this.skillseekerdashboardService.feedback().subscribe((res)=>{
      this.rating_Value = res;
    })
  }

  saveProcess(list) {
    this.isLoading = true;
    let date2 =
      list?.requirementPhaseList[list.currentStage - 1].dateOfInterview + ',' + list?.requirementPhaseList[list.currentStage - 1].endTimeOfInterview;
    let date =
      this.datePipe.transform(this.scheduleInterviewForm.get('dateOfInterview').value, 'yyyy-MM-dd') +
      ',' +
      this.datePipe.transform(this.scheduleInterviewForm.get('timePicker1').value, 'HH:mm');
    if (this.datePipe.transform(date2, 'MMM d, y, h:mm:ss a') > this.datePipe.transform(date, 'MMM d, y, h:mm:ss a')) {
      this.isLoading = false;
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: `The date ${this.datePipe.transform(date2, 'M/d/yy, hh:mm a')} is in the past for the round - ${
          list.requirementPhaseList[list.currentStage - 1].requirementPhaseName
        }. Please make sure its greater than ${this.datePipe.transform(date, 'M/d/yy, h:mm a')}.`,
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }
    let req = {
      jobId: list.jobId,
      skillOwnerId: list.skillOwnerId,
      stage: list.currentStage + 1,
      interviewedBy: this.scheduleInterviewForm.get('interviewedBy').value,
      dateOfInterview: this.datePipe.transform(this.scheduleInterviewForm.get('dateOfInterview').value, 'yyyy-MM-dd'),
      timeOfInterview: this.datePipe.transform(this.scheduleInterviewForm.get('timePicker1').value, 'HH:mm'),
      endTimeOfInterview: this.datePipe.transform(this.scheduleInterviewForm.get('timePicker2').value, 'HH:mm'),
      modeOfInterview: this.scheduleInterviewForm.get('modeOfInterview').value,
    };
    this.skillseekerdashboardService.scheduleInterview(req).subscribe((res) => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: `Interview has been scheduled for ${list.requirementPhaseList[list.currentStage].requirementPhaseName} successfully`,
        showConfirmButton: false,
        timer: 1500,
      });
      window.location.reload();
      this.isLoading = false;
    });
  }

  updateProcess(list) {
    this.isLoading = true;

    let req = {
      jobId: list.jobId,
      skillOwnerId: list.skillOwnerId,
      stage: this.updateInterviewForm.get('stage').value,
      interviewedBy: this.updateInterviewForm.get('interviewedBy').value,
      candidatePercentage: this.updateInterviewForm.get('ratings').value,
      dateOfInterview: this.datePipe.transform(this.updateInterviewForm.get('dateOfInterview').value, 'yyyy-MM-dd'),
      timeOfInterview: this.datePipe.transform(this.updateInterviewForm.get('timePicker1').value, 'HH:mm'),
      endTimeOfInterview: this.datePipe.transform(this.updateInterviewForm.get('timePicker2').value, 'HH:mm'),
      modeOfInterview: this.updateInterviewForm.get('modeOfInterview').value,
      feedback: this.updateInterviewForm.get('feedback').value,
    };

    this.skillseekerdashboardService.updateDetailsForParticularRound(req).subscribe(
      (res) => {
        this.isLoading = false;
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Details has been updated successfully',
          showConfirmButton: false,
          timer: 1500,
        });
        window.location.reload();
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
  }

  getQueryParams(): void {
    this.activatedRoute.params
      .pipe(
        filter((param: Params) => !!param),
        first()
      )
      .subscribe((param: Params) => {
        this.jobId = param.jobId;
      });
  }

  isValid(event: boolean): void {
    this.minDates = new Date(this.scheduleInterviewForm.get('timePicker1').value);
  }

  handler(i) {
    if (
      i == 1 &&
      this.datePipe.transform(this.scheduleInterviewForm.get('dateOfInterview').value, 'yyyy-MM-dd') ===
        this.datePipe.transform(this.today, 'yyyy-MM-dd')
    ) {
      this.show1 = true;
    }
    if (!this.show1) {
      this.preminDates = this.today1.setHours(8);
    }
  }

  candidateInterviewDetails(jobId: string, skillOwnerId: number) {
    this.sliderList = [];
    this.isLoading = true;
    this.viewProcess = true;
    this.skillseekerdashboardService.candidateInterviewDetails(jobId, skillOwnerId).subscribe((res) => {
      const data = res;
      this.stages = [];
      for (let i = 0; i < data.currentStage - 1; i++) {
        if (data.currentStage == 1) {
          if (data.requirementPhaseList[0].interviewedBy === 'Skill Seeker') {
            this.stages.push(i + 1);
          }
        } else {
          this.stages.push(i + 1);
        }
      }
      this.skillseekerdashboardService.downloadImage(data?.skillOwnerId).subscribe(
        (res) => {
          data['image'] = this.soImgUrl + data?.skillOwnerId;
        },
        (err) => {
          if (err.status == 200) {
            data['image'] = this.soImgUrl + data?.skillOwnerId;
          } else {
            data['image'] = `assets/images/avatar-default-skillowner.png`;
          }
          this.isLoading = false;
        }
      );
      this.isLoading = false;

      this.sliderList.push(res);
    });
  }

  onOptionsSelected(value: string) {
    this.skillseekerdashboardService.candidateInterviewDetails(this.jobId, this.skillOwnerIdValue).subscribe((res) => {
      const data = res;
      for (let i = 0; i < data.requirementPhaseList.length; i++) {
        if (parseInt(value) === data.requirementPhaseList[i].stage) {
          let date = data?.requirementPhaseList[i].dateOfInterview + ',' + data?.requirementPhaseList[i].timeOfInterview;
          let date2 = data?.requirementPhaseList[i].dateOfInterview + ',' + data?.requirementPhaseList[i].endTimeOfInterview;
          this.updateInterviewForm.get('interviewedBy').patchValue(data?.requirementPhaseList[i].interviewedBy);
          if (data?.requirementPhaseList[i].dateOfInterview) {
            this.updateInterviewForm.get('dateOfInterview').patchValue(this.datePipe.transform(date, 'M-d-yy'));
          }
          if (data?.requirementPhaseList[i].dateOfInterview) {
            this.updateInterviewForm.get('timePicker1').patchValue(this.datePipe.transform(date, 'M-d-yy, h:mm a'));
          }
          if (data?.requirementPhaseList[i].dateOfInterview) {
            this.updateInterviewForm.get('timePicker2').patchValue(this.datePipe.transform(date2, 'M-d-yy, h:mm a'));
          }
          this.updateInterviewForm.get('modeOfInterview').patchValue(data?.requirementPhaseList[i].modeOfInterview);
          this.updateInterviewForm.get('feedback').patchValue(data?.requirementPhaseList[i].feedback);
          this.updateInterviewForm.get('marks').patchValue(data?.requirementPhaseList[i].candidateRate);
        }
      }
    });
  }

  sliderOptions(slider: SliderDetails): Options {
    return {
      floor: 6,
      ceil: 5,
      vertical: true,
      rightToLeft: true,
      disabled: true,
      showTicksValues: slider.showTicksValues,
      showSelectionBar: slider.showSelectionBar,
      stepsArray: slider.requirementPhaseList.map((val) => {
        return { value: val.stage, legend: val.requirementPhaseName };
      }),
    };
  }
}
