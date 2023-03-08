import { Options } from '@angular-slider/ngx-slider';
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, first } from 'rxjs/operators';
import { FeedbackRate, Registration } from 'src/app/api/flexcub-api/models';
import { ownerImgUrl } from 'src/app/core/Constants/constant';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../authentication/authentication.service';
import { skillseekerdashboardService } from '../skillseeker-dashboard.service';

interface SliderDetails {
  accepted: boolean;
  requirementPhaseList: customStepDefinition[];
  value: number;
  currentStage: number;
  showTicksValues: boolean;
  showSelectionBar: boolean;
  floor?: number;
  ceil?: number;
}

interface customStepDefinition {
  stage: number;
  requirementPhaseName: string;
  interviewedBy: string;
  status: string;
}
@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.component.html',
  styleUrls: ['./list-items.component.scss'],
  providers: [DatePipe],
})
export class ListItemsComponent implements OnInit {
  toggleSideBar: boolean = false;
  toggleSideBar2: boolean = false;
  formDisplay: boolean = true;
  jobId: string;
  candidateItemList: any;
  jobTitle: string;
  showSliderDiv: boolean = false;
  skillOwnerId: string = '';
  skillOwnerName: string = '';
  skillOwnerExperience: string = '';
  isLoading: boolean = false;
  show: boolean = false;
  isLocked: boolean = true;
  updateForm!: UntypedFormGroup;
  array = [];
  data = {};
  data2 = {};
  count = 0;
  soImgUrl = ownerImgUrl;
  count1 = 0;
  moduleAccess = [];
  marks = '';
  savedjobId: any;
  savedskillOwnerId: any;
  savedstage: any;
  savedrequirementPhaseName: any;
  skillOwnerid: any;
  user?: Registration;
  subRoleId: any;
  schedulingVisiblity: Boolean;
  sowVisibility: Boolean;
  poVisibility: Boolean;
  msaVisibility: Boolean;
  rejectVisibility: Boolean;
  updateInterviewVisiblity: Boolean;
  prevSavedrequirementPhaseName: any;
  dateOfInterview: any;
  endTimeOfInterview: any;
  rating_Value:FeedbackRate[]=[]

  constructor(
    private authenticationService: AuthenticationService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly skillseekerdashboardService: skillseekerdashboardService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }

  ngOnInit(): void {
    this.getQueryParams();
    this.feedback();
    this.moduleAccess = this.user?.modulesAccess;
    this.schedulingVisiblity = this.moduleAccess.some((element) => {
      if (element.seekerModule === 'Interview Scheduling') {
        return true;
      }

      return false;
    });
    this.sowVisibility = this.moduleAccess.some((element) => {
      if (element.seekerModule === 'Creation of SOW') {
        return true;
      }

      return false;
    });
    this.poVisibility = this.moduleAccess.some((element) => {
      if (element.seekerModule === 'Creation of PO') {
        return true;
      }

      return false;
    });
    this.msaVisibility = this.moduleAccess.some((element) => {
      if (element.seekerModule === 'Creation of MSA') {
        return true;
      }

      return false;
    });
    this.rejectVisibility = this.moduleAccess.some((element) => {
      if (element.seekerModule === 'Reject Candidate') {
        return true;
      }

      return false;
    });
    this.updateInterviewVisiblity = this.moduleAccess.some((element) => {
      if (element.seekerModule === 'Updating Interview Feedback') {
        return true;
      }

      return false;
    });
    this.subRoleId = this.user?.subRoles;
    this.updateForm = new UntypedFormGroup({
      ratings: new UntypedFormControl('', Validators.required),
      feedback: new UntypedFormControl('', Validators.required),
    });
  }

  items: keyvalue[] = [
    { item: 'Written Test', value: 0, color: '#93cc65' },
    { item: 'Coding Round', value: 0, color: '#cc7a65' },
    { item: 'Technical Interview', value: 0, color: '#00FFFF' },
    { item: 'HR Interview', value: 0, color: '#bf84ee' },
    { item: 'Hiring Manager Review', value: 0, color: '#df5bab' },
    { item: 'Behavioral Assesment', value: 0, color: '#5cc0a2' },
    { item: 'Bar Raiser', value: 0, color: '#4885ed' },
  ];

  getQueryParams(): void {
    this.activatedRoute.params
      .pipe(
        filter((param: Params) => !!param),
        first()
      )
      .subscribe((param: Params) => {
        this.jobId = param.jobId;
        // this.skillOwnerId=param.skillOwnerId
        this.getCandidateItems(this.jobId);
      });
  }
  edit() {
    this.show = false;
  }
  icon() {
    this.show = true;
  }
  sliders: SliderDetails[] = [];

  sliderEvent(list): void {}

  feedback(){
    this.skillseekerdashboardService.feedback().subscribe((res)=>{
      this.rating_Value = res;
    })
  }

  getCandidateItems(jobId: string): void {
    this.isLoading = true;
    this.skillseekerdashboardService.getCandidateItems(jobId).subscribe(
      (res) => {
        this.isLoading = false;
        this.candidateItemList = res;
        for (let i = 0; i < this.candidateItemList.length; i++) {
          this.skillOwnerid = this.candidateItemList[i]?.skillOwnerId;
        }

        for (let i = 0; i < this.candidateItemList.length; i++) {
          this.skillseekerdashboardService.downloadImage(this.candidateItemList[i]?.skillOwnerId).subscribe(
            (res) => {
              this.candidateItemList[i]['image'] = this.soImgUrl + this.candidateItemList[i]?.skillOwnerId;
            },
            (err) => {
              if (err.status == 200) {
                this.candidateItemList[i]['image'] = this.soImgUrl + this.candidateItemList[i]?.skillOwnerId;
              } else {
                this.candidateItemList[i]['image'] = `assets/images/avatar-default-skillowner.png`;
              }
            }
          );
        }
        this.jobTitle = res[0].jobTitle;
      },
      (err) => {
        this.router.navigate(['/ssdashboard']);
      }
    );
  }

  sliderOptions(slider: SliderDetails, i): Options {
    if (slider?.requirementPhaseList[slider?.currentStage - 1]?.status == 'Not Cleared')
      return {
        floor: 6,
        ceil: 5,
        disabled: true,
        showTicksValues: slider.showTicksValues,
        showSelectionBarEnd: true,
        showSelectionBar: true,
        stepsArray: slider.requirementPhaseList.map((val) => {
          return { value: val.stage, legend: val.requirementPhaseName };
        }),
        getPointerColor: (value: any): string => {
          if (value > 1) {
            this.isLocked = false;
            this.cdr.detectChanges();
          }
          if (slider.requirementPhaseList[slider.currentStage - 1].status == 'Not Cleared') {
            this.isLocked = false;
            this.cdr.detectChanges();
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
    else {
      return {
        floor: 6,
        ceil: 5,
        disabled: true,
        showTicksValues: slider.showTicksValues,
        showSelectionBar: slider.showSelectionBar,
        stepsArray: slider.requirementPhaseList.map((val) => {
          return { value: val.stage, legend: val.requirementPhaseName };
        }),
        getPointerColor: (value: any): string => {
          if (value > 1) {
            this.isLocked = false;
            this.cdr.detectChanges();
          }
          if (slider.requirementPhaseList[slider.currentStage - 1].status == 'Not Cleared') {
            return 'red';
          }
          if (slider.accepted === true && slider.currentStage === 1 && slider.requirementPhaseList[slider.currentStage - 1].interviewedBy !== null) {
            this.isLocked = false;
            this.cdr.detectChanges();
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

  closeBar(): void {
    this.toggleSideBar = false;
  }

  onSelect(list): void {
    this.toggleSideBar = true;
    this.formDisplay = true;
    this.skillOwnerId = list.skillOwnerId;
    this.skillOwnerName = list.skillOwnerName;
    this.skillOwnerExperience = list.experience;
    this.cdr.markForCheck();
  }

  onSelect2(list): void {
    this.formDisplay = false;
    this.toggleSideBar = true;
    this.skillOwnerId = list.skillOwnerId;
    this.skillOwnerName = list.skillOwnerName;
    this.skillOwnerExperience = list.experience;
    this.cdr.markForCheck();
  }

  onSow(list): void {
    this.router.navigate([`/ssdashboard/sow/skillowner`], { queryParams: { jobId: list.jobId, skillOwnerId: list.skillOwnerId } });
  }

  onMsa(list): void {
    this.router.navigate([`/ssdashboard/createagree`], { queryParams: { jobId: list.jobId, skillOwnerId: list.skillOwnerId } });
  }

  onPow(list): void {
    this.router.navigate([`/ssdashboard/po-process/skillowner`], { queryParams: { jobId: list.jobId, skillOwnerId: list.skillOwnerId } });
  }

  onSelectedRound(list) {
    this.savedjobId = list.jobId;
    this.savedskillOwnerId = list.skillOwnerId;
    this.savedstage = list.currentStage;
    this.savedrequirementPhaseName = list.requirementPhaseList[list.currentStage - 1].requirementPhaseName;
    this.prevSavedrequirementPhaseName = list.requirementPhaseList[list.currentStage].requirementPhaseName;
    this.dateOfInterview = list?.requirementPhaseList[list.currentStage - 1].dateOfInterview;
    this.endTimeOfInterview = list?.requirementPhaseList[list.currentStage - 1].endTimeOfInterview;
  }

  onFinal() {
    var today = new Date();
    let date2 = this.dateOfInterview + ',' + this.endTimeOfInterview;
    if (this.dateOfInterview) {
      if (this.datePipe.transform(date2, 'yyyy-MM-dd, h:mm:ss a') >= this.datePipe.transform(today, 'yyyy-MM-dd, h:mm:ss a')) {
        this.isLoading = false;
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: `The date ${this.datePipe.transform(date2, 'M/d/yy, hh:mm a')} for the Round - ${
            this.savedrequirementPhaseName
          }. Please make sure its greater than ${this.datePipe.transform(today, 'M/d/yy, h:mm a')}.`,
          showConfirmButton: true,
        });
        return;
      }
    }

    let req = {
      jobId: this.savedjobId ?? null,
      skillOwnerId: this.savedskillOwnerId ?? null,
      stage: this.savedstage ?? null,
      candidatePercentage:{
        id:this.updateForm.value.ratings.id
      },
      feedback: this.updateForm.get('feedback').value,
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
        this.skillseekerdashboardService.selectedForRound(this.savedjobId, this.savedskillOwnerId, this.savedstage).subscribe(
          (res) => {
            this.isLoading = false;
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: `Cleared ${this.savedrequirementPhaseName} successfully.`,
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

  onSelected(list) {
    var today = new Date();
    let date2 =
      list?.requirementPhaseList[list.currentStage - 1].dateOfInterview + ',' + list?.requirementPhaseList[list.currentStage - 1].endTimeOfInterview;
    if (list?.requirementPhaseList[list.currentStage - 1].dateOfInterview) {
      if (this.datePipe.transform(date2, 'yyyy-MM-dd, h:mm:ss a') >= this.datePipe.transform(today, 'yyyy-MM-dd, h:mm:ss a')) {
        this.isLoading = false;
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: `The date ${this.datePipe.transform(date2, 'M/d/yy, hh:mm a')} is for the Round - ${
            list.requirementPhaseList[list.currentStage - 1].requirementPhaseName
          }. Please make sure its greater than ${this.datePipe.transform(today, 'M/d/yy, h:mm a')}.`,
          showConfirmButton: true,
        });
        return;
      }
    }

    this.skillseekerdashboardService.selectedForRound(list.jobId, list.skillOwnerId, list.currentStage).subscribe(
      (res) => {
        this.isLoading = false;
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `Cleared ${list.requirementPhaseList[list.currentStage - 1].requirementPhaseName} successfully`,
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

  onSelected2(list) {
    var today = new Date();
    let date2 =
      list?.requirementPhaseList[list.currentStage - 1].dateOfInterview + ',' + list?.requirementPhaseList[list.currentStage - 1].endTimeOfInterview;
    if (list?.requirementPhaseList[list.currentStage - 1].dateOfInterview) {
      if (this.datePipe.transform(date2, 'yyyy-MM-dd, h:mm:ss a') >= this.datePipe.transform(today, 'yyyy-MM-dd, h:mm:ss a')) {
        this.isLoading = false;
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: `The date ${this.datePipe.transform(date2, 'M/d/yy, hh:mm a')} is for the Round - ${
            list.requirementPhaseList[list.currentStage - 1].requirementPhaseName
          }. Please make sure its greater than ${this.datePipe.transform(today, 'M/d/yy, h:mm a')}.`,
          showConfirmButton: true,
        });
        return;
      }
    }

    this.skillseekerdashboardService.selectedForRound(list.jobId, list.skillOwnerId, list.currentStage - 1).subscribe(
      (res) => {
        this.isLoading = false;
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `Resheduled ${list.requirementPhaseList[list.currentStage - 1].requirementPhaseName} successfully`,
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

  onFinal2() {
    var today = new Date();
    let date2 = this.dateOfInterview + ',' + this.endTimeOfInterview;
    if (this.dateOfInterview) {
      if (this.datePipe.transform(date2, 'yyyy-MM-dd, h:mm:ss a') >= this.datePipe.transform(today, 'yyyy-MM-dd, h:mm:ss a')) {
        this.isLoading = false;
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: `The date ${this.datePipe.transform(date2, 'M/d/yy, hh:mm a')} is for the Round - ${
            this.savedrequirementPhaseName
          }. Please make sure its greater than ${this.datePipe.transform(today, 'M/d/yy, h:mm a')}.`,
          showConfirmButton: true,
        });
        return;
      }
    }
    this.skillseekerdashboardService.selectedForRound(this.savedjobId, this.savedskillOwnerId, this.savedstage).subscribe(
      (res) => {
        this.isLoading = false;
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: `Cleared ${this.savedrequirementPhaseName} successfully`,
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

  onReject(list): void {
    this.isLoading = true;
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Reject it!',
    }).then((result) => {
      if (result.isConfirmed) {
        var req = {
          jobId: list.jobId,
          skillOwnerId: list.skillOwnerId,
          stage: list.currentStage,
        };

        this.skillseekerdashboardService.rejectCandidate(req).subscribe(
          (res) => {
            this.isLoading = false;
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Candidate is Rejected',
              showConfirmButton: false,
              timer: 1500,
            });
            window.location.reload();
          },
          (error) => {
            this.isLoading = false;
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
      this.isLoading = false;
    });
  }

  onReIntiate(list): void {
    this.isLoading = true;
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, ReInitiate it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;

        this.skillseekerdashboardService.reInitiateHiring(list.jobId, list.skillOwnerId).subscribe(
          (res) => {
            this.isLoading = false;
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'reintiated',
              showConfirmButton: false,
              timer: 1500,
            });
            window.location.reload();
          },
          (error) => {
            this.isLoading = false;
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
      this.isLoading = false;
    });
  }
}

interface keyvalue {
  item: string;
  value: number;
  color: any;
}
