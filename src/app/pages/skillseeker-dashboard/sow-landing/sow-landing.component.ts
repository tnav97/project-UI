import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Registration } from 'src/app/api/flexcub-api/models';
import { ownerImgUrl } from 'src/app/core/Constants/constant';
import { AuthenticationService } from '../../authentication/authentication.service';
import { skillseekerdashboardService } from '../skillseeker-dashboard.service';

@Component({
  selector: 'app-sow-landing',
  templateUrl: './sow-landing.component.html',
  styleUrls: ['./sow-landing.component.scss'],
})
export class SowLandingComponent implements OnInit {
  dateRange = new UntypedFormGroup({
    start: new UntypedFormControl(),
    end: new UntypedFormControl(),
  });
  user?: Registration;
  seekerId: Number;
  soImgUrl = ownerImgUrl;
  sowDetails: any;
  copySowDetails: any;
  array = [];
  departments = [];
  searchfilter: string = '';
  search: any;
  isLoading: boolean;

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
    this.getSowDetails(this.seekerId);
  }

  getAnswers(data, event) {
    if (event.checked) {
      const index = this.array.findIndex((object) => object.department === data);
      if (index === -1) {
        this.array.push(data);
      }
    } else {
      const index = this.array.findIndex((object) => object.department === data);
      this.array.splice(index, 1);
    }
  }
  getApply() {
    this.sowDetails = this.copySowDetails;
    if (this.array.length !== 0) {
      const filteredData = this.sowDetails.filter((character) => {
        return this.array.includes(character.department);
      });
      this.sowDetails = filteredData;
    }
  }

  resetFilter() {
    this.sowDetails = this.copySowDetails;
  }

  getSowDetails(id) {
    this.skillseekerDashboard.getSowDetails(id).subscribe(
      (res) => {
        this.sowDetails = res;
        for (let i = 0; i < this.sowDetails.length; i++) {
          this.skillseekerDashboard.downloadImage(this.sowDetails[i]?.ownerId).subscribe(
            (res) => {
              this.sowDetails[i]['image'] = this.soImgUrl + this.sowDetails[i]?.ownerId;
            },
            (err) => {
              if (err.status == 200) {
                this.sowDetails[i]['image'] = this.soImgUrl + this.sowDetails[i]?.ownerId;
              } else {
                this.sowDetails[i]['image'] = `assets/images/avatar-default-skillowner.png`;
              }
            }
          );
        }

        this.isLoading = false;
        this.copySowDetails = res;
        this.departments = [...new Set(this.sowDetails.map((item) => item.department))];
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }
}
