import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, first } from 'rxjs/operators';
import { RegistrationEntity } from 'src/app/api/flexcub-api/models';
import { AuthenticationService } from '../../authentication/authentication.service';
import { SkillseekerRolesService } from '../skillseeker-roles.service';

@Component({
  selector: 'app-addrole',
  templateUrl: './addrole.component.html',
  styleUrls: ['./addrole.component.scss'],
})
export class AddroleComponent implements OnInit {
  roleList: any[] = [];
  modules: any[] = [];
  accessTaxId: any[] = [];
  addRole: UntypedFormGroup;
  user?: RegistrationEntity;
  seekerTaxId: string;
  storageIds = [];
  selectedRolesId: any;

  constructor(
    private skillseekerRolesService: SkillseekerRolesService,
    private router: Router,
    private readonly activateRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }

  ngOnInit(): void {
    this.seekerTaxId = this.user?.taxIdBusinessLicense;

    this.getModules();
    this.getRoleList();
    this.addRole = this.fb.group({
      roleId: ['', Validators.required],
      moduleId: ['', Validators.required],
      active: ['', Validators.required],
    });
    this.activateRoute.queryParams
      .pipe(
        filter((param: Params) => !!param),
        first()
      )
      .subscribe((param: Params) => {
        for (let i = 0; i < param.accessList.length; i++) {
          this.storageIds.push(parseInt(param.accessList[i]));
        }
        this.addRole.controls['roleId'].setValue(param.roleName);
        this.addRole.controls['moduleId'].setValue(this.storageIds);
        this.addRole.controls['active'].setValue(param.status);
      });
  }

  getModules() {
    this.skillseekerRolesService.getModules().subscribe((res: any) => {
      if (res) {
        this.modules = res;
      }
    });
  }
  getRoleList() {
    this.skillseekerRolesService.getRoleListDetails().subscribe((res: any) => {
      if (res) {
        this.roleList = res;
        const filteredRoleList = this.roleList.filter((item) => item.id !== 1);
        this.roleList = filteredRoleList;
      }
    });
  }

  onAddRole() {
    let formValue = this.addRole.getRawValue();
    formValue.taxId = this.seekerTaxId;
    this.skillseekerRolesService.addSubRole(formValue).subscribe((res) => {
      this.router.navigate(['/seekerRoles/rolelist']);
    });
  }
}
