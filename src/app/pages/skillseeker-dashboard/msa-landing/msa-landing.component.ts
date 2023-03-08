import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Registration } from 'src/app/api/flexcub-api/models';
import { AuthenticationService } from '../../authentication/authentication.service';
import { skillseekerdashboardService } from '../skillseeker-dashboard.service';

@Component({
  selector: 'app-msa-landing',
  templateUrl: './msa-landing.component.html',
  styleUrls: ['./msa-landing.component.scss'],
})
export class MsaLandingComponent implements OnInit {
  // form:FormGroup;
  dateRange = new UntypedFormGroup({
    start: new UntypedFormControl(),
    end: new UntypedFormControl(),
  });
  msaDetails: any;
  user?: Registration;
  seekerId: Number;
  copyMsaDetails: any;
  array = [];
  departments = [];
  searchfilter: string = '';
  search: any;
  isLoading = true;
  statuses = [
    { value: 'Active' },
    { value: 'InActive' },
    { value: 'In Writing' },
    { value: 'In Review' },
    { value: 'Correction' },
    { value: 'Expiring Soon' },
    { value: 'Expired' },
  ];

  constructor(private skillseekerDashboard: skillseekerdashboardService, private authenticationService: AuthenticationService) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }

  ngOnInit(): void {
    this.seekerId = this.user?.id;
    this.getMsaDetails(this.seekerId);
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
    this.msaDetails = this.copyMsaDetails;
    if (this.array.length !== 0) {
      const filteredData = this.msaDetails.filter((character) => {
        return this.array.includes(character.skillSeekerProjectDept);
      });
      this.msaDetails = filteredData;
    }
  }

  resetFilter() {
    this.msaDetails = this.copyMsaDetails;
  }

  getMsaDetails(seekerid) {
    this.skillseekerDashboard.getMsaDetailsBySeeker(seekerid).subscribe(
      (res) => {
        this.msaDetails = res;
        this.isLoading = false;
        this.copyMsaDetails = res;
        this.departments = [...new Set(this.msaDetails.map((item) => item.skillSeekerProjectDept))];
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }
}
