import { Component, OnInit } from '@angular/core';
import { OwnerDetails, OwnerStatusUpdate, Registration } from 'src/app/api/flexcub-api/models';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../authentication/authentication.service';
import { SkillpartnerHiringService } from '../skillpartner-hiring.service';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss'],
})
export class EmployeesListComponent implements OnInit {
  tabledata = [];
  searchText1:any;
  user?: Registration;
  partnerId: Number;

  constructor(private authenticationService: AuthenticationService, private readonly skillpartnerHiringService: SkillpartnerHiringService) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }
  ngOnInit(): void {
    this.partnerId = this.user?.id;
    this.getOwnerDetailsInSeeker(this.partnerId);
  }

  getOwnerDetailsInSeeker(id) {
    this.skillpartnerHiringService.getOwnerDetailsInSeeker(id).subscribe((res) => {
      this.tabledata = res;
      this.tabledata.map((data: any) => {
        data['editable'] = false;
      });
      this.tabledata = this.tabledata.sort((a, b) => {
        return b.employeeId - a.employeeId;
      });
    });
  }

  changeStatus(list: OwnerDetails) {
    var req: OwnerStatusUpdate = {
      isAccountActive: !list?.status,
      skillOwnerId: list?.employeeId,
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
        this.skillpartnerHiringService.skillOwnerStatusUpdate(req).subscribe(
          (res) => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: `The status of the ${list.employeeName} is updated successfully`,
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
  rateValue: number = 0;
  editRate(index: number) {
    this.tabledata.map((data: any) => {
      data['editable'] = false;
    });
    let editTableData = this.tabledata[index];
    this.tabledata[index]['editable'] = true;
    this.rateValue = editTableData.rate;
  }
  updateRate(id: number) {
    let req = {
      skillOwnerId: id,
      rate: this.rateValue,
    };
    this.skillpartnerHiringService.skillOwnerRateUpdate(req).subscribe(
      (res) => {
        this.getOwnerDetailsInSeeker(this.partnerId);
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
}
