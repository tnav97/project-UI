import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, first } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../authentication/authentication.service';
import { skillseekerdashboardService } from '../skillseeker-dashboard.service';

declare var $: any;
@Component({
  selector: 'app-po',
  templateUrl: './po.component.html',
  styleUrls: ['./po.component.scss'],
  providers: [DatePipe],
})
export class PoComponent implements OnInit {
  downloadId!: number;
  projectname: any;
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
  domainList: any;
  seekerId: any;
  projectName: any;
  departmentname: any;
  user: any;
  signShow: boolean = false;
  form1!: UntypedFormGroup;
  preview: boolean = false;
  today: Date = new Date();
  todayWithPipe: any;
  progressValue: number = 0;

  @ViewChild('sendPOModal') sendPOModal: ElementRef;
  constructor(
    private readonly skillseekerdashboard: skillseekerdashboardService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly authnticationService: AuthenticationService,
    private readonly router: Router,
    private datePipe: DatePipe
  ) {
    this.authnticationService.user.subscribe((x) => (this.user = x));
    this.form1 = new UntypedFormGroup({
      department: new UntypedFormControl('', Validators.required),
      project: new UntypedFormControl('', Validators.required),
      candidateName: new UntypedFormControl({ value: '', disabled: true }, Validators.required),
      role: new UntypedFormControl({ value: '', disabled: true }, Validators.required),
    });
    this.todayWithPipe = this.datePipe.transform(Date.now(), 'dd/MM/yyyy');
  }

  ngOnInit(): void {
    this.seekerId = this.user?.id;
    this.skillSeekerByAdmin();
    this.getQueryParams();
    this.getDomainList();
    this.getSeekerProjectDetails();
    this.form1.controls['candidateName'].setValue(this.skillOwnerName);
    this.form1.controls['Role'].setValue(this.skillOwnerRole);
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
  back(i): void {
    this.step = i;
  }

  remove(id: any) {
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
  clientChange(event) {
    this.getProjectDropdownData(this.form1.value.clientId.id);
  }
  getProjectDropdownData(clientId: any) {
    //if(this.clientId){
    this.skillseekerdashboard.getProjectDropdownData(clientId).subscribe((response) => {
      this.projectDropDownData = response;
      //
    });
    //}
  }
  projectChange() {
    this.projectname = this.form1.value.project.title.toString();
  }

  departmentChange() {
    this.departmentname = this.form1.value.department.domainValues.toString();
  }

  getDomainList(): void {
    this.authnticationService.getDomainList().subscribe((response) => {
      this.domainList = response;
    });
  }

  send() {
    this.skillseekerdashboard
      .uploadFilePO(
        this.seekerId,
        this.form1.get('project').value.id,
        this.skillOwnerId,
        this.form1.get('role').value,
        this.form1.get('department').value.domainId,
        this.skillOwnerJobId,
        this.Agreefilestemp[0].agreementfile
      )
      .subscribe(
        (response) => {
          this.signShow = true;
          $('#sendPOModal').modal('show');
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

  getSeekerProjectDetails(): void {
    this.authnticationService.getSeekerProjectDetails(this.seekerId).subscribe((response) => {
      this.projectName = response;
    });
  }

  close() {
    $('#sendPOModal').modal('hide');
    this.router.navigate([`/ssContracts/list`]);
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
        title: 'File uploaded Successfully',
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
  public downloadPo(): void {
    this.skillseekerdashboard.getPoTemplate().subscribe(
      (response) => {
        let blob: Blob = response as Blob;
        var url = window.URL.createObjectURL(new Blob([response]));
        let a = document.createElement('a');
        a.href = url;
        a.setAttribute('download', `skillseeker_PO_template.doc`);
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
