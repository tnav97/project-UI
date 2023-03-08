import { Options } from '@angular-slider/ngx-slider';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { filter, first } from 'rxjs/operators';
import { Registration } from 'src/app/api/flexcub-api/models';
import { ownerImgUrl } from 'src/app/core/Constants/constant';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../authentication/authentication.service';
import { skillseekerdashboardService } from '../skillseeker-dashboard.service';

interface SliderDetails {
  requirementPhaseList: customStepDefinition[];
  value: number;
  accepted: boolean;
  currentStage: number;
  showTicksValues: boolean;
  showSelectionBar: boolean;
  floor?: number;
  ceil?: number;
}

interface customStepDefinition {
  stage: number;
  requirementPhaseName: string;
  status: string;
  interviewedBy: string;
}

@Component({
  selector: 'app-list-items-popup',
  templateUrl: './list-items-popup.component.html',
  styleUrls: ['./list-items-popup.component.scss'],
})
export class ListItemsPopupComponent implements OnInit {
  jobId: string;
  jobTitle: string;
  skillOwnerId: number;
  sliders: SliderDetails[] = [];
  currentStage: number;
  sliderList: any = [];
  isLoading: boolean = false;
  formForm: any;
  viewProcess: boolean = true;
  show: boolean = false;
  processForm: UntypedFormGroup;
  user?: Registration;
  name: string;
  surname: string;
  soImgUrl = ownerImgUrl;
  viewTextbox: boolean = false;

  @Input('skillOwnerId')
  set parentData(data: any) {
    this.getQueryParams();
    if (data) {
      this.candidateInterviewDetails(this.jobId, data);
    }
  }
  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private authenticationService: AuthenticationService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly skillseekerdashboardService: skillseekerdashboardService
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }

  ngOnInit(): void {
    this.formForm = this.formBuilder.group({
      token: [''],
      password: [''],
    });
    this.processForm = this.formBuilder.group({
      process: this.formBuilder.array([]),
    });
    this.name = this.user?.firstName;
    this.surname = this.user?.lastName;
    this.viewTextbox = true;
  }
  get processArray(): UntypedFormArray {
    return this.processForm.get('process') as UntypedFormArray;
  }
  createProcessFormGroup(data: any) {
    return this.formBuilder.group({
      interviewDate: [data.dateOfInterview ? data.dateOfInterview : ''],
      interviewedBy: [data.interviewedBy ? data.interviewedBy : ''],
      feedback: [data.feedback ? data.feedback : ''],
    });
  }

  saveCost(value, index, list) {
    if (value === '' && list.requirementPhaseList[index].feedback !== '') {
      let req = {
        jobId: list.jobId,
        skillOwnerId: list.skillOwnerId,
        stage: index + 1,
        feedback: value,
      };
      this.skillseekerdashboardService.updateDetailsForParticularRound(req).subscribe(
        (res) => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Details has been updated successfully',
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
    } else if (value === '' && list.requirementPhaseList[index].feedback === '') {
      return;
    } else {
      let req = {
        jobId: list.jobId,
        skillOwnerId: list.skillOwnerId,
        stage: index + 1,
        feedback: value,
      };
      this.skillseekerdashboardService.updateDetailsForParticularRound(req).subscribe(
        (res) => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Details has been updated successfully',
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
    }
  }

  editProcess() {
    this.viewProcess = false;
    this.show = true;
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

  candidateInterviewDetails(jobId: string, skillOwnerId: number) {
    this.sliderList = [];
    this.viewProcess = true;
    this.skillseekerdashboardService.candidateInterviewDetails(jobId, skillOwnerId).subscribe((res) => {
      const data = res;
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
        }
      );

      this.sliderList.push(res);
    });
  }

  sliderOptions(slider: SliderDetails): Options {
    if (slider.requirementPhaseList[slider.currentStage - 1].status == 'Not Cleared') {
      return {
        floor: 6,
        ceil: 5,
        vertical: true,
        rightToLeft: true,
        disabled: true,
        showTicksValues: slider.showTicksValues,
        showSelectionBarEnd: true,
        showSelectionBar: slider.showSelectionBar,
        stepsArray: slider.requirementPhaseList.map((val) => {
          return { value: val.stage, legend: val.requirementPhaseName };
        }),
        getPointerColor: (value: any): string => {
          if (slider.requirementPhaseList[slider.currentStage - 1].status == 'Not Cleared') {
            return 'red';
          }

          return 'orange';
        },
        getSelectionBarColor: (value: number): string => {
          if (value >= slider.currentStage && slider.requirementPhaseList[slider.currentStage - 1].status == 'Not Cleared') {
            return 'red';
          }
          return '#2AE02A';
        },
      };
    } else {
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
        getPointerColor: (value: any): string => {
          if (slider.requirementPhaseList[slider.currentStage - 1].status == 'Not Cleared') {
            return 'red';
          }
          if (slider.accepted === true && slider.currentStage === 1 && slider.requirementPhaseList[slider.currentStage - 1].interviewedBy !== null) {
            return '#20c142';
          }
          if (value == slider.requirementPhaseList.length) {
            return '#2AE02A';
          }

          return 'orange';
        },
        getSelectionBarColor: (value: number): string => {
          if (value >= slider.currentStage && slider.requirementPhaseList[slider.currentStage - 1].status == 'Not Cleared') {
            return 'red';
          }
          return '#2AE02A';
        },
      };
    }
  }
}
