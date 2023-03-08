import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Registration } from 'src/app/api/flexcub-api/models';
import { ownerImgUrl } from 'src/app/core/Constants/constant';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../authentication/authentication.service';
import { skillseekerdashboardService } from '../../skillseeker-dashboard/skillseeker-dashboard.service';
import { SuperAdminService } from '../super-admin.service';

@Component({
  selector: 'app-contracts-list',
  templateUrl: './contracts-list.component.html',
  styleUrls: ['./contracts-list.component.scss'],
})
export class ContractsListComponent implements OnInit {
  toggleSideBar: boolean = false;
  skillOwnerName: string = '';
  skillOwnerExperience: string = '';
  dateRange = new UntypedFormGroup({
    start: new UntypedFormControl(),
    end: new UntypedFormControl(),
  });
  user?: Registration;
  vendors = [];
  search1: any;
  seekerId: Number;
  soImgUrl = ownerImgUrl;
  contractDetails: any;
  contractsVisiblity: Boolean;
  copycontractDetails: any;
  moduleAccess = [];
  array = [];
  status: any;
  departments = [];
  searchfilter: string = '';
  search: any;
  isLoading: boolean;
  show: any;
  skillOwnerId: any;

  StatusList: any;
  contractStatus = '';
  statuses = [
    { value: 'Active' },
    { value: 'InActive' },
    { value: 'In Writing' },
    { value: 'In Review' },
    { value: 'Correction' },
    { value: 'Expiring Soon' },
    { value: 'Expired' },
  ];
  id = 0;
  statusMap = [
    { id: 0, status: 'Status' },
    { id: 1, status: 'MSA' },
    { id: 3, status: 'SOW' },
    { id: 4, status: 'PO' },
  ];
  constructor(
    private skillseekerDashboard: skillseekerdashboardService,
    private skillseekerContractsService: SuperAdminService,
    private authenticationService: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }

  ngOnInit(): void {
    this.getContractStatus();
    this.getContractDetails();
  }

  onSelect(list): void {
    this.status = list.status;
    this.toggleSideBar = true;
    this.skillOwnerId = list.ownerId;
    this.cdr.markForCheck();
  }

  icon() {
    this.show = true;
  }
  closeBar(): void {
    this.toggleSideBar = false;
  }

  onSow(list): void {
    this.router.navigate([`/ssdashboard/sow/skillowner`], { queryParams: { jobId: list.jobId, skillOwnerId: list.ownerId } });
  }

  onPow(list): void {
    this.router.navigate([`/ssdashboard/po-process/skillowner`], { queryParams: { jobId: list.jobId, skillOwnerId: list.ownerId } });
  }

  getAnswers(data, event) {
    if (event.checked) {
      const index = this.array.findIndex((object) => object.skillSeekerProjectDept === data);
      if (index === -1) {
        this.array.push(data);
      }
    } else {
      const index = this.array.findIndex((object) => object.skillSeekerProjectDept === data);
      this.array.splice(index, 1);
    }
  }
  getApply() {
    this.contractDetails = this.copycontractDetails;
    if (this.array.length !== 0) {
      const filteredData = this.contractDetails.filter((character) => {
        return this.array.includes(character.skillSeekerProjectDept);
      });
      this.contractDetails = filteredData;
    }
  }

  resetFilter() {
    this.contractDetails = this.copycontractDetails;
  }

  getContractStatus() {
    this.skillseekerContractsService.getContractStatus().subscribe((res) => {
      this.StatusList = res;
    });
  }

  // getMsaDetails() {
  //   this.skillseekerDashboard.getMsaDetails().subscribe((res) => {
  //
  //     this.msaDetails = res;
  //     this.copyMsaDetails = res;
  //     this.departments = [
  //       ...new Set(this.msaDetails.map((item) => item.skillSeekerProjectDept)),
  //     ];
  //   });
  // }
  updateMSAStatus(msaId, statusid, status) {
    this.skillseekerContractsService.updateMsaStatus(msaId, statusid).subscribe((res) => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: `MSA ${status} successfully`,
        showConfirmButton: false,
        timer: 1500,
      });
      this.getContractDetails();
    });
  }

  updateSOWStatus(sowId, statusid, status) {
    this.skillseekerContractsService.updateSowStatus(sowId, statusid).subscribe((res) => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: `SOW ${status} successfully`,
        showConfirmButton: false,
        timer: 1500,
      });
      this.getContractDetails();
    });
  }

  updatePOStatus(poId, statusid, status) {
    this.skillseekerContractsService.updatePOStatus(poId, statusid).subscribe((res) => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: `PO ${status} successfully`,
        showConfirmButton: false,
        timer: 1500,
      });
      this.getContractDetails();
    });
  }

  statusChange(text, list) {
    if (text == 'next') {
      this.id += 1;

      if (this.id % 4 == 1) {
        this.contractStatus = 'MSA';
      } else if (this.id % 4 == 2) {
        this.contractStatus = 'SOW';
      } else if (this.id % 4 == 3) {
        this.contractStatus = 'PO';
      } else {
        this.contractStatus = '';
      }
    }

    if (text == 'previous') {
      this.id -= 1;
      if (Math.abs(this.id) % 4 === 1) {
        this.contractStatus = 'MSA';
      } else if (Math.abs(this.id) % 4 === 2) {
        this.contractStatus = 'SOW';
      } else if (Math.abs(this.id) % 4 == 3) {
        this.contractStatus = 'PO';
      } else {
        this.contractStatus = '';
      }
    }
  }

  getContractDetails() {
    this.skillseekerContractsService.getAllContractDetails().subscribe(
      (res) => {
        this.contractDetails = res;
        for (let i = 0; i < this.contractDetails.length; i++) {
          this.skillseekerDashboard.downloadImage(this.contractDetails[i]?.ownerId).subscribe(
            (res) => {
              this.contractDetails[i]['image'] = this.soImgUrl + this.contractDetails[i]?.ownerId;
            },
            (err) => {
              if (this.contractDetails[i]) {
                if (err.status == 200) {
                  this.contractDetails[i]['image'] = this.soImgUrl + this.contractDetails[i]?.ownerId;
                } else {
                  this.contractDetails[i]['image'] = `assets/images/avatar-default-skillowner.png`;
                }
              }
            }
          );
        }

        this.isLoading = false;
        this.copycontractDetails = res;
        this.departments = [...new Set(this.contractDetails?.map((item) => item?.skillSeekerProjectDept))];
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }
}
