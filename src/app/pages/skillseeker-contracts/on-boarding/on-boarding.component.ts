import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Registration } from 'src/app/api/flexcub-api/models';
import { AppService } from 'src/app/app.service';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../authentication/authentication.service';
import { skillseekerdashboardService } from '../../skillseeker-dashboard/skillseeker-dashboard.service';
import { SkillseekerContractsService } from '../skillseeker-contracts.service';

@Component({
  selector: 'app-on-boarding',
  templateUrl: './on-boarding.component.html',
  styleUrls: ['./on-boarding.component.scss'],
  providers: [DatePipe],
})
export class OnBoardingComponent implements OnInit {
  dateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const start = control.get('startDate');
    const end = control.get('endDate');
    return start.value !== null &&
      end.value !== null &&
      this.datePipe.transform(start.value, 'yyyy-MM-dd') < this.datePipe.transform(end.value, 'yyyy-MM-dd')
      ? null
      : { dateValid: true };
  };

  today = new Date();
  disabledDates: any;
  listOfStatus = ['On-Boarded', 'Active', 'In-Active', 'On-Hold'];

  onBoardingForm = new UntypedFormGroup(
    {
      projectName: new UntypedFormControl({ value: '', disabled: true }, Validators.required),
      startDate: new UntypedFormControl(null, Validators.required),
      endDate: new UntypedFormControl(null, Validators.required),
      status: new UntypedFormControl('', Validators.required),
      name: new UntypedFormControl({ value: '', disabled: true }),
    },
    { validators: this.dateValidator }
  );
  user?: Registration;
  seekerId: Number;
  contractDetails: any;
  isLoading: boolean;
  departments = [];
  onBoardDetails: any;
  currentId: any;

  constructor(
    private skillseekerDashboard: skillseekerdashboardService,
    private skillseekerContractsService: SkillseekerContractsService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private readonly _appService: AppService,
    private datePipe: DatePipe
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }

  ngOnInit(): void {
    this.seekerId = this.user?.id;
    this.currentId = this.activatedRoute.snapshot.params['id'];
    this.getContractDetails(this.seekerId);
  }

  handler() {
    var date = new Date(this.onBoardingForm.get('startDate').value);

    date.setDate(date.getDate() + 1);
    this.disabledDates = date;
  }
  getContractDetails(id) {
    this.skillseekerContractsService.getContractDetails(id).subscribe(
      (res) => {
        this.contractDetails = res;

        this.onBoardDetails = this.contractDetails.filter((c) => {
          if (c != null) {
            return c.ownerId == this.currentId;
          }
        })[0];

        this.onBoardingForm.patchValue({
          status: this.onBoardDetails.status,
          projectName: this.onBoardDetails.projectName,
          name: this.onBoardDetails.name,
          startDate: this.datePipe.transform(this.onBoardDetails.contractDurationStartDate, 'MM-dd-YYYY'),
          endDate: this.datePipe.transform(this.onBoardDetails.contractDurationEndDate, 'MM-dd-YYYY'),
        });

        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }
  onBoardingSubmit() {
    if (this.onBoardingForm.invalid) {
      return false;
    }
    let reqData = this.onBoardingForm.getRawValue();
    reqData.seekerId = this.onBoardDetails.seekerId;
    reqData.skillOwnerEntityId = this.currentId;
    reqData.projectId = this.onBoardDetails.projectId;
    reqData.startDate = this._appService.convertTime(reqData?.startDate);
    reqData.endDate = this._appService.convertTime(reqData?.endDate);

    this.skillseekerContractsService.onBoarding(reqData).subscribe(
      (res) => {
        this.router.navigate(['/ssContracts/list']).then(() => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Details updated successfully',
            showConfirmButton: false,
            timer: 1500,
          });
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
