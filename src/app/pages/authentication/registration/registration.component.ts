import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Registration } from 'src/app/api/flexcub-api/models';
import { phoneRegex } from 'src/app/core/Constants/constant';
import { Role } from 'src/app/core/models';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../authentication.service';

interface Country {
  shortName: string;
  name: string;
}

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  @ViewChild('skillsSetRef', { static: false }) skillsSetRefElement: ElementRef;
  step: number = 1;
  form: UntypedFormGroup;
  user: Registration;
  isLoading = true;
  skills: string[] = [];
  countries: Country[];
  states: string[];
  cities: string[];
  selected = 'US';
  select = 'Select State';
  selectcity = 'Select city';
  skillsSet: any;
  stateList: any;
  cityList: any;
  strengthList: any;
  domainList: any;
  TechnologyList: any;
  country = new UntypedFormControl(null, [Validators.required]);
  state = new UntypedFormControl({ value: null, disabled: true }, [Validators.required]);
  city = new UntypedFormControl({ value: null, disabled: true }, [Validators.required]);
  role = new UntypedFormControl('', [Validators.required]);
  domain = new UntypedFormControl('', [Validators.required]);
  formForm: any;

  constructor(
    private service: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute,
    private readonly authnticationService: AuthenticationService,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
    this.countries = this.service.getCountries();
    this.form = new UntypedFormGroup({
      country: this.country,
      state: this.state,
      city: this.city,
      role: this.role,
      domain: this.domain,
    });

    this.formForm = new UntypedFormGroup({
      email: new UntypedFormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      email1: new UntypedFormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      phone: new UntypedFormControl('', [Validators.required, Validators.pattern(phoneRegex)]),
      phone1: new UntypedFormControl('', [Validators.required, Validators.pattern(phoneRegex)]),
      businessName: new UntypedFormControl('', [Validators.required]),
      businessName1: new UntypedFormControl('', [Validators.required]),
      businessNumber: new UntypedFormControl('', [Validators.required]),
      businessNumber1: new UntypedFormControl('', [Validators.required]),
      firstName: new UntypedFormControl('', [Validators.required]),
      firstName1: new UntypedFormControl('', [Validators.required]),
      lastName: new UntypedFormControl('', [Validators.required]),
      lastName1: new UntypedFormControl('', [Validators.required]),
      strength: new UntypedFormControl('', [Validators.required]),
      skillsets: new UntypedFormControl('', [Validators.required]),
      state: new UntypedFormControl('', [Validators.required]),
      city: new UntypedFormControl('', [Validators.required]),
      role: new UntypedFormControl('', [Validators.required]),
      domain: new UntypedFormControl('', [Validators.required]),
    });
  }

  get email() {
    return this.formForm.get('email');
  }
  get email1() {
    return this.formForm.get('email1');
  }

  get phone() {
    return this.formForm.get('phone');
  }

  get phone1() {
    return this.formForm.get('phone1');
  }

  get firstName() {
    return this.formForm.get('firstName');
  }

  get firstName1() {
    return this.formForm.get('firstName1');
  }

  get lastName() {
    return this.formForm.get('lastName');
  }

  get lastName1() {
    return this.formForm.get('lastName1');
  }

  get businessName() {
    return this.formForm.get('businessName');
  }

  get businessNumber() {
    return this.formForm.get('businessNumber');
  }

  get businessNumber1() {
    return this.formForm.get('businessNumber1');
  }

  get businessName1() {
    return this.formForm.get('businessName1');
  }

  ngOnInit(): void {
    if (this.user && this.user.roles.roleDescription === Role.Partner) {
      const returnUrl = this.route.snapshot.queryParams['/spdashboard'] || '/spdashboard';
      this.router.navigateByUrl(returnUrl);
    } else if (this.user && this.user.roles.roleDescription === Role.Seeker) {
      const returnUrl = this.route.snapshot.queryParams['/ssdashboard'] || '/ssdashboard';
      this.router.navigateByUrl(returnUrl);
    } else if (this.user && this.user.roles.roleDescription === Role.Owner) {
      const returnUrl = this.route.snapshot.queryParams['/sodashboard'] || '/sodashboard';
      this.router.navigateByUrl(returnUrl);
    } else if (this.user && this.user.roles.roleDescription === Role.SsAdmin) {
      const returnUrl = this.route.snapshot.queryParams['/superadmin'] || '/superadmin';
      this.router.navigateByUrl(returnUrl);
    } else if (this.user && this.user.roles.roleDescription === Role.SuperAdmin) {
      const returnUrl = this.route.snapshot.queryParams['/superadmin'] || '/superadmin';
      this.router.navigateByUrl(returnUrl);
    } else {
      this.isLoading = false;
    }
    this.country.valueChanges.subscribe((country) => {
      this.state.reset();
      this.state.disable();
      if (country) {
        this.states = this.service.getStatesByCountry(country);
        this.state.enable();
      }
    });

    this.state.valueChanges.subscribe((state) => {
      this.city.reset();
      this.city.disable();
      if (state) {
        this.cities = this.service.getCitiesByState(this.country.value, state);
        this.city.enable();
      }
    });
    this.getStateList();
    this.getStengthList();
    this.getDomainList();
    this.getTechnologyList();
    this.getCityList();

    this.authnticationService.getTechnologyList().subscribe((response) => {
      this.TechnologyList = response;
      for (let i = 0; i < 10; i++) {
        this.skills.push(this.TechnologyList[i].technology_values);
      }
    });
  }
  onSkillsSetKeydown() {
    if (this.skillsSet == '' || this.skillsSet == null) return;
    this.skills.push(this.skillsSet);
    this.skillsSet = '';
  }

  skillsSetFocus() {
    this.skillsSetRefElement.nativeElement.focus();
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

  skillseeker(): void {
    this.form.get('role').patchValue('skillSeeker');
  }

  skillpartner(): void {
    this.form.get('role').patchValue('skillPartner');
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
    var queryParams = new HttpParams();
    queryParams = queryParams.append('states', this.select);
    if (this.select) {
      this.authnticationService.getCityList(this.select).subscribe((response) => {
        this.cityList = response;
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

  submit(): void {
    var request = {
      roles: {
        rolesId: this.form.get('role').value === 'Skill Seeker' ? 1 : 2,
        roleDescription: this.form.get('role').value,
      },
      firstName: this.formForm.value.firstName,
      emailId: this.formForm.value.email,
      businessName: this.formForm.value.businessName,
      lastName: this.formForm.value.lastName,
      taxIdBusinessLicense: this.formForm.value.businessNumber,
      contactPhone: this.formForm.value.phone,
    };
    this.authnticationService.register(request).subscribe(
      (data) => {
        if (data) {
          this.router.navigate(['/activation']);
        }
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

  onOptionsSelected(value: string) {
    this.next(3);
  }
}
