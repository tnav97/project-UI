import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Registration, SkillOwnerDto } from 'src/app/api/flexcub-api/models';
import { ownerImgUrl } from 'src/app/core/Constants/constant';
import { AuthenticationService } from '../../authentication/authentication.service';
import { SkillpartnerHiringService } from '../../skillpartner-hiring/skillpartner-hiring.service';

@Component({
  selector: 'app-owner-job-history',
  templateUrl: './owner-job-history.component.html',
  styleUrls: ['./owner-job-history.component.scss'],
})
export class OwnerJobHistoryComponent implements OnInit {
  tabledata = [];
  searchText2: string = '';
  skillownerData: SkillOwnerDto;
  skillOwnerName: string;
  ownerId: number;
  user?: Registration;
  skillOwnerExperience: string;
  imageAvailable: boolean = false;
  skillOwnerId: Number;
  soImgUrl = ownerImgUrl;
  location: string;
  constructor(
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private readonly skillpartnerHiringService: SkillpartnerHiringService
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }
  ngOnInit(): void {
    this.ownerId = this.user?.id;
    this.getJobHistoryInSeeker(this.ownerId);
    this.getSkillOwner(this.ownerId);
    this.skillOwnerImage(this.ownerId);
  }

  getJobHistoryInSeeker(id) {
    this.skillpartnerHiringService.getJobHistoryInSeeker(id).subscribe((res) => {
      this.tabledata = res;
      this.tabledata = this.tabledata.sort((a, b) => {
        return b.jobId.slice(4) - a.jobId.slice(4);
      });
    });
  }

  getSkillOwner(ownerId) {
    this.skillpartnerHiringService.getSkillOwner(ownerId).subscribe((res) => {
      this.skillownerData = res;
      this.skillOwnerName = res.firstName + ' ' + res.lastName;
      this.skillOwnerExperience = res.expYears + 'Years ' + res.expMonths + ' Months';
      this.location = res.city + ',' + '$' + res.rateCard + '/Hour';
    });
  }
  skillOwnerImage(ownerId) {
    this.skillpartnerHiringService.downloadImage(ownerId).subscribe((res) => {
      this.imageAvailable = true;
    });
  }

  onSearchTextEntered(searchValue: string) {
    this.searchText2 = searchValue;
  }
}
