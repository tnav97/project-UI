import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrationEntity, SeekerStatusUpdate, SkillSeeker } from 'src/app/api/flexcub-api/models';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../authentication/authentication.service';
import { SkillseekerRolesService } from '../skillseeker-roles.service';

@Component({
  selector: 'app-seekerlist',
  templateUrl: './seekerlist.component.html',
  styleUrls: ['./seekerlist.component.scss'],
})
export class SeekerlistComponent implements OnInit {
  tabledata = [];
  searchText1: string = '';
  user?: RegistrationEntity;
  seekerTaxId: string;
  subRolesId: number;
  seekerId: number;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly skillseekerRolesService: SkillseekerRolesService
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }
  ngOnInit(): void {
    this.seekerId = this.user?.id;
    this.seekerTaxId = this.user?.taxIdBusinessLicense;
    this.getSeekerById(this.seekerTaxId);
  }

  getSeekerById(taxid) {
    this.skillseekerRolesService.getSeekerById(taxid).subscribe((res) => {
      this.tabledata = res;
      this.tabledata = this.tabledata.sort((a, b) => {
        return b.id - a.id;
      });
    });
  }

  userMapping(list) {
    this.subRolesId = list?.subRoles?.id ?? null;
    this.router.navigate(['/seekerRoles/usermap'], {
      queryParams: { seekerId: list.id, seekerName: list.skillSeekerName, emailId: list.email, roleId: this.subRolesId },
    });
  }

  changeStatus(list: SkillSeeker) {
    var req: SeekerStatusUpdate = {
      isAccountActive: !list?.active,
      skillSeekerId: list?.id,
    };
    if (list?.active) {
      var status = 'Active';
      var endStaus = 'In-Active';
    } else {
      var status = 'In-Active';
      var endStaus = 'Active';
    }

    Swal.fire({
      title: 'Are you sure?',
      text: `The status will be changed from ${status} to ${endStaus}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.skillseekerRolesService.updateSeekerStatus(req).subscribe(
          (res) => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: `The status of the ${list.skillSeekerName} is updated successfully`,
              showConfirmButton: false,
              timer: 1500,
            });
            window.location.reload();
          },
          (error) => {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: error,
              showConfirmButton: false,
              timer: 1500,
            });
          }
        );
      }
    });
  }

  onSearchTextEntered(searchValue: string) {
    this.searchText1 = searchValue;
  }
}
