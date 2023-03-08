import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { emailRegex, phoneRegex } from 'src/app/core/Constants/constant';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../authentication.service';

interface Country {
  shortName: string;
  name: string;
}

@Component({
  selector: 'app-registration-skillpartner',
  templateUrl: './registration-skillpartner.component.html',
  styleUrls: ['./registration-skillpartner.component.scss'],
})
export class RegistrationSkillpartnerComponent implements OnInit {
  @ViewChild('skillsSetRef', { static: false }) skillsSetRefElement: ElementRef;
  step: number = 11;

  form: UntypedFormGroup;
  emailIdname: any;
  skills: string[] = [];
  fixedskills: string[] = [];
  extraskills: string[] = [];
  skillSetValue: string[] = [];
  countries: Country[];
  states: string[];
  cities: string[];
  selected = 'US';
  select = 'Select State';
  selectcity = 'Select city';
  selectedstrength: any;
  skillsSet: any;
  stateList: any;
  cityList: any;
  strengthList: any;
  domainList: any;
  TechnologyList: any;
  array = [];
  username: any;
  formForm: any;
  isLoading = false;
  userData: any[] = [];
  userList1: any[] = [];
  lastkeydown1: number = 0;
  subscription: any;
  dummyArray: any[] = [];
  activeButton3: any;
  registrationId:number;

  constructor(private service: AuthenticationService, private readonly authnticationService: AuthenticationService, private router: Router) {
    this.formForm = new UntypedFormGroup({
      email: new UntypedFormControl('', [Validators.required, Validators.email, Validators.pattern(emailRegex)]),
      phone: new UntypedFormControl('', [Validators.required, Validators.pattern(phoneRegex)]),
      businessName: new UntypedFormControl('', [Validators.required]),
      businessNumber: new UntypedFormControl('', [Validators.required]),
      firstName: new UntypedFormControl('', [Validators.required]),
      lastName: new UntypedFormControl('', [Validators.required]),
      state: new UntypedFormControl('', [Validators.required]),
      city: new UntypedFormControl('', [Validators.required]),
      range: new UntypedFormControl('', [Validators.required]),

      acceptTerms: new UntypedFormControl(false, [Validators.requiredTrue]),
    });
  }
  get email() {
    return this.formForm.get('email');
  }

  get range() {
    return this.formForm.get('range');
  }

  get phone() {
    return this.formForm.get('phone');
  }

  get firstName() {
    return this.formForm.get('firstName');
  }

  get lastName() {
    return this.formForm.get('lastName');
  }

  get businessName() {
    return this.formForm.get('businessName');
  }

  get businessNumber() {
    return this.formForm.get('businessNumber');
  }

  get acceptTerms() {
    return this.formForm.get('acceptTerms');
  }
  get stateValue() {
    return this.formForm.get('state');
  }

  get cityValue() {
    return this.formForm.get('city');
  }

  ngOnInit(): void {
    this.getStateList();
    this.getStengthList();
    this.getDomainList();
    this.getTechnologyList();
    this.getCityList();

    this.authnticationService.getTechnologyList().subscribe((response) => {
      this.TechnologyList = response;
      for (let i = 0; i < this.TechnologyList.length; i++) {
        this.dummyArray.push(this.TechnologyList[i].technologyValues);
      }
      Object.assign(this.userData, this.dummyArray);
    });
  }
  onSkillsSetKeydown() {
    if (this.skillsSet && this.skillsSet.trim() != '') {
      if (this.skills.indexOf(this.skillsSet) !== -1 || this.skills.indexOf(this.capitalizeFirstLetter(this.skillsSet)) !== -1) {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Value Already exist',
          showConfirmButton: false,
          timer: 1500,
        });
        this.skillsSet = '';
      } else {
        if (this.dummyArray.indexOf(this.skillsSet) !== -1) {
          this.skills.push(this.skillsSet);
          this.fixedskills.push(this.skillsSet);

          this.skillsSet = '';
        } else {
          this.extraskills.push(this.skillsSet);
          this.skills.push(this.skillsSet);
          this.skillsSet = '';
        }
      }
    }
  }

  change(item) {
    if (this.skills.indexOf(item) !== -1) {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Value Already exist',
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      if (this.dummyArray.indexOf(item) !== -1) {
        this.fixedskills.push(this.skillsSet);
        this.skills.push(item);
      }
    }
    this.skillsSet = '';
  }

  skillsSetFocus() {
    this.skillsSetRefElement.nativeElement.focus();
  }

  dropSkill(index: any, skill) {
    this.skills.splice(index, 1);
    if (this.extraskills.includes(skill)) {
      this.extraskills.splice(this.extraskills.indexOf(skill), 1);
    }
    if (this.fixedskills.includes(skill)) {
      this.fixedskills.splice(this.fixedskills.indexOf(skill), 1);
    }
  }

  next(i): void {
    this.step = i;
  }

  back(i): void {
    this.step = i;
  }

  getDomain(x): void {
    this.form.get('domain').patchValue(x);
  }

  getStateList(): void {
    this.authnticationService.getState().subscribe((response) => {
      this.stateList = response;
    });
  }
  getCityList(): void {
    if(this.stateValue.value){
      this.next(12);
    }
    var queryParams = new HttpParams();
    queryParams = queryParams.append('states', this.stateValue.value);
    if (this.stateValue.value) {
      this.authnticationService.getCityList(this.stateValue.value).subscribe((response) => {
        this.cityList = response;
        this.formForm.get('city').setValue('');
      });
    }
  }
  getStengthList(): void {
    this.authnticationService.getStengthList().subscribe((response) => {
      this.strengthList = response;
    });
  }

  getDomainList(): void {
    this.authnticationService.getDomainList().subscribe((response) => {
      this.domainList = response;
    });
  }

  getTechnologyList(): void {
    this.authnticationService.getTechnologyList().subscribe((response) => {
      this.TechnologyList = response;
    });
  }

  getUserIdsFirstWay($event) {
    let userId = (<HTMLInputElement>document.getElementById('userIdFirstWay')).value;
    this.userList1 = [];

    if (userId.length > 0) {
      if ($event.timeStamp - this.lastkeydown1 > 200) {
        this.userList1 = this.searchFromArray(this.userData, this.capitalizeFirstLetter(userId));
      }
    }
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  searchFromArray(arr, regex) {
    let matches = [],
      i;
    for (i = 0; i < arr.length; i++) {
      if (arr[i].match(regex)) {
        matches.push(arr[i]);
      }
    }
    return matches;
  }

  submit(): void {
    this.isLoading = true;
    this.getTechnologyList();
    var newMyObj = this.TechnologyList.reduce(function (result, currentObject) {
      result[currentObject.technologyValues] = currentObject.technologyId;
      return result;
    }, {});

    this.array = this.fixedskills.map(function (technologyValues) {
      return newMyObj[technologyValues];
    });

    var request = {
      roles: {
        rolesId: 2,
      },
      firstName: this.formForm.value.firstName,
      emailId: this.formForm.value.email,
      businessName: this.formForm.value.businessName,
      lastName: this.formForm.value.lastName,
      taxIdBusinessLicense: this.formForm.value.businessNumber,
      contactPhone: this.formForm.value.phone,
      city: this.formForm.value.city,
      state: this.formForm.value.state,
      workForceStrength: {
        id: this.selectedstrength,
      },
      technologyIds: this.array.toString(),
      customTech: this.extraskills.toString(),
    };
    this.authnticationService.register(request).subscribe(
      (data) => {
        console.log(data);
      this.registrationId=data.id
        this.isLoading = false;
        this.next(18);
      },
      (error) => {
        this.isLoading = false;
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: error,
          showConfirmButton: true,
          timer: 3000,
        });
      }
    );
  }

  keyPressNumbers(event) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  onOptionsSelected(value: string) {
    this.next(11);
  }

  strength1(x: any) {
    this.selectedstrength = x;
  }

  isActive3(buttonName) {
    return this.selectedstrength === buttonName;
  }

  Resend(){
    var req={
      id: this.registrationId
    }

    this.authnticationService.resendMail(req).subscribe((res)=>{
        setTimeout(() => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Email resended successfully',
        showConfirmButton: false,
        timer: 1500,
      })
    },3000);
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
    )
  }
}
