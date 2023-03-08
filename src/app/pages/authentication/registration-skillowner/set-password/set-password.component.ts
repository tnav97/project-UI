import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SetOwnerPassword } from 'src/app/api/flexcub-api/models';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../authentication.service';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss'],
})
export class SetPasswordComponent implements OnInit {
  emailId: string;
  email: string;
  formForm: any;
  password;
  fieldTextType: boolean;
  token_value: string;
  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private readonly authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param: Params) => {
      this.token_value = param.id;
    });
    this.formForm = this.formBuilder.group({
      emailId: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
    });
    this.email = localStorage.getItem('emailId');
    this.formForm.get('emailId').patchValue(this.email);
    this.password = this.formForm.controls['password'];
  }

  submit(): void {
    if (!this.formForm.valid) return;

    var request: SetOwnerPassword = {
      emailId: this.formForm.value.emailId,
      token: this.token_value,
      password: this.formForm.value.password,
    };
    this.authenticationService.setPasswordForOwner(request).subscribe(
      (response) => {
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

  get f(): { [key: string]: AbstractControl } {
    return this.formForm.controls;
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
