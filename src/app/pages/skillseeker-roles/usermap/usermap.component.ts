import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, first } from 'rxjs/operators';
import { SkillseekerRolesService } from '../skillseeker-roles.service';

@Component({
  selector: 'app-usermap',
  templateUrl: './usermap.component.html',
  styleUrls: ['./usermap.component.scss'],
})
export class UsermapComponent implements OnInit {
  seekerTaxId: any[] = [];
  roleList: any[] = [];
  SubRoleToSeeker: any[] = [];
  userMap: UntypedFormGroup;
  SeekerId: any;

  constructor(
    private router: Router,
    private readonly activateRoute: ActivatedRoute,
    private skillseekerRolesService: SkillseekerRolesService,
    private fb: UntypedFormBuilder
  ) {}

  ngOnInit(): void {
    this.userMap = this.fb.group({
      role: ['', Validators.required],
      skillSeekerId: [{ value: '', disabled: true }, Validators.required],
    });
    this.activateRoute.queryParams
      .pipe(
        filter((param: Params) => !!param && !!param.emailId && !!param.seekerName),
        first()
      )
      .subscribe((param: Params) => {
        this.SeekerId = param.seekerId;
        if (param?.roleId) {
          this.userMap.controls['role'].setValue(param.roleId);
        }
        this.userMap.controls['skillSeekerId'].setValue(param.seekerName + ' - ' + param.emailId);
      });
    this.getRoleList();
  }

  getRoleList() {
    this.skillseekerRolesService.getRoleListDetails().subscribe((res: any) => {
      if (res) {
        this.roleList = res;
        const newArr = this.roleList.filter((object) => {
          return object.id !== 1;
        });
        this.roleList = newArr;
      }
    });
  }

  submit() {
    this.skillseekerRolesService.addSubRoleToSeeker(this.SeekerId, this.userMap.get('role').value).subscribe((res) => {
      this.router.navigate(['/seekerRoles']);
    });
  }
}
