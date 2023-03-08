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
  selector: 'app-registration-skillseeker',
  templateUrl: './registration-skillseeker.component.html',
  styleUrls: ['./registration-skillseeker.component.scss'],
})
export class RegistrationSkillseekerComponent implements OnInit {
  @ViewChild('skillsSetRef', { static: false }) skillsSetRefElement: ElementRef;
  step: number = 2;

  form: UntypedFormGroup;
  emailIdName: any;
  skills: string[] = [];
  countries: Country[];
  states: string[];
  cities: string[];
  selected = 'US';
  skillsSet: any;
  stateList: any;
  cityList: any;
  strengthList: any;
  domainList: any;
  TechnologyList: any;
  isLoading: boolean = false;
  formForm: any;
  registrationId:number;

  constructor(private service: AuthenticationService, private readonly authnticationService: AuthenticationService, private router: Router) {
    this.countries = this.service.getCountries();

    this.formForm = new UntypedFormGroup({
      email: new UntypedFormControl('', [Validators.required, Validators.email, Validators.pattern(emailRegex)]),
      phone: new UntypedFormControl('', [Validators.required, Validators.pattern(phoneRegex)]),
      businessName: new UntypedFormControl('', [Validators.required]),
      businessNumber: new UntypedFormControl('', [Validators.required]),
      firstName: new UntypedFormControl('', [Validators.required]),
      lastName: new UntypedFormControl('', [Validators.required]),
      state: new UntypedFormControl('', [Validators.required]),
      city: new UntypedFormControl('', [Validators.required]),
      domain: new UntypedFormControl('', [Validators.required]),
      acceptTerms: new UntypedFormControl(false, [Validators.requiredTrue]),
    });
  }

  get email() {
    return this.formForm.get('email');
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

  get domain() {
    return this.formForm.get('domain');
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

    this.getDomainList();
    this.getTechnologyList();
    this.getCityList();
  }

  dropSkill(index: any) {
    this.skills.splice(index, 1);
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
      this.next(4);
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


  submit(): void {
    if (!this.formForm.valid) return;
    this.isLoading = true;

    var request = {
      roles: {
        rolesId: 1,
      },
      firstName: this.formForm.value.firstName,
      emailId: this.formForm.value.email,
      businessName: this.formForm.value.businessName,
      lastName: this.formForm.value.lastName,
      taxIdBusinessLicense: this.formForm.value.businessNumber,
      contactPhone: this.formForm.value.phone,
      city: this.formForm.value.city,
      state: this.formForm.value.state,
      domainId: this.formForm.value.domain,
    };
    this.authnticationService.register(request).subscribe(
      (data) => {
        this.isLoading = false;
        console.log(data);
      this.registrationId=data.id


        this.next(8);
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
}
