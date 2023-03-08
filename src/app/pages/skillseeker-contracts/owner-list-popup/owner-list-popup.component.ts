import { Options } from '@angular-slider/ngx-slider';
import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ContractDetails, FileResponse, Registration } from 'src/app/api/flexcub-api/models';
import { ownerImgUrl } from 'src/app/core/Constants/constant';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../authentication/authentication.service';
import { skillseekerdashboardService } from '../../skillseeker-dashboard/skillseeker-dashboard.service';
import { SkillseekerContractsService } from '../skillseeker-contracts.service';

interface SliderDetails {
  requirementPhaseList: customStepDefinition[];
  value: number;
  accepted: boolean;
  currentStage: number;
  showTicksValues: boolean;
  showSelectionBar: boolean;
  floor?: number;
  ceil?: number;
}

interface customStepDefinition {
  stage: number;
  requirementPhaseName: string;
  status: string;
  interviewedBy: string;
}

@Component({
  selector: 'app-owner-list-popup',
  templateUrl: './owner-list-popup.component.html',
  styleUrls: ['./owner-list-popup.component.scss'],
})
export class OwnerListPopupComponent implements OnInit {
  jobId: string;
  jobTitle: string;
  skillOwnerId: number;
  sliders: SliderDetails[] = [];
  currentStage: number;
  sliderList: any = [];
  isLoading: boolean = false;
  formForm: any;
  viewProcess: boolean = true;
  show: boolean = false;
  processForm: UntypedFormGroup;
  user?: Registration;
  name: string;
  surname: string;
  soImgUrl = ownerImgUrl;
  viewTextbox: boolean = false;

  @Input('skillOwnerId')
  set parentData(data: any) {
    if (data) {
      this.candidateInterviewDetails(data);
    }
  }
  constructor(
    private skillseekerDashboard: skillseekerdashboardService,
    private readonly skillseekerContractsService: SkillseekerContractsService,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }

  ngOnInit(): void {}

  onCheck(value) {
    if (value.includes('MSA')) {
      return true;
    } else {
      return false;
    }
  }
  onCheck2(value) {
    if (value.includes('SOW')) {
      return true;
    } else {
      return false;
    }
  }
  onCheck3(value) {
    if (value.includes('PO')) {
      return true;
    } else {
      return false;
    }
  }

  downloadMSA(id) {
    this.skillseekerContractsService.downloadMSA(id).subscribe(
      (res: FileResponse) => {
        this.skillseekerContractsService.downloadMSABlob(id).subscribe((res2: Blob) => {
          let url = window.URL.createObjectURL(res2);
          let a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display: none');
          a.href = url;
          a.download = res.fileType === 'application/pdf' ? `${res.fileName}.pdf` : `${res.fileName}.doc`;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
        });
      },
      (error) => {
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

  downloadSOW(id) {
    this.skillseekerContractsService.downloadSOW(id).subscribe(
      (res: FileResponse) => {
        this.skillseekerContractsService.downloadSOWBlob(id).subscribe((res2: Blob) => {
          let url = window.URL.createObjectURL(res2);
          let a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display: none');
          a.href = url;
          a.download = res.fileType === 'application/pdf' ? `${res.fileName}.pdf` : `${res.fileName}.doc`;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
        });
      },
      (error) => {
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

  downloadPO(id) {
    this.skillseekerContractsService.downloadPO(id).subscribe(
      (res: FileResponse) => {
        this.skillseekerContractsService.downloadPOBlob(id).subscribe((res2: Blob) => {
          let url = window.URL.createObjectURL(res2);
          let a = document.createElement('a');
          document.body.appendChild(a);
          a.setAttribute('style', 'display: none');
          a.href = url;
          a.download = res.fileType === 'application/pdf' ? `${res.fileName}.pdf` : `${res.fileName}.doc`;
          a.click();
          window.URL.revokeObjectURL(url);
          a.remove();
        });
      },
      (error) => {
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

  candidateInterviewDetails(skillOwnerId: number) {
    this.isLoading = true;
    this.sliderList = [];
    this.viewProcess = true;
    this.skillseekerContractsService.getListsOfContractDetails(skillOwnerId).subscribe(
      (res) => {
        const data: ContractDetails[] = res;
        this.skillseekerDashboard.downloadImage(skillOwnerId).subscribe(
          (res) => {
            data[0]['image'] = this.soImgUrl + skillOwnerId;
          },
          (err) => {
            if (err.status == 200) {
              data[0]['image'] = this.soImgUrl + skillOwnerId;
            } else {
              data[0]['image'] = `assets/images/avatar-default-skillowner.png`;
            }
          }
        );

        this.sliderList.push(data[0]);
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
        window.location.reload();
      }
    );
    this.isLoading = false;
  }

  sliderOptions(slider: SliderDetails): Options {
    {
      return {
        floor: 6,
        ceil: 5,
        vertical: true,
        rightToLeft: true,
        disabled: true,
        showTicksValues: true,
        showSelectionBar: true,
        stepsArray: slider.requirementPhaseList?.map((val) => {
          return { value: val.stage, legend: val.requirementPhaseName };
        }),
        getPointerColor: (value: any): string => {
          return '#2AE02A';
        },
        getSelectionBarColor: (value: number): string => {
          return '#2AE02A';
        },
      };
    }
  }
}
