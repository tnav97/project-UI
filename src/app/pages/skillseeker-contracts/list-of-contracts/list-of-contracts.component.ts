import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Registration } from 'src/app/api/flexcub-api/models';
import { ownerImgUrl } from 'src/app/core/Constants/constant';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../authentication/authentication.service';
import { skillseekerdashboardService } from '../../skillseeker-dashboard/skillseeker-dashboard.service';
import { SkillseekerContractsService } from '../skillseeker-contracts.service';

@Component({
  selector: 'app-list-of-contracts',
  templateUrl: './list-of-contracts.component.html',
  styleUrls: ['./list-of-contracts.component.scss'],
  providers: [DatePipe],
})
export class ListOfContractsComponent implements OnInit {
  toggleSideBar: boolean = false;
  skillOwnerName: string = '';
  contractStatus = '';
  skillOwnerExperience: string = '';
  dateRange = new UntypedFormGroup({
    start: new UntypedFormControl(),
    end: new UntypedFormControl(),
  });
  user?: Registration;
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
  searchText: string = '';
  isLoading: boolean;
  show: any;
  id = 0;
  skillOwnerId: any;
  sowVisibility: Boolean;
  poVisibility: Boolean;
  getcontractDetails: any;
  StatusList: any;

  statuses = [
    { value: 'Active' },
    { value: 'InActive' },
    { value: 'In Writing' },
    { value: 'In Review' },
    { value: 'Correction' },
    { value: 'Expiring Soon' },
    { value: 'Expired' },
  ];
  constructor(
    private skillseekerDashboard: skillseekerdashboardService,
    private skillseekerContractsService: SkillseekerContractsService,
    private authenticationService: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }

  ngOnInit(): void {
    this.getContractStatus();
    this.seekerId = this.user?.id;
    this.moduleAccess = this.user?.modulesAccess;
    this.contractsVisiblity = this.moduleAccess.some((element) => {
      if (element.seekerModule === 'Contract') {
        return true;
      }
      return false;
    });
    this.sowVisibility = this.moduleAccess.some((element) => {
      if (element.seekerModule === 'Creation of SOW') {
        return true;
      }

      return false;
    });
    this.poVisibility = this.moduleAccess.some((element) => {
      if (element.seekerModule === 'Creation of PO') {
        return true;
      }

      return false;
    });
    if (!this.contractsVisiblity) {
      this.router.navigate(['/ssdashboard']).then(() => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'The selected module is restricted for you. please contact your seeker admin',
          showConfirmButton: false,
          timer: 1500,
        });
      });
    }
    this.getContractDetails(this.seekerId);
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

  getContractStatus() {
    this.skillseekerContractsService.getContractStatus().subscribe((res) => {
      this.StatusList = res;
    });
  }

  updateMSAStatus(msaId, statusid, status) {
    this.skillseekerContractsService.updateMsaStatus(msaId, statusid).subscribe((res) => {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: `MSA ${status} successfully`,
        showConfirmButton: false,
        timer: 1500,
      });
      this.getContractDetails(this.seekerId);
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
      this.getContractDetails(this.seekerId);
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
      this.getContractDetails(this.seekerId);
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

  getContractDetails(id) {
    this.skillseekerContractsService.getContractDetails(id).subscribe(
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
