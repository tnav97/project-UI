import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Registration } from 'src/app/api/flexcub-api/models/registration';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-confirm-password',
  templateUrl: './confirm-password.component.html',
  styleUrls: ['./confirm-password.component.scss'],
})
export class ConfirmPasswordComponent implements OnInit {
  step: number = 1;
  form: UntypedFormGroup;
  formForm: any;

  token: AbstractControl;
  password1;
  token_value: string;

  show = false;
  fieldTextType: boolean;
  submitted: boolean;
  fieldTextType1: boolean;

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private readonly authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.formForm = this.formBuilder.group({
      token: ['', Validators.required],
      password1: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
    });

    this.token = this.formForm.controls['token'];
    this.password1 = this.formForm.controls['password1'];
    let str = window.location.search.substring(19);
    this.token_value = str;
    this.password1 = 'password1';
  }

  submit(): void {
    this.submitted = true;
    if (this.formForm.invalid) return;

    var request = {
      token: this.formForm.value.token,
      password: this.formForm.value.password1,
    };
    this.authenticationService.verifyCandidate(request).subscribe(
      (response: Registration) => {
        this.router.navigate(['/login']);
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

  next(i): void {
    this.step = i;
  }

  get f(): { [key: string]: AbstractControl } {
    return this.formForm.controls;
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  toggleFieldTextType1() {
    this.fieldTextType1 = !this.fieldTextType1;
  }
}
