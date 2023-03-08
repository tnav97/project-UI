import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Registration } from 'src/app/api/flexcub-api/models';
import { ownerImgUrl } from 'src/app/core/Constants/constant';
import { AuthenticationService } from '../../authentication/authentication.service';
import { skillseekerdashboardService } from '../skillseeker-dashboard.service';

@Component({
  selector: 'app-po-landing',
  templateUrl: './po-landing.component.html',
  styleUrls: ['./po-landing.component.scss'],
})
export class PoLandingComponent implements OnInit {
  dateRange = new UntypedFormGroup({
    start: new UntypedFormControl(),
    end: new UntypedFormControl(),
  });
  user?: Registration;
  seekerId: Number;
  soImgUrl = ownerImgUrl;
  poDetails: any;
  copypoDetails: any;
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
    this.getPoDetails(this.seekerId);
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
    this.poDetails = this.copypoDetails;
    if (this.array.length !== 0) {
      const filteredData = this.poDetails.filter((character) => {
        return this.array.includes(character.skillSeekerProjectDept);
      });
      this.poDetails = filteredData;
    }
  }

  resetFilter() {
    this.poDetails = this.copypoDetails;
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

  getPoDetails(id) {
    this.skillseekerDashboard.getPoDetails(id).subscribe(
      (res) => {
        this.poDetails = res;
        for (let i = 0; i < this.poDetails.length; i++) {
          this.skillseekerDashboard.downloadImage(this.poDetails[i]?.ownerId).subscribe(
            (res) => {
              this.poDetails[i]['image'] = this.soImgUrl + this.poDetails[i]?.ownerId;
            },
            (err) => {
              if (err.status == 200) {
                this.poDetails[i]['image'] = this.soImgUrl + this.poDetails[i]?.ownerId;
              } else {
                this.poDetails[i]['image'] = `assets/images/avatar-default-skillowner.png`;
              }
            }
          );
        }

        this.isLoading = false;
        this.copypoDetails = res;
        this.departments = [...new Set(this.poDetails.map((item) => item.skillSeekerProjectDept))];
      },
      (err) => {
        this.isLoading = false;
      }
    );
  }
}
