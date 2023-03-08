import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, first } from 'rxjs/operators';
import { Registration } from 'src/app/api/flexcub-api/models';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../authentication/authentication.service';
import { skillseekerdashboardService } from '../skillseeker-dashboard.service';
declare var window: any;
declare var $: any;

@Component({
  selector: 'app-create-agree',
  templateUrl: './create-agree.component.html',
  styleUrls: ['./create-agree.component.scss'],
  providers: [DatePipe],
})
export class CreateAgreeComponent implements OnInit {
  downloadId!: number;
  clientname: any;
  src: any;
  user?: Registration;
  step: number = 1;
  clientDropDownData: any;
  projectDropDownData: any;
  downloadres: any;
  default = { id: 0, title: 'Default' };
  num1: number = 0;
  agreeDocs: any = new UntypedFormGroup({
    agreeDocument: new UntypedFormControl(''),
  });
  Agreefilestemp: KeyValue[] = [];
  selected: any;
  file2: boolean = false;
  form1: UntypedFormGroup = new UntypedFormGroup({
    ClientName: new UntypedFormControl({ value: '', disabled: true }, Validators.required),
    project: new UntypedFormControl('', Validators.required),
  });
  seekerId: number;
  buisnessName: string;
  clientid: number;
  projectid: number;
  uploadData: FormData;
  agreeDocument: FormData;
  download1: any;
  file1: boolean = false;
  preview: boolean = false;
  todayWithPipe: any;
  signShow = 'none';
  projectname: string;
  formModal: any;

  skillOwnerParams: any;
  skillownersplited: any;
  skillOwnerJobId: any;
  skillOwnerId: any;
  progressValue: number = 0;

  constructor(
    private readonly skillseekerdashboard: skillseekerdashboardService,
    private authenticationService: AuthenticationService,
    private readonly router: Router,
    private datePipe: DatePipe,
    private readonly activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }

  ngOnInit(): void {
    this.buisnessName = this.user?.businessName;
    this.getQueryParams();
    this.seekerId = this.user?.id;
    this.getProjectDropdownData(this.seekerId);
    this.form1.controls['ClientName'].setValue(this.buisnessName);
    this.todayWithPipe = this.datePipe.transform(Date.now(), 'dd/MM/yyyy');
    this.formModal = new window.bootstrap.Modal(document.getElementById('exampleModal'));
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
          event.target.files[i].type == 'application/msword' ||
          event.target.files[i].type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
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

  getQueryParams() {
    this.activatedRoute.queryParams
      .pipe(
        filter((param: Params) => !!param && !!param?.jobId && !!param?.skillOwnerId),
        first()
      )
      .subscribe((param: Params) => {
        this.skillOwnerJobId = param.jobId;
        this.skillOwnerId = param.skillOwnerId;
      });
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

  close() {
    $('#signMsaModal').modal('hide');
    this.router.navigate([`/ssContracts/list`]);
  }

  projectChange() {
    this.projectname = this.form1.value.project.title.toString();
  }

  clientChange(event) {
    this.getProjectDropdownData(this.form1.value.clientId.id);
  }
  getProjectDropdownData(clientId: any) {
    this.skillseekerdashboard.getProjectDropdownData(clientId).subscribe((response) => {
      this.projectDropDownData = response;
    });
  }

  public downloadMsa(): void {
    this.skillseekerdashboard.getMsaTemplate().subscribe(
      (response) => {
        let blob: Blob = response as Blob;
        var url = window.URL.createObjectURL(new Blob([response]));
        let a = document.createElement('a');
        a.href = url;
        a.setAttribute('download', `skillseeker_MSA_template.doc`);
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

  send() {
    this.skillseekerdashboard
      .uploadFile(this.seekerId, this.form1.get('project').value.id, this.skillOwnerJobId, this.skillOwnerId, this.Agreefilestemp[0].agreementfile)
      .subscribe(
        (response) => {
          this.signShow = 'block';
          this.cdr.detectChanges();
          $('#signMsaModal').modal('show');
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

  selectionbar() {
    this.router.navigate(['/ssdashboard/ListItems/jobId/', this.skillOwnerJobId]);
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
}
interface KeyValue {
  agreementfile: any;
}
