import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, first } from 'rxjs';
import { phoneRegex } from 'src/app/core/Constants/constant';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-registration-skillowner',
  templateUrl: './registration-skillowner.component.html',
  styleUrls: ['./registration-skillowner.component.scss'],
  providers: [DatePipe],
})
export class RegistrationSkillownerComponent implements OnInit {
  form: UntypedFormGroup;
  token_value: string;
  accountStatus: boolean;
  today = new Date();

  constructor(
    private readonly authenticationService: AuthenticationService,
    private router: Router,
    private datePipe: DatePipe,
    private readonly route: ActivatedRoute
  ) {
    this.form = new UntypedFormGroup({
      firstName: new UntypedFormControl('', [Validators.required]),
      lastName: new UntypedFormControl('', [Validators.required]),
      dob: new UntypedFormControl('', [Validators.required]),
      email: new UntypedFormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      phone: new UntypedFormControl('', [Validators.required, Validators.pattern(phoneRegex)]),
    });
  }
  disableDate() {
    return false;
  }
  get email() {
    return this.form.get('email');
  }

  get phone() {
    return this.form.get('phone');
  }

  get firstName() {
    return this.form.get('firstName');
  }

  get lastName() {
    return this.form.get('lastName');
  }

  get dob() {
    return this.form.get('dob');
  }

  ngOnInit(): void {
    this.today.setFullYear(this.today.getFullYear() - 18);
    this.route.queryParams
      .pipe(
        filter((e) => !!e && !!e?.verificationToken),
        first()
      )
      .subscribe((e) => {
        this.authenticationService.verifyRegistrationForOwner(e?.verificationToken).subscribe((data) => {
          this.token_value = e?.verificationToken;
          this.form?.patchValue({
            firstName: data?.firstName ?? null,
            lastName: data?.lastName ?? null,
            dob: this.datePipe.transform(data?.dob, 'MM-dd-YYYY') ?? null,
            email: data?.primaryEmail ?? null,
            phone: data?.phoneNumber ?? null,
          });
          this.form?.updateValueAndValidity();
          localStorage.setItem('emailId', this.form.get('email').value);
        });
      });
  }
  submit() {
    if (!this.form.valid) return;
    var request = {
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      emailId: this.form.value.email,
      dob: this.form.value.dob,
      primaryEmail: this.form.value.primaryEmail,
      phoneNumber: this.form.value.phoneNumber,
      token: this.token_value,
    };

    this.authenticationService.verifyCandidate(request).subscribe(
      (data) => {
        this.router.navigate(['/activation/skillowner/set-password/', this.token_value]);
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
