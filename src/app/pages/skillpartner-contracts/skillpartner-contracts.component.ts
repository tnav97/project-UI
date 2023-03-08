import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Registration } from 'src/app/api/flexcub-api/models';
import { ownerImgUrl } from 'src/app/core/Constants/constant';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../authentication/authentication.service';
import { SkillseekerContractsService } from '../skillseeker-contracts/skillseeker-contracts.service';
import { skillseekerdashboardService } from '../skillseeker-dashboard/skillseeker-dashboard.service';
import { SkillpartnerContractsService } from './skillpartner-contracts.service';

@Component({
  selector: 'app-skillpartner-contracts',
  templateUrl: './skillpartner-contracts.component.html',
  styleUrls: ['./skillpartner-contracts.component.scss'],
})
export class SkillpartnerContractsComponent implements OnInit {
  toggleSideBar: boolean = false;
  dateRange = new UntypedFormGroup({
    start: new UntypedFormControl(),
    end: new UntypedFormControl(),
  });
  user?: Registration;
  seekerId: Number;
  partnerId: Number;
  soImgUrl = ownerImgUrl;
  sowDetails: any;
  copySowDetails: any;
  copycontractDetails: any;
  array = [];
  departments = [];
  vendors = [];
  searchfilter: string = '';
  search1: any;
  search: any;
  isLoading: boolean;
  show: any;
  skillOwnerId: any;
  contractDetails: any;
  StatusList: any;
  id = 0;
  contractStatus = '';

  statuses = [
    { value: 'Active' },
    { value: 'InActive' },
    { value: 'In Writing' },
    { value: 'In Review' },
    { value: 'Correction' },
    { value: 'Expiring Soon' },
    { value: 'Expired' },
    { value: 'Po in-progress' },
  ];
  constructor(
    private skillseekerDashboard: skillseekerdashboardService,
    private authenticationService: AuthenticationService,
    private skillpartnercontractservice: SkillpartnerContractsService,
    private readonly skillseekerContractsService: SkillseekerContractsService
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }

  ngOnInit(): void {
    this.partnerId = this.user?.id;
    this.getContractDetails(this.partnerId);
    this.getContractStatus();
  }

  onSelect(list): void {
    this.toggleSideBar = true;
    this.skillOwnerId = list.ownerId;
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
      this.getContractDetails(this.partnerId);
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
      this.getContractDetails(this.partnerId);
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
      this.getContractDetails(this.partnerId);
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

  getAnswers(data, event) {
    if (event.checked) {
      const index = this.array.findIndex((object) => object.vendor === data);
      if (index === -1) {
        this.array.push(data);
      }
    } else {
      const index = this.array.findIndex((object) => object.vendor === data);
      this.array.splice(index, 1);
    }
  }
  getApply() {
    this.contractDetails = this.copycontractDetails;
    if (this.array.length !== 0) {
      const filteredData = this.contractDetails.filter((character) => {
        return this.array.includes(character.vendor);
      });
      this.contractDetails = filteredData;
    }
  }

  resetFilter() {
    this.contractDetails = this.copycontractDetails;
  }

  getContractDetails(id) {
    this.skillpartnercontractservice.getContractDetails1(id).subscribe(
      (res) => {
        this.contractDetails = res;
        for (let i = 0; i < this.contractDetails.length; i++) {
          this.skillseekerDashboard.downloadImage(this.contractDetails[i]?.ownerId).subscribe(
            (res) => {
              this.contractDetails[i]['image'] = this.soImgUrl + this.contractDetails[i]?.ownerId;
            },
            (err) => {
              if (err.status == 200) {
                this.contractDetails[i]['image'] = this.soImgUrl + this.contractDetails[i]?.ownerId;
              } else {
                this.contractDetails[i]['image'] = `assets/images/avatar-default-skillowner.png`;
              }
            }
          );
        }

        this.isLoading = false;
        this.copycontractDetails = res;
        this.departments = [...new Set(this.contractDetails.map((item) => item.skillSeekerProjectDept))];
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }
}
