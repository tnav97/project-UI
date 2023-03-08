import { Component } from '@angular/core';

import { Options } from '@angular-slider/ngx-slider';
import { CurrencyPipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Observable } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { SkillPartner } from 'src/app/api/flexcub-api/models';
import { emailRegex, phoneRegex } from 'src/app/core/Constants/constant';
import { ICoreTechnology } from 'src/app/core/models';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../authentication/authentication.service';
import { skillseekerdashboardService } from '../../skillseeker-dashboard/skillseeker-dashboard.service';
import { SuperAdminService } from '../super-admin.service';

export interface OwnerSkillTechnologiesEntity {
  technologyValues: string;
}

export interface OwnerSkillRolesEntity {
  rolesDescription: string;
}
export interface OwnerSkillLevelEntity {
  skillLevelDescription: string;
}

export interface RateElement {
  ownerSkillTechnologiesEntity: OwnerSkillTechnologiesEntity;
  ownerSkillRolesEntity: OwnerSkillRolesEntity;
  ownerSkillLevelEntity: OwnerSkillLevelEntity;
  baseRate: number;
  maxRate: number;
  expiresOn: string;
}

var ELEMENT_DATA: RateElement[] = [];
@Component({
  selector: 'app-add-new-skill-partner',
  templateUrl: './add-new-skill-partner.component.html',
  styleUrls: ['./add-new-skill-partner.component.scss'],
})
export class AddNewSkillPartnerComponent {
  percentNumber: number = 11;
  editable: boolean = true;
  isNew: boolean = true;
  requirement!: UntypedFormArray;
  status: any = 'Active';
  activeTab: any = 'Basic';
  adminAdded: boolean = false;
  editadminAdded: boolean = true;
  clientdetails: any;
  projectdetails: any;
  form: UntypedFormGroup;
  form2 = {} as UntypedFormGroup;
  form3 = {} as UntypedFormGroup;
  requirementForm!: UntypedFormGroup;
  addCandidate!: UntypedFormGroup;
  submitted = false;
  value: number | null;
  value1: number | null;
  stateList: any[] = [];
  cityList: any[] = [];
  domainList: any;
  id: any;
  i = 0;
  remoteValue = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  travelValue = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  ownerId: any;
  options: Options = {
    floor: 0,
    step: 5,
    ceil: 100,
  };
  options1: Options = {
    floor: 0,
    step: 5,
    ceil: 100,
  };
  businessDomain: any;
  submitted1: boolean | null = null;
  submitted2: boolean | null = null;
  departmentData: any;
  technologyData: any;
  roleData: any;
  levelData: any;
  newSKillSeekarData: any;
  allData: Observable<any[]>;
  expMonth: Observable<any[]>;
  projectArray: any[] = [];
  projectArrayIndex = 0;
  editId: any;
  edit: boolean = false;
  showDataArray: any[] = [];
  showDataObjArray: any[] = [];
  dataSource: any[][] = [[], [...ELEMENT_DATA]];
  skillSeekarProjects: any[] = [];
  clientData: any[] = [];
  sssplited: any;
  editValues: any;
  editValue: any;
  technologyGroup: any[][] = [];
  initialform = {
    businessName: '',
    businessDomain: '',
    businessEmail: '',
    businessphone: '',
    addressline1: '',
    addressline2: '',
    state: '',
    city: '',
    zipcode: '',
    phone1: '',
    email: '',
    alternativephonenumber: '',
    alternativeemailaddress: '',
    status: '',
  };
  id1: any;
  Experience: any = ['0', '0+', '1+', '2+', '3+', '4+', '5+', '6+', '7+', '9+', '11+', '15+'];
  requirementRatings: any[][] = [];
  coreTechnology: ICoreTechnology[] = [];
  priority: any;
  experienceBatch = {
    fresher: [0],
    junior: ['0+', '1+', '2+'],
    mid: ['3+', '4+', '5+', '6+'],
    senior: ['7+', '8+', '9+', '11+', '15+'],
    '': [],
  };
  selectedRating: any[] = [];
  requirementProjects: any[][] = [];
  location: any[] = [];
  expireConfig: Partial<BsDatepickerConfig> = { containerClass: 'theme-dark-blue', minDate: new Date() };
  checkedvalue: boolean = false;
  checkedvalue1: boolean = false;
  checked: string = 'DISABLE';
  checked1: string = 'Not Required';

  constructor(
    private formBuilder: UntypedFormBuilder,
    private authnticationService: AuthenticationService,
    private superAdminservice: SuperAdminService,
    private newSkillService: SuperAdminService,
    private readonly activateRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly currencyPipe: CurrencyPipe,
    private readonly SkillseekerdashboardService: skillseekerdashboardService
  ) {
    this.allData = this.superAdminservice.getExpYear();
    // this.expMonth = this.getExpMonth();

    this.form = this.formBuilder.group({
      businessName: new UntypedFormControl('', [Validators.required]),
      businessDomain: new UntypedFormControl(null, [Validators.required]),
      businessEmail: new UntypedFormControl('', [Validators.required, Validators.pattern(emailRegex)]),
      businessphone: new UntypedFormControl('', [Validators.required, Validators.pattern(phoneRegex)]),
      businessNumber: new UntypedFormControl('', [Validators.required]),
      firstName: new UntypedFormControl('', [Validators.required]),
      lastName: new UntypedFormControl('', [Validators.required]),
      addressline1: new UntypedFormControl('', [Validators.required]),
      addressline2: new UntypedFormControl('', [Validators.required]),
      state: new UntypedFormControl(null, [Validators.required]),
      city: new UntypedFormControl(null, [Validators.required]),
      zipcode: new UntypedFormControl('', [Validators.required]),
      phone1: new UntypedFormControl('', [Validators.required, Validators.pattern(phoneRegex)]),
      email: new UntypedFormControl('', [Validators.required, Validators.pattern(emailRegex)]),
      alternativephonenumber: new UntypedFormControl('', [Validators.pattern(phoneRegex)]),
      alternativeemailaddress: new UntypedFormControl('', [Validators.pattern(emailRegex)]),
      status: new UntypedFormControl(null, [Validators.required]),
      servicefeepercentage: new UntypedFormControl('', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.activateRoute.queryParams.pipe(filter((param: Params) => !!param && !!param?.type)).subscribe((param: Params) => {
      this.edit = false;
      if (param?.type === 'Basic') {
        this.activeTab = 'Basic';
      }
    });
    this.newSKillSeekarData = [];
    this.getOwnerId();
    this.getQueryParams();
    // this.getCoreTechnology();
    // this.getHiringPriority();
    this.getStateList();
    this.getDomainList();
    // this.getDropDownsData();
    // this.getSuperAdminClientData();
    // this.form3 = this.formBuilder.group({
    //   requirementList: this.formBuilder.array([this.createRequirementFormGroup()]),
    // });

    // this.form2 = this.formBuilder.group({
    //   projects: this.formBuilder.array([this.createProjectFormGroup()]),
    // });
  }

  EnableDisable(event) {
    if (event.target.checked) {
      this.checkedvalue = true;
      this.checked = 'ENABLE';
    } else {
      this.checkedvalue = false;
      this.checked = 'DISABLE';
    }
  }

  required(event) {
    if (event.target.checked) {
      this.checkedvalue1 = true;
      this.checked1 = 'Required';
    } else {
      this.checkedvalue1 = false;
      this.checked1 = 'Not Required';
    }
  }

  get businessEmail() {
    return this.form.get('businessEmail');
  }

  get businessphone() {
    return this.form.get('businessphone');
  }

  getOwnerId() {
    this.authnticationService.user.subscribe((ownerId) => {
      this.ownerId = ownerId.id;
    });
  }

  get businessNumber() {
    return this.form.get('businessNumber');
  }

  get firstName() {
    return this.form.get('firstName');
  }

  get lastName() {
    return this.form.get('lastName');
  }

  get servicefeepercentage() {
    return this.form.get('servicefeepercentage');
  }
  keyPressNumbers(event) {
    var charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  getQueryParams(): void {
    this.activateRoute.queryParams
      .pipe(
        filter((param: Params) => !!param && !!param?.clientId && !!param?.type),
        first()
      )
      .subscribe((param: Params) => {
        this.editId = param?.clientId;
        this.getPartnerDetails(this.editId);
        this.isNew = param?.type === 'new';
        if (param?.type === 'preview') {
          this.editable = false;
          this.form.disable();
        } else {
          this.editable = true;
          // this.form.controls['email'].disable();
          // this.form.controls['businessNumber'].disable();
          // this.form.controls['businessName'].disable();
        }
      });
  }

  getPartnerDetails(id: number) {
    this.superAdminservice.getPartnerDetails(id).subscribe((data: SkillPartner) => {
      if (data?.primaryContactFullName) {
        var names = data?.primaryContactFullName?.split(' ');
        var firstName = names[0];
        var lastName = names[1];
      }
      this.form.get('businessName').patchValue(data.businessName);
      this.form.get('businessEmail').patchValue(data.primaryContactEmail);
      this.form.get('businessphone').patchValue(data.primaryContactPhone);
      this.form.get('firstName').patchValue(firstName);
      this.form.get('lastName').patchValue(lastName);
      this.form.get('businessNumber').patchValue(data.taxIdBusinessLicense);
      this.form.get('addressline1').patchValue(data.addressLine1);
      this.form.get('addressline2').patchValue(data.addressLine2);
      this.form.get('state').patchValue(data.state ?? null);
      this.form.get('phone1').patchValue(data.primaryContactPhone);
      this.edit = true;
      this.getCityList();
    });
  }

  // getDropDownsData() {
  //   this.newSkillService.getDepatmentData().subscribe((data) => {
  //     if (data.length) {
  //       this.departmentData = data;
  //     }
  //   });
  //   this.newSkillService.getTechnologyData().subscribe((data) => {
  //     if (data) {
  //       this.technologyData = data;
  //     }
  //   });
  //   this.newSkillService.getRoleData().subscribe((data) => {
  //     if (data.length) {
  //       this.roleData = data;
  //     }
  //   });
  //   this.newSkillService.getLeveleData().subscribe((data) => {
  //     if (data.length) {
  //       this.levelData = data;
  //     }
  //   });
  // }

  // getHiringPriority() {
  //   this.SkillseekerdashboardService.getHiringPriority().subscribe((res) => {
  //     this.priority = res;
  //   });
  // }

  // getSkillSeekarData(id: number = 411, i: number = -1): Promise<void> {
  //   return new Promise((resolve) => {
  //     this.newSkillService.getNewSkillSeekarData(id).subscribe(
  //       (data: any[]) => {
  //         data?.forEach((ele) => {
  //           ele?.skillSeekerTechnologyData?.forEach((j: any) => {
  //             j._rate = `${j?.ownerSkillTechnologiesEntity?.technologyValues} | ${j?.ownerSkillRolesEntity?.rolesDescription}
  //             ${j?.ownerSkillLevelEntity?.skillLevelDescription} | ${this.currencyPipe.transform(j?.baseRate, 'USD')}-${this.currencyPipe.transform(
  //               j?.maxRate,
  //               'USD'
  //             )}`;
  //             j._level = j?.ownerSkillLevelEntity?.skillLevelDescription;
  //           });
  //         });
  //         this.skillSeekarProjects = data;
  //         i > -1 ? (this.requirementProjects[i] = data) : null;
  //         resolve();
  //       },
  //       (error) => {
  //         i > -1 ? (this.requirementProjects[i] = []) : null;
  //         resolve();
  //       }
  //     );
  //   });
  // }

  // getCoreTechnology(): void {
  //   this.superAdminservice.getCoreTechnology().subscribe((data: ICoreTechnology[]) => {
  //     this.coreTechnology = data ?? [];
  //   });
  // }

  // getLocations(keyword: string): void {
  //   this.superAdminservice.getLocation(keyword).subscribe((response: any[]) => {
  //     this.location = response;
  //   });
  // }

  // transformPercentageBDtoUI(value: any,event:any): string {
  //   // not exist
  //   if (!value) {
  //     return parseFloat("0").toFixed(2);
  //   }
  //   // Is Null || Is undefined
  //   else if (value === null) {
  //     return parseFloat("0").toFixed(2);
  //   }
  //   // Is Undefined
  //   else if (typeof value === "undefined") {
  //     return parseFloat("0").toFixed(2);
  //   }
  //   // Is Number
  //   else if (typeof value === "number") {
  //     return parseFloat(String(value * 100)).toFixed(2);
  //   }
  //   // Is String
  //   else if (typeof value === "string") {
  //     return parseFloat(String((value as any) * 100)).toFixed(2);
  //   }
  // }

  // transformPercentageUItoBD(value: any): number {
  //   if (!value) {
  //     return 0;
  //   }

  //   return parseFloat(String(value / 100));
  // }

  updateSubmit() {
    var request1 =
      // {
      //   skillPartnerId: this.editId,
      //   // businessname:this.form.value.
      //   primaryContactFullName: this.form.value.firstName + ' ' + this.form.value.lastName,
      //   taxIdBusinessLicense: this.form.value.businessNumber,
      //   addressLine1: this.form.value.addressline1,
      //   addressLine2: this.form.value.addressline2,
      //   state: this.form.value.state,
      //   city: this.form.value.city,
      //   zipCode: this.form.value.zipcode,
      //   primaryContactPhone: this.form.value.businessphone,
      //   phone: this.form.value.phone1,
      //   email: this.form.value.email,
      //   primaryContactEmail: this.form.value.businessEmail,
      //   secondaryContactEmail: this.form.value.alternativeemailaddress,
      //   secondaryContactPhone: this.form.value.alternativephonenumber,
      //   addedByAdmin: this.editadminAdded,
      //   status: this.form.value.status,
      //   serviceFeePercentage:this.form.value.servicefeepercentage

      {
        skillPartnerId: this.editId,
        phone: this.form.value.phone1,
        primaryContactFullName: this.form.value.firstName + ' ' + this.form.value.lastName,
        primaryContactEmail: this.form.value.businessEmail,
        primaryContactPhone: this.form.value.businessphone,
        secondaryContactEmail: this.form.value.businessEmail,
        secondaryContactPhone: this.form.value.alternativephonenumber,
        taxIdBusinessLicense: this.form.value.businessNumber,
        addressLine2: this.form.value.addressline2,
        addressLine1: this.form.value.addressline1,
        state: this.form.value.state,
        zipcode: this.form.value.zipcode,
        serviceFeePercentage: this.form.value.servicefeepercentage,
      };

    this.superAdminservice.updateSkillPartnerDetails(request1).subscribe(
      (response) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Basic details updated successfully',
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

  get stateValue() {
    return this.form.get('state');
  }

  getDomainList(): void {
    this.authnticationService.getDomainList().subscribe((response) => {
      this.domainList = response;
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  get f2(): { [key: string]: AbstractControl } {
    return this.form2.controls;
  }

  get f3(): { [key: string]: AbstractControl } {
    return this.form3.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.adminAdded = true;
    if (this.form.invalid) {
      return;
    } else {
      var request = {
        skillSeekerName: this.form.value.businessName,
        ownerSkillDomainEntity: {
          domainId: this.form.value.businessDomain,
        },
        primaryContactFullName: this.form.value.firstName + ' ' + this.form.value.lastName,
        taxIdBusinessLicense: this.form.value.businessNumber,
        addressLine1: this.form.value.addressline1,
        addressLine2: this.form.value.addressline2,
        state: this.form.value.state,
        city: this.form.value.city,
        zipCode: this.form.value.zipcode,
        phone: this.form.value.phone1,
        primaryContactPhone: this.form.value.businessphone,
        email: this.form.value.email,
        primaryContactEmail: this.form.value.businessEmail,
        secondaryContactEmail: this.form.value.alternativeemailaddress,
        secondaryContactPhone: this.form.value.alternativephonenumber,
        addedByAdmin: this.adminAdded,
        status: this.form.value.status,
      };

      this.superAdminservice.addClientDetails(request).subscribe(
        (res) => {
          this.clientdetails = res;
          this.id = this.clientdetails.id;
          // this.getSkillSeekarData(this.id);
          // this.getSuperAdminClientData();
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Basic details added successfully',
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
  }

  onReset1(): void {
    this.submitted1 = false;
    this.form2.reset();
    this.technologyGroup = [];
  }

  onReset2(): void {
    this.submitted2 = false;
    this.form3.reset();
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }

  getStateList(): void {
    this.authnticationService.getState().subscribe((response) => {
      this.stateList = response;
    });
  }

  getCityList(): void {
    var queryParams = new HttpParams();
    queryParams = queryParams.append('states', this.stateValue.value);
    if (this.stateValue.value) {
      this.authnticationService.getCityList(this.stateValue.value).subscribe((response) => {
        this.cityList = response;
      });
    }
  }

  // createRequirementFormGroup(): UntypedFormGroup {
  //   const j = this.formBuilder.group({
  //     seekerclient: [null, Validators.required],
  //     projectName: [{ value: null, disabled: true }, [Validators.required]],
  //     rateCard: [{ value: null, disabled: true }, [Validators.required]],
  //     jobrequirementtitle: ['', Validators.required],
  //     experienceyear: [null, Validators.required],
  //     experiencemonth: [null, Validators.required],
  //     originalpositions: [null, Validators.required],
  //     positionsavailable: [null, Validators.required],
  //     joblocation: ['', Validators.required],
  //     reqExpireon: ['', [Validators.required]],
  //     jopDescription: [''],
  //     remote: [true],
  //     remotePercent: [10],
  //     travel: [true],
  //     travelPercent: [10],
  //     coreTechnology: [null, [Validators.required]],
  //     hiringPriority: [null, [Validators.required]],
  //     federalSecurityClearance: [false],
  //     screeningQuestions: [false],
  //     experienceSelection: [''],
  //   });
  //   j.get('seekerclient')?.valueChanges.subscribe(() => {
  //     const { value } = j;
  //     if (value?.seekerclient === null) {
  //       j.get('projectName')?.disable();
  //     } else {
  //     }
  //   });

  //   j.valueChanges.subscribe(async () => {
  //     const { value } = j;
  //     const a = parseInt(value?.originalpositions) || 0;
  //     const b = parseInt(value?.positionsavailable) || 0;
  //     const k = j.get('positionsavailable');
  //     if (value?.positionsavailable.startsWith('0')) {
  //       k?.setErrors({ minimum: true });
  //       return;
  //     }
  //     b > a ? k?.setErrors({ maximum: true }) : k.setErrors(null);
  //   });
  //   return j;
  // }

  // async seekerSelection(event: Event, i: number) {
  //   const id = (event?.target as HTMLSelectElement).value;
  //   // await this.getSkillSeekarData(id as any, i);
  //   const j = this.requirementList.controls[i] ?? null;

  //   j?.patchValue({
  //     projectName: null,
  //     rateCard: null,
  //     coreTechnology: null,
  //     experienceSelection: null,
  //   });

  //   ['rateCard', 'coreTechnology'].forEach((ele) => j?.get(ele)?.disable());

  //   this.requirementProjects[i]?.length === 0 ? j?.get('projectName')?.disable() : j?.get('projectName')?.enable();
  // }

  // projectSelection(event: Event, i: number): void {
  //   const id = (event?.target as HTMLSelectElement).value;
  //   const j = this.skillSeekarProjects.findIndex((ele) => ele?.id == id) ?? -1;
  //   this.requirementRatings[i] = this.skillSeekarProjects[j]?.skillSeekerTechnologyData ?? [];
  //   const controller = this.requirementList.controls[i];
  //   this.requirementRatings[i]?.length > 0 ? controller?.get('rateCard')?.enable() : null;
  // }

  // rateSelection(event: Event, i: number): void {
  //   const id = (event?.target as HTMLSelectElement).value;
  //   const j = this.requirementRatings[i]?.findIndex((ele) => ele?.id == id) ?? -1;

  //   const controls = this.requirementList?.controls[i] ?? null;
  //   controls?.patchValue({
  //     experienceSelection: this.requirementRatings[i][j]?._level?.toLowerCase() ?? '',
  //     coreTechnology: this.requirementRatings[i][j]?.ownerSkillTechnologiesEntity?.technologyId ?? null,
  //   });
  //   this.selectedRating[i] = this.requirementRatings[i][j] ?? null;
  // }

  // get requirementList(): UntypedFormArray {
  //   return this.form3.get('requirementList') as UntypedFormArray;
  // }

  // addRequirement(i: number): void {
  //   if (!(this.requirementList?.controls as Array<UntypedFormGroup>)?.every((ele) => ele?.valid)) return;

  //   let fg = this.createRequirementFormGroup();
  //   this.requirementList.push(fg);
  // }

  // EXP_MONTH = [
  //   { name: '0', displayName: '0' },
  //   { name: '1', displayName: '1' },
  //   { name: '2', displayName: '2' },
  //   { name: '3', displayName: '3' },
  //   { name: '4', displayName: '4' },
  //   { name: '5', displayName: '5' },
  //   { name: '6', displayName: '6' },
  //   { name: '7', displayName: '7' },
  //   { name: '8', displayName: '8' },
  //   { name: '9', displayName: '9' },
  //   { name: '10', displayName: '10' },
  //   { name: '11', displayName: '11' },
  // ];
  // getExpMonth() {
  //   return of(this.EXP_MONTH);
  // }

  // onSubmit2() {
  //   this.submitted2 = false;
  //   const c = this.selectedRating.length === 0 ? false : this.selectedRating.every((ele) => ele !== null);
  //   if (!c) return alert('Please select the valid project & rate card');

  //   if (!this.form3.valid) return;
  //   this.submitted2 = true;

  //   const j = [];
  //   const requirements = (this.form3.get('requirementList')?.value as any[]) ?? [];

  //   requirements.forEach((ele, i: number) => {
  //     for (let i = 0; i <= 11; i++) {
  //       if (ele?.experienceyear === this.Experience[i]) {
  //         i += 1;
  //         this.id1 = i;
  //       }
  //     }
  //     let c = {
  //       skillSeeker: { id: parseInt(ele?.seekerclient) },
  //       skillSeekerProjectEntity: { id: parseInt(ele?.projectName) },
  //       jobTitle: ele?.jobrequirementtitle ?? null,
  //       jobDescription: ele?.jopDescription ?? null,
  //       jobLocation: ele?.joblocation ?? null,
  //       expYears: ele?.experienceyear.replace(/[^a-zA-Z0-9 ]/g, '') ?? null,
  //       ownerSkillYearOfExperience: {
  //         id: this.id1,
  //       },
  //       status: 'New',
  //       expMonths: ele?.experiencemonth ?? null,
  //       expiryDate: ele?.reqExpireon ?? null,
  //       originalOfPositions: parseInt(ele?.originalpositions) || null,
  //       positionsAvailable: parseInt(ele?.positionsavailable) || null,
  //       remote: ele?.remotePercent || 0,
  //       travel: ele?.travelPercent || 0,
  //       baseRate: this.selectedRating[i]?.baseRate ?? null,
  //       maxRate: this.selectedRating[i]?.maxRate ?? null,
  //       federalSecurityClearance: ele?.federalSecurityClearance ?? true,
  //       screeningQuestions: ele?.screeningQuestions ?? false,
  //       hiringPriority: { id: ele?.hiringPriority ?? null },
  //       coreTechnology: ele?.coreTechnology ?? null,
  //     };
  //     j.push(c);
  //   });

  //   this.superAdminservice.insertRequirementDetailsData(j).subscribe(
  //     (response) => {
  //       Swal.fire({
  //         position: 'center',
  //         icon: 'success',
  //         title: this.isNew && this.editable ? 'Requirement Details Added Successfully' : 'Requirement Details Updated Successfully',
  //         showConfirmButton: false,
  //         timer: 1500,
  //       });
  //     },
  //     (error) => {
  //       Swal.fire({
  //         position: 'center',
  //         icon: 'error',
  //         title: error,
  //         showConfirmButton: false,
  //         timer: 1500,
  //       });
  //     }
  //   );
  // }

  // deleteRequirement(idx: number): void {
  //   const totalData = this.form3.get('requirementList') as UntypedFormArray;

  //   if (totalData.length > 1) {
  //     totalData.removeAt(idx);
  //     Swal.fire({
  //       position: 'center',
  //       icon: 'error',
  //       title: `Requirement ${idx + 1} is deleted.`,
  //       showConfirmButton: false,
  //       timer: 1500,
  //     });
  //   } else {
  //     Swal.fire({
  //       position: 'center',
  //       icon: 'error',
  //       title: 'Please provide requirement details',
  //       showConfirmButton: false,
  //       timer: 1500,
  //     });
  //   }
  // }

  // createProjectFormGroup(): UntypedFormGroup {
  //   const j = this.formBuilder.group({
  //     seekerclient: [null, Validators.required],
  //     projectdepartment: [null, Validators.required],
  //     startDate: [null, Validators.required],
  //     endDate: [null, Validators.required],
  //     projecttitle: [null, Validators.required],
  //     technology: [null],
  //     summarytext: [''],
  //     role: [null],
  //     level: [null],
  //     baserate: [null],
  //     maxrate: [null],
  //     expireon: [null],
  //     emailaddress: [null, [Validators.required, Validators.pattern(emailRegex)]],
  //     phonenumber: [null, [Validators.required, Validators.pattern(phoneRegex)]],
  //     alternativephonenumber1: ['', [Validators.pattern(phoneRegex)]],
  //     alternativeemailaddress1: ['', [Validators.pattern(emailRegex)]],
  //   });

  //   j.valueChanges.subscribe(async () => {
  //     const { value } = j;
  //     const a = parseInt(value?.baserate) || 0;
  //     const b = parseInt(value?.maxrate) || 0;
  //     const k = j.get('maxrate');
  //     a > b ? k?.setErrors({ maximum: true }) : k.setErrors(null);
  //   });

  //   return j;
  // }

  // get projects(): UntypedFormArray {
  //   return this.form2.get('projects') as UntypedFormArray;
  // }

  // addProject() {
  //   let fh = this.createProjectFormGroup();
  //   this.projects.push(fh);
  // }
  // getTechnology(id: any) {
  //   if (id) {
  //     return this.technologyData.filter((t) => t.technologyId == id)[0]['technologyValues'];
  //   } else {
  //     return '';
  //   }
  // }
  // getRole(id: any) {
  //   if (id) {
  //     return this.roleData.filter((r) => r.rolesId == id)[0]['rolesDescription'];
  //   } else {
  //     return '';
  //   }
  // }
  // getLevel(id: any) {
  //   if (id) {
  //     return this.levelData.filter((l) => l.skillSetLevelId == id)[0]['skillLevelDescription'];
  //   } else {
  //     return '';
  //   }
  // }

  // addData(i: number) {
  //   var item = {
  //     ownerSkillTechnologiesEntity: this.form2.get('projects').value[i].technology,
  //     ownerSkillRolesEntity: this.form2.get('projects').value[i].role,
  //     ownerSkillLevelEntity: this.form2.get('projects').value[i].level,
  //     baseRate: this.form2.get('projects').value[i].baserate,
  //     maxRate: this.form2.get('projects').value[i].maxrate,
  //     expiresOn: this.form2.get('projects').value[i].expireon,
  //     status: 'Active',
  //   };

  //   if (this.dataSource[i].length < 1) {
  //     this.dataSource[i].push(item);
  //     Swal.fire({
  //       position: 'center',
  //       icon: 'success',
  //       title: 'Rate Card Added Successfully',
  //       showConfirmButton: false,
  //       timer: 1000,
  //     });
  //   } else {
  //     const status = this.dataSource[i].some((item) => {
  //       let counter = 0;
  //       for (const data of this.dataSource[i]) {
  //         if (
  //           data.ownerSkillTechnologiesEntity === this.form2.get('projects').value[i].technology &&
  //           data.ownerSkillRolesEntity === this.form2.get('projects').value[i].role &&
  //           data.ownerSkillLevelEntity === this.form2.get('projects').value[i].level
  //         ) {
  //           counter += 1;
  //         }
  //       }
  //       return counter < 1;
  //     });
  //     if (status) {
  //       this.dataSource[i].push(item);
  //       Swal.fire({
  //         position: 'center',
  //         icon: 'success',
  //         title: 'Rate Card Added Successfully',
  //         showConfirmButton: false,
  //         timer: 1500,
  //       });
  //     } else {
  //       Swal.fire({
  //         position: 'center',
  //         icon: 'warning',
  //         title: 'Rate Card Already exist',
  //         showConfirmButton: false,
  //         timer: 1500,
  //       });
  //     }
  //   }
  // }

  // getSuperAdminClientData() {
  //   this.superAdminservice.getSuperAdminClients().subscribe((data) => {
  //     if (data) {
  //       this.clientData = data;
  //     }
  //   });
  // }

  // onSubmit1(): void {
  //   this.submitted1 = false;
  //   if (!this.form2?.valid) return;

  //   const j = [];

  //   const group = (this.form2.get('projects')?.value as any[]) ?? [];
  //   group.forEach((ele, i: number) => {
  //     const k = this.technologyGroup[i];
  //     let c = {
  //       skillSeeker: {
  //         id: ele?.seekerclient ?? null,
  //       },
  //       ownerSkillDomainEntity: { domainId: ele?.projectdepartment ?? null },
  //       title: ele?.projecttitle ?? null,
  //       summary: ele?.summarytext ?? null,
  //       primaryContactEmail: ele?.emailaddress ?? null,
  //       primaryContactPhone: ele?.phonenumber ?? null,
  //       secondaryContactEmail: ele?.AlternativeEmailAddress ?? null,
  //       secondaryContactPhone: ele?.alternativephonenumber1 ?? null,
  //       startDate: ele?.startDate ?? null,
  //       endDate: ele?.endDate ?? null,
  //       skillSeekerTechnologyData:
  //         k?.map((n) => {
  //           return {
  //             ownerSkillTechnologiesEntity: { technologyId: n?.technology?.technologyId ?? null },
  //             ownerSkillRolesEntity: { rolesId: n?.role?.rolesId ?? null },
  //             ownerSkillLevelEntity: { skillSetLevelId: n?.level?.skillSetLevelId ?? null },
  //             baseRate: parseFloat(n?.baserate) || null,
  //             maxRate: parseFloat(n?.maxrate) || null,
  //             expiresOn: n?.expireon ?? null,
  //             status: 'Active',
  //           };
  //         }) ?? null,
  //     };
  //     j.push(c);
  //   });

  //   this.newSkillService.addNewSkillSeekarData(j).subscribe(
  //     (data) => {
  //       this.projectdetails = data;

  //       Swal.fire({
  //         position: 'center',
  //         icon: 'success',
  //         title: this.isNew && this.editable ? 'Project Details Added Successfully' : 'Project Details Updated Successfully',
  //         showConfirmButton: false,
  //         timer: 1500,
  //       });

  //       this.onReset1();
  //       while (this.projects.length !== 0) {
  //         this.projects.removeAt(0);
  //       }
  //       this.addProject();
  //     },
  //     (error) => {
  //       Swal.fire({
  //         position: 'center',
  //         icon: 'error',
  //         title: error,
  //         showConfirmButton: false,
  //         timer: 1500,
  //       });
  //     }
  //   );
  // }

  // editSeekarData(seekarId) {
  //   this.newSkillService.getSkillSeekarDataById(411).subscribe((data) => {});
  // }

  // deleteProject(idx: number): void {
  //   const totalData = this.form2.get('projects') as UntypedFormArray;
  //   if (totalData.length > 1) {
  //     totalData.removeAt(idx);
  //     Swal.fire({
  //       position: 'center',
  //       icon: 'error',
  //       title: 'Project' + ' ' + (idx + 1) + ' ' + 'Deleted',
  //       showConfirmButton: false,
  //       timer: 1500,
  //     });
  //   } else {
  //     Swal.fire({
  //       position: 'center',
  //       icon: 'error',
  //       title: 'Please provide project details',
  //       showConfirmButton: false,
  //       timer: 1500,
  //     });
  //   }
  // }

  // technologyBuilder(project: UntypedFormGroup | AbstractControl): UntypedFormGroup {
  //   return this.formBuilder.group({
  //     technology: [project?.get('technology')?.value ?? null, Validators.compose([Validators.required])],
  //     role: [project?.get('role')?.value ?? null, Validators.compose([Validators.required])],
  //     level: [project?.get('level')?.value ?? null, Validators.compose([Validators.required])],
  //     baserate: [project?.get('baserate')?.value ?? null, Validators.compose([Validators.required])],
  //     maxrate: [project?.get('maxrate')?.value ?? null, Validators.compose([Validators.required])],
  //     expireon: [project?.get('expireon')?.value ?? null, Validators.compose([Validators.required])],
  //   });
  // }

  // addTechnology(project: UntypedFormGroup | AbstractControl, i: number): void {
  //   const reset = () => {
  //     project?.patchValue({
  //       technology: null,
  //       role: null,
  //       level: null,
  //       baserate: null,
  //       maxrate: null,
  //       expireon: null,
  //     });
  //   };

  //   const j = this.technologyBuilder(project);
  //   const { value, valid } = j;
  //   if (!valid) return;

  //   this.technologyGroup[i] ? null : (this.technologyGroup[i] = []);

  //   const k = this.technologyGroup[i].findIndex(
  //     (ele) => ele?.technology === value?.technology && ele?.role === value?.role && ele?.level === value?.level
  //   );

  //   if (k > -1) return alert('Similar kind of technology, role, and level exists in the table.');

  //   const m = {
  //     skillSeeker: { id: this.id ? this.id : 411 },
  //     status: 'Active',
  //     ...value,
  //   };

  //   this.technologyGroup[i].push(m);
  //   reset();
  // }

  // deleteTechnology(i: number, k: number): void {
  //   this.technologyGroup[i]?.splice(k, 1);
  // }

  onlyNumber(event: KeyboardEvent): void {
    const regex = /[0-9\\]/;
    const character = String.fromCharCode(event?.charCode);
    event?.keyCode !== 8 && !regex.test(character) ? event?.preventDefault() : null;
  }

  // onlyPrice(event: KeyboardEvent): void {
  //   const regex = /[0-9\\.\\]/;
  //   const character = String.fromCharCode(event?.charCode);
  //   event?.keyCode !== 8 && !regex.test(character) ? event?.preventDefault() : null;
  // }
}
