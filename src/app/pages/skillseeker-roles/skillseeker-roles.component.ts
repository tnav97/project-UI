import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrationEntity } from 'src/app/api/flexcub-api/models';
import { AuthenticationService } from '../authentication/authentication.service';
import { SkillseekerRolesService } from './skillseeker-roles.service';

@Component({
  selector: 'app-skillseeker-roles',
  templateUrl: './skillseeker-roles.component.html',
  styleUrls: ['./skillseeker-roles.component.scss'],
})
export class SkillseekerRolesComponent implements OnInit {
  user?: RegistrationEntity;
  seekerTaxId: string;
  data: any;
  modules: any;
  storageIds = [];
  roleList: any;
  selectedRolesId: any;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly skillseekerRolesService: SkillseekerRolesService
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }
  ngOnInit(): void {
    this.seekerTaxId = this.user?.taxIdBusinessLicense;
    this.getAccessById(this.seekerTaxId);
    this.getModules();
    this.getRoleList();
  }

  getModules() {
    this.skillseekerRolesService.getModules().subscribe((res: any) => {
      if (res) {
        this.modules = res;
      }
    });
  }

  edit(list) {
    for (let i = 0; i < this.roleList.length; i++) {
      if (this.roleList[i].subRoleDescription === list.roleName) {
        this.selectedRolesId = this.roleList[i].id;
      }
    }
    for (let i = 0; i < list.accessList.length; i++) {
      this.storageIds.push(list.accessList[i].id);
    }
    this.router.navigate(['/seekerRoles/addrole'], {
      queryParams: { roleName: this.selectedRolesId, accessList: this.storageIds, status: list.status },
    });
  }

  getRoleList() {
    this.skillseekerRolesService.getRoleListDetails().subscribe((res: any) => {
      if (res) {
        this.roleList = res;
      }
    });
  }

  getAccessById(taxId) {
    return this.skillseekerRolesService.getAccessById(taxId).subscribe((res: any) => {
      this.data = res;
      this.data.splice(0, 0, {
        roleId: 'RID-01',
        roleName: 'Admin',
        accessList: [{ id: 0, seekerModule: 'All' }],
        status: true,
      });
    });
  }
}
