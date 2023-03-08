import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Registration } from 'src/app/api/flexcub-api/models/registration';
import { emailRegex } from 'src/app/core/Constants/constant';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-login-super-admin',
  templateUrl: './login-super-admin.component.html',
  styleUrls: ['./login-super-admin.component.scss'],
})
export class LoginSuperAdminComponent implements OnInit {
  form: UntypedFormGroup;
  submitted = false;
  show = true;
  fieldTextType: boolean;
  password: any;
  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: new UntypedFormControl('', [Validators.required, Validators.email, Validators.pattern(emailRegex)]),
      password: ['', [Validators.required]],
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
        if (response.roles.rolesId == 4) {
          const returnUrl = this.route.snapshot.queryParams['/superadmin'] || '/superadmin';
          this.router.navigateByUrl(returnUrl);
        } else {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'Invalid username and Password',
            showConfirmButton: false,
            timer: 1500,
          });
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
      password: this.form.value.password,
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
