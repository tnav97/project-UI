import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, first } from 'rxjs/operators';
import { Registration, SelectionPhaseResponse } from 'src/app/api/flexcub-api/models';
import { ownerImgUrl, ownerResumeUrl } from 'src/app/core/Constants/constant';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../authentication/authentication.service';
import { skillseekerdashboardService } from '../skillseeker-dashboard.service';

@Component({
  selector: 'app-jobs-candidate-suggestions',
  templateUrl: './jobs-candidate-suggestions.component.html',
  styleUrls: ['./jobs-candidate-suggestions.component.scss'],
})
export class JobsCandidateSuggestionsComponent implements OnInit {
  pager: any = {};
  sum = 0;
  isLoading = false;
  jobId: string;
  candidateSuggestionList: any;
  copyCandidateSuggestionList: any;
  jobTitle: string;
  show: boolean = false;
  isLocked: boolean = false;
  array = [];
  candidateItemList: any;
  count: any;
  soImgUrl = ownerImgUrl;
  soResumeUrl = ownerResumeUrl;
  array2 = [];
  user?: Registration;
  moduleAccess = [];
  shortlistVisibility: Boolean;
  copycandidateItemList = [];
  copycandidateItemListData = [];
  dialogConfig: string = '';

  constructor(
    private readonly authnticationService: AuthenticationService,
    private readonly skillseekerdashboardService: skillseekerdashboardService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router
  ) {
    this.authnticationService.user.subscribe((x) => (this.user = x));
  }

  ngOnInit(): void {
    this.moduleAccess = this.user?.modulesAccess;
    this.shortlistVisibility = this.moduleAccess.some((element) => {
      if (element.seekerModule === 'Shortlisting of Candidate') {
        return true;
      }

      return false;
    });
    this.getQueryParams();
  }
  getQueryParams(): void {
    this.activatedRoute.params
      .pipe(
        filter((param: Params) => !!param),
        first()
      )
      .subscribe((param: Params) => {
        this.jobId = param.jobId;
        this.getCandidateSuggestion(this.jobId);
        this.getCandidateItems(this.jobId);
      });
  }

  getCandidateItems(jobId: string): void {
    this.skillseekerdashboardService.getCandidateItems(jobId).subscribe((res) => {
      this.candidateItemList = res;
      for (let i = 0; i < this.candidateItemList.length; i++) {
        this.skillseekerdashboardService.getById(this.candidateItemList[i]?.skillOwnerId).subscribe((data) => {
          if (this.candidateItemList[i].rate === null) {
            this.candidateItemList[i]['rate'] = data?.rateCard ?? 0;
          } else {
            this.candidateItemList[i]['rate'] = this.candidateItemList[i].rate ?? 0;
          }
        });
        this.skillseekerdashboardService.downloadImage(this.candidateItemList[i]?.skillOwnerId).subscribe(
          (res) => {
            this.candidateItemList[i]['image'] = this.soImgUrl + this.candidateItemList[i]?.skillOwnerId;
          },
          (err) => {
            if (err.status == 200) {
              this.candidateItemList[i]['image'] = this.soImgUrl + this.candidateItemList[i]?.skillOwnerId;
            } else {
              this.candidateItemList[i]['image'] = `assets/images/avatar-default-skillowner.png`;
            }
          }
        );
      }
      this.jobTitle = res[0].jobTitle;
    });
  }
  widget() {
    if (!this.shortlistVisibility) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'The selected module is restricted for you. please contact your seeker admin',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    this.isLoading = true;
    this.array2 = [];

    for (let i = 0; i < this.array.length; i++) {
      var request = {
        job: {
          jobId: this.array[i].jobId,
        },
        skillOwnerEntity: {
          skillOwnerEntityId: this.array[i].skillOwnerId,
        },
        showTicksValues: true,
        showSelectionBar: true,
      };
      this.array2.push(request);
    }
    if (this.array2.length > 0) {
      this.skillseekerdashboardService.InsertSelectionPhasesPath(this.array2).subscribe(
        (response) => {
          this.skillseekerdashboardService.shortlistingMail(this.jobId).subscribe(
            (response) => {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Mail is sent to candidates',
                showConfirmButton: false,
                timer: 1500,
              });
              this.getCandidateItems(this.jobId);
              this.skillseekerdashboardService.isLocked(this.jobId).subscribe(
                (res) => {
                  var data = res?.flow ?? null;
                  if (data.length > 0) {
                    var request = {
                      jobId: this.jobId,
                      requirementPhases: data,
                      percentageRequired: res?.percentageExpected ?? null,
                    };
                    this.skillseekerdashboardService.InsertRequirementPhasesPath(request).subscribe((res) => {
                      this.dialogConfig = 'rateCard';
                      // this.router.navigate(['/ssdashboard/ListItems/jobId/' + this.jobId]);
                    });
                  } else {
                    this.router.navigate(['/ssdashboard/widgets/jobId/' + this.jobId]);
                  }
                },
                (err) => {
                  this.router.navigate(['/ssdashboard/widgets/jobId/' + this.jobId]);
                }
              );

              this.isLoading = false;
            },
            (error) => {
              Swal.fire({
                position: 'center',
                icon: 'error',
                title: error,
                showConfirmButton: false,
                timer: 1500,
              });
              this.isLoading = false;
            }
          );
        },
        (error) => {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: error,
            showConfirmButton: false,
            timer: 1500,
          });
          this.isLoading = false;
        }
      );
    }
  }

  get _publish(): boolean {
    return this.candidateItemList?.every((n) => n['rate'] !== null);
  }

  publish() {
    this.isLoading = true;

    if (!this.candidateItemList.every((n) => parseFloat(n['rate']) !== 0)) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Rate cannot be 0 $',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    this.copycandidateItemList = this.candidateItemList;
    this.copycandidateItemList?.forEach((n) => {
      this.copycandidateItemListData.push({
        skillOwnerId: n.skillOwnerId,
        jobId: n.jobId,
        rate: n.rate,
      });
    });

    this.dialogConfig = '';
    this.skillseekerdashboardService.skillOwnerRate(this.copycandidateItemListData).subscribe(
      (res) => {
        this.router.navigate(['/ssdashboard/ListItems/jobId/' + this.jobId]);
      },
      (error) => {
        this.isLoading = false;
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: error,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    );
  }

  getCandidateSuggestion(jobId: string): void {
    this.isLoading = true;
    this.skillseekerdashboardService.getCandidateSuggetion(jobId).subscribe((response) => {
      this.isLoading = false;
      this.candidateSuggestionList = response;
      this.copyCandidateSuggestionList = response;
      if (this.candidateSuggestionList.filter((x) => x.shortlist == true).length > 0) {
        this.show = true;
      }
      this.candidateSuggestionList = this.candidateSuggestionList.filter((x) => x.shortlist == false);
      this.copyCandidateSuggestionList = this.copyCandidateSuggestionList.filter((x) => x.shortlist == false);
      this.candidateSuggestionList = this.candidateSuggestionList.slice(0, 5);

      if (this.candidateSuggestionList.length === 0) {
        this.router.navigate(['/ssdashboard/joblist']).then(() => {
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'No candidates available for recommendation talent',
            showConfirmButton: false,
            timer: 1500,
          });
        });
      }
      this.jobTitle = this.candidateSuggestionList[0].jobTitle;
    });
  }

  getAnswers(data, event) {
    if (event.checked) {
      const index = this.array.findIndex((object) => object.skillOwnerId === data.skillOwnerId);
      const index2 = this.candidateSuggestionList.findIndex((object) => object.skillOwnerId === data.skillOwnerId);
      this.candidateSuggestionList[index2].shortlist = true;
      if (index === -1) {
        this.array.push(data);
      }
    } else {
      const index2 = this.candidateSuggestionList.findIndex((object) => object.skillOwnerId === data.skillOwnerId);
      this.candidateSuggestionList[index2].shortlist = false;
      const index = this.array.findIndex((object) => object.skillOwnerId === data.skillOwnerId);
      this.array.splice(index, 1);
    }
  }
  getClickAnswers(data, event) {
    if (event) {
      const index = this.array.findIndex((object) => object.skillOwnerId === data.skillOwnerId);
      const index2 = this.candidateSuggestionList.findIndex((object) => object.skillOwnerId === data.skillOwnerId);
      this.candidateSuggestionList[index2].shortlist = true;
      this.candidateSuggestionList[index2].checked = true;
      if (index === -1) {
        this.array.push(data);
      }
    } else {
      const index2 = this.candidateSuggestionList.findIndex((object) => object.skillOwnerId === data.skillOwnerId);
      this.candidateSuggestionList[index2].shortlist = false;
      this.candidateSuggestionList[index2].checked = null;
      const index = this.array.findIndex((object) => object.skillOwnerId === data.skillOwnerId);
      this.array.splice(index, 1);
    }
  }

  abc(data) {
    const index = this.array.findIndex((object) => object.skillOwnerId === data.skillOwnerId);
    const index2 = this.candidateSuggestionList.findIndex((object) => object.skillOwnerId === data.skillOwnerId);
    const input = document.getElementById(data.skillOwnerId) as HTMLInputElement | null;

    if (input != null) {
      input.checked = true;
    }
    this.candidateSuggestionList[index2].shortlist = true;
    if (index === -1) {
      this.array.push(data);
    }
  }

  cba(data) {
    const index2 = this.candidateSuggestionList.findIndex((object) => object.skillOwnerId === data.skillOwnerId);
    this.candidateSuggestionList[index2].shortlist = false;
    const index = this.array.findIndex((object) => object.skillOwnerId === data.skillOwnerId);
    this.array.splice(index, 1);
    const input = document.getElementById(data.skillOwnerId) as HTMLInputElement | null;

    if (input != null) {
      input.checked = false;
    }
  }

  requestMoreCandidates() {
    var count = 5;
    this.sum += count;
    let data = this.copyCandidateSuggestionList.slice(this.sum, this.sum + 5);
    if (data.length === 0) {
      this.ngOnInit();
      this.sum = 0;
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'No more candidates available',
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      this.candidateSuggestionList = data;
    }
  }

  rateEntry(event: Event, n: SelectionPhaseResponse): void {
    n['rate'] = parseFloat((event.target as HTMLInputElement)?.value) || 0;
  }

  onlyPrice(event: KeyboardEvent): void {
    const regex = /[0-9\\.\\]/;
    const character = String.fromCharCode(event?.charCode);
    event?.keyCode !== 8 && !regex.test(character) ? event?.preventDefault() : null;
  }
}
