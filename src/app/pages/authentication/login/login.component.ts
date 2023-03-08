import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Registration } from 'src/app/api/flexcub-api/models';
import { emailRegex } from 'src/app/core/Constants/constant';
import { AuthenticationService } from 'src/app/pages/authentication/authentication.service';
import Swal from 'sweetalert2';
import { Role } from '../../../core/models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form: UntypedFormGroup;
  submitted = false;
  isLoading = true;
  user: Registration;
  emailId: string;
  fieldTextType: boolean;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
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
    }
    // else if (this.user && this.user.roles.roleDescription === Role.SuperAdmin) {
    //   const returnUrl = this.route.snapshot.queryParams['/superadmin'] || '/superadmin';
    //   this.router.navigateByUrl(returnUrl);
    // }
     else {
      this.isLoading = false;
    }
    this.form = this.formBuilder.group({
      email: new UntypedFormControl('', [Validators.required, Validators.email, Validators.pattern(emailRegex)]),
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    var request = {
      emailId: this.form.value.email,
      password: this.form.value.password,
    };
    this.authenticationService.login(request).subscribe(
      (response: Registration) => {
        setTimeout(() => {
          if (response.roles.rolesId == 2) {
            const returnUrl = this.route.snapshot.queryParams['/spdashboard'] || '/spdashboard';
            this.router.navigateByUrl(returnUrl);
          } else if (response.roles.rolesId == 1) {
            const returnUrl = this.route.snapshot.queryParams['/ssdashboard'] || '/ssdashboard';
            this.router.navigateByUrl(returnUrl);
          } else if (response.roles.rolesId == 3) {
            const returnUrl = this.route.snapshot.queryParams['/sodashboard'] || '/sodashboard';
            this.router.navigateByUrl(returnUrl);
          } else {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Invalid username and password',
              showConfirmButton: false,
              timer: 1500,
            });
          }
        }, 1);
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

  Forgot(): void {
    if (this.form.value.email == '') {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Please provide a email address',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    var request = {
      emailId: this.form.value.email,
    };
    this.authenticationService.setForgotPassword(request.emailId).subscribe(
      (data) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Email has been sent successfully',
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
