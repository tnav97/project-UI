import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, first } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../authentication/authentication.service';
import { skillseekerdashboardService } from '../skillseeker-dashboard.service';

declare var $: any;

@Component({
  selector: 'app-sow',
  templateUrl: './sow.component.html',
  styleUrls: ['./sow.component.scss'],
  providers: [DatePipe],
})
export class SowComponent implements OnInit {
  downloadId!: number;
  projectname: string = '';
  departmentname: any;
  src: any;

  step: number = 1;
  clientDropDownData: any;
  projectDropDownData: any;
  downloadres: any;
  default = { id: 0, title: 'Default' };
  defaultDepartment = { domainId: 0, domainValues: 'Default' };
  num1: number = 0;
  agreeDocs: any = new UntypedFormGroup({
    agreeDocument: new UntypedFormControl(''),
  });
  Agreefilestemp: KeyValue[] = [];
  selected: any;
  file2: boolean = false;
  form1: UntypedFormGroup = new UntypedFormGroup({
    department: new UntypedFormControl('', Validators.required),
    project: new UntypedFormControl('', Validators.required),
    candidateName: new UntypedFormControl({ value: '', disabled: true }, Validators.required),
    role: new UntypedFormControl({ value: '', disabled: true }, Validators.required),
  });
  openModal = false;
  clientid: number;
  projectid: number;
  uploadData: FormData;
  agreeDocument: FormData;
  download1: any;
  file1: boolean = false;
  tabledata: any;
  newTableData: any;
  skillOwnerParams: any;
  skillownersplited: any;
  skillOwnerName: any;
  skillOwnerJobId: any;
  skillOwnerId: any;
  skillOwnerRole: any;
  projectName: any;
  domainList: any;
  user: any;
  seekerId: any;
  preview: boolean = false;
  signShow: boolean = false;
  todayWithPipe: any;
  progressValue: number = 0;

  constructor(
    private readonly skillseekerdashboard: skillseekerdashboardService,
    private readonly authnticationService: AuthenticationService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private datePipe: DatePipe
  ) {
    this.authnticationService.user.subscribe((x) => (this.user = x));
  }

  ngOnInit(): void {
    this.seekerId = this.user?.id;
    this.todayWithPipe = this.datePipe.transform(Date.now(), 'dd/MM/yyyy');
    this.skillSeekerByAdmin();
    this.getQueryParams();
    this.getDomainList();
    this.getSeekerProjectDetails();
  }

  getQueryParams() {
    this.activatedRoute.queryParams
      .pipe(
        filter((param: Params) => !!param && !!param?.jobId && !!param?.skillOwnerId),
        first()
      )
      .subscribe((param: Params) => {
        this.skillOwnerJobId = param?.jobId;
        this.skillOwnerId = param?.skillOwnerId;

        this.skillseekerdashboard.candidateInterviewDetails(this.skillOwnerJobId, this.skillOwnerId).subscribe((res) => {
          this.skillOwnerRole = res?.jobTitle;
          this.skillOwnerName = res?.skillOwnerName;
          this.form1.controls['role'].setValue(this.skillOwnerRole);
          this.form1.controls['candidateName'].setValue(this.skillOwnerName);
        });
      });
  }

  back(i): void {
    this.step = i;
  }

  getDomainList(): void {
    this.authnticationService.getDomainList().subscribe((response) => {
      this.domainList = response;
    });
  }

  getSeekerProjectDetails(): void {
    this.authnticationService.getSeekerProjectDetails(this.seekerId).subscribe((response) => {
      this.projectName = response;
    });
  }

  agreefile(event: any) {
    for (var i = 0; i < event.target.files.length; i++) {
      for (var j = 0; j < this.Agreefilestemp.length; j++) {
        if (event.target.files[i].name == this.Agreefilestemp[j].agreementfile.name) {
          this.num1 = 2;
        }
      }
    }

    if (this.num1 == 0) {
      for (var i = 0; i < event.target.files.length; i++) {
        if (
          event.target.files[i].type == 'application/pdf' ||
          event.target.files[i].type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) {
          this.Agreefilestemp.push({ agreementfile: event.target.files[i] });
        } else {
        }
      }
    } else {
      this.num1 = 0;
    }

    this.file2 = true;
  }

  next(i): void {
    this.step = i;
  }

  remove(id: any) {
    this.progressValue = 0;
    if (this.Agreefilestemp.length == 1) {
      this.Agreefilestemp = [];
      // this.agreeDocs.reset();
      this.file2 = false;
    } else {
      this.Agreefilestemp.splice(id, 1);
    }
  }

  skillSeekerByAdmin(): void {
    this.skillseekerdashboard.skillSeekerByAdmin().subscribe((response) => {
      this.clientDropDownData = response;
    });
  }
  projectChange() {
    this.projectname = this.form1.value.project.title.toString();
  }

  departmentChange() {
    this.departmentname = this.form1.value.department.domainValues.toString();
  }

  getProjectDropdownData(clientId: any) {
    //if(this.clientId){
    this.skillseekerdashboard.getProjectDropdownData(clientId).subscribe((response) => {
      this.projectDropDownData = response;
      //
    });
    //}
  }

  close() {
    $('#sendSOWModal').modal('hide');
    this.router.navigate([`/ssContracts/list`]);
  }

  send() {
    this.skillseekerdashboard
      .uploadFileSOW(
        this.skillOwnerId,
        this.seekerId,
        this.form1.get('department').value.domainId,
        this.form1.get('role').value,
        this.form1.get('project').value.id,
        this.skillOwnerJobId,
        this.Agreefilestemp[0].agreementfile
      )
      .subscribe(
        (response) => {
          this.signShow = true;
          $('#sendSOWModal').modal('show');
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

  upload() {
    if (this.Agreefilestemp.length) {
      for (var i = 0; i < this.Agreefilestemp.length; i++) {
        this.postOtherfile(i);
      }
      this.preview = true;
      for (var i = 0; i <= 100; i++) {
        this.progressValue = i;
      }
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'File uploaded successfully',
        showConfirmButton: true,
        timer: 1500,
      });
    }
  }
  postOtherfile(i) {
    this.agreeDocument = new FormData();

    this.agreeDocument.append('document', this.Agreefilestemp[i].agreementfile, this.Agreefilestemp[i].agreementfile.name);
    let $img: any = document.querySelector('#agreefile');
    let reader = new FileReader();

    reader.onload = (e: any) => {
      this.src = e.target.result;
    };
    reader.readAsArrayBuffer($img.files[0]);
  }

  public download(): void {
    this.skillseekerdashboard.downloadAgreement(this.downloadId).subscribe((response) => {
      this.download1 = response;
      let fileName = this.Agreefilestemp[0].agreementfile.name;
      let blob: Blob = response as Blob;
      let a = document.createElement('a');
      a.download = fileName;
      a.href = window.URL.createObjectURL(blob);
      a.click();
    });
    //
  }
  public downloadSow(): void {
    this.skillseekerdashboard.getSowTemplate().subscribe(
      (response) => {
        let blob: Blob = response as Blob;
        var url = window.URL.createObjectURL(new Blob([response]));
        let a = document.createElement('a');
        a.href = url;
        a.setAttribute('download', `skillseeker_SOW_template.doc`);
        document.body.appendChild(a);
        a.click();
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
    //
  }

  selectionphase() {
    this.router.navigate(['/ssdashboard/ListItems/jobId/', this.skillOwnerJobId]);
  }
}

interface KeyValue {
  agreementfile: any;
}
