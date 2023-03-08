import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SeekerStatusUpdate } from 'src/app/api/flexcub-api/models';
import Swal from 'sweetalert2';
import { SkillseekerRolesService } from '../../skillseeker-roles/skillseeker-roles.service';
import { SuperAdminService } from '../super-admin.service';

declare var $: any;

@Component({
  selector: 'app-super-admin-clients',
  templateUrl: './super-admin-clients.component.html',
  styleUrls: ['./super-admin-clients.component.scss'],
})
export class SuperAdminClientsComponent implements OnInit {
  clientData: any;
  clientId: any;
  editValue: string;
  constructor(
    private superAdminService: SuperAdminService,
    private readonly skillseekerRolesService: SkillseekerRolesService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    $('[data-toggle="tooltip"]').tooltip();
    this.getSuperAdminClientData();

    this.getQueryParams();
  }
  getSuperAdminClientData() {
    this.superAdminService.getSuperAdminClients().subscribe((data) => {
      if (data) {
        this.clientData = data;
        this.clientData = this.clientData.sort((a, b) => {
          return b.id - a.id;
        });
      }
    });
  }

  getQueryParams() {}

  add(): void {
    this.router.navigate(['superadmin/addnew-ss'], { queryParams: { type: 'new' } });
  }

  edit(id: string): void {
    this.router.navigate(['superadmin/addnew-ss'], { queryParams: { clientId: id, type: 'edit' } });
  }

  preview(id: string): void {
    this.router.navigate(['superadmin/addnew-ss'], { queryParams: { clientId: id, type: 'preview' } });
  }

  changeStatus(list) {
    var req: SeekerStatusUpdate = {
      isAccountActive: !list?.status,
      skillSeekerId: list?.id,
    };
    if (list?.status) {
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
}
