import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChangePasswordDto } from 'src/app/api/flexcub-api/models/change-password-dto';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  formForm: UntypedFormGroup;
  token: AbstractControl;
  token_value: string;
  oldPassword: any;
  newPassword: any;
  value: any;
  fieldTextType: boolean;
  fieldTextType1: boolean;
  submitted: boolean;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.formForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.token = this.formForm.controls['token'];
    let str = window.location.search.substring(21);
    this.token_value = str;

    this.oldPassword = this.formForm.controls['oldPassword'];
    this.newPassword = this.formForm.controls['newPassword'];
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.formForm.controls;
  }

  toggleFieldTextType1() {
    this.fieldTextType1 = !this.fieldTextType1;
  }

  submit(): void {
    this.submitted = true;
    if (this.formForm.invalid) return;
    if (this.formForm.value.oldPassword !== this.formForm.value.newPassword) {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Password is not matching',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    var request = {
      forgotPassToken: this.token_value,
      oldPassword: this.formForm.value.oldPassword,
      newPassword: this.formForm.value.newPassword,
    };
    this.authenticationService.verifyForgotPass(request).subscribe(
      (response: ChangePasswordDto) => {
        this.router.navigate(['/login']);
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Password change successfully ,proceed for login',
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
