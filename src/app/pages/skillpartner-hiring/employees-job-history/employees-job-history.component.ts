import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs/tabset.component';
import { SkillOwnerDto } from 'src/app/api/flexcub-api/models';
import { ownerImgUrl } from 'src/app/core/Constants/constant';
import { SkillpartnerHiringService } from '../skillpartner-hiring.service';

@Component({
  selector: 'app-employees-job-history',
  templateUrl: './employees-job-history.component.html',
  styleUrls: ['./employees-job-history.component.scss'],
})
export class EmployeesJobHistoryComponent implements OnInit {
  @ViewChild('tabset') tabset: TabsetComponent;
  tabledata = [];
  _tabledata = [];
  searchText2: string = '';
  skillownerData: SkillOwnerDto;
  skillOwnerName: string;
  skillOwnerExperience: string;
  imageAvailable: boolean = false;
  skillOwnerId: Number;
  location: string;
  soImgUrl = ownerImgUrl;
  // relatedNotification:any
  constructor(private route: ActivatedRoute, private readonly skillpartnerHiringService: SkillpartnerHiringService) {}
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.skillOwnerId = params.id;
      this.getJobHistoryInSeeker(params.id);
      this.getSkillOwner(params.id);
      this.skillOwnerImage(params.id);
      this.historyOfJobs(params.id);
    });
  }

  getJobHistoryInSeeker(id) {
    this.skillpartnerHiringService.getJobHistoryInSeeker(id).subscribe((res) => {
      this.tabledata = res;
      this.tabledata = this.tabledata.sort((a, b) => {
        return b.jobId.slice(4) - a.jobId.slice(4);
      });
    });
  }

  historyOfJobs(id){
    this.skillpartnerHiringService.historyOfJobs(id).subscribe((res)=>{
      this._tabledata =res
    })
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

  // relatedNotifications(jobid:any){
  //    this.jobNotification(this.skillOwnerId,jobid)
  // }

  onSearchTextEntered(searchValue: string) {
    this.searchText2 = searchValue;
  }
}
