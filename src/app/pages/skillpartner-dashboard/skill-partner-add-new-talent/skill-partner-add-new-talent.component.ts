import { DatePipe } from '@angular/common';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Observable } from 'rxjs';
import { Registration } from 'src/app/api/flexcub-api/models';
import { emailRegex, excelDocViewer, fileUploadUrl, phoneRegex } from 'src/app/core/Constants/constant';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../authentication/authentication.service';
import { FileUploaderService } from '../file-uploader/file-uploader.service';
import { SkillpartnerDashboardService } from '../skillpartner-dashboard.service';
declare var $: any;

@Component({
  selector: 'app-skill-partner-add-new-talent',
  templateUrl: './skill-partner-add-new-talent.component.html',
  styleUrls: ['./skill-partner-add-new-talent.component.scss'],
  providers: [DatePipe],
})
export class SkillPartnerAddNewTalentComponent implements OnInit {
  form: UntypedFormGroup;
  today = new Date();
  bsConfig?: Partial<BsDatepickerConfig>;
  user?: Registration;
  skillPartnerId: number;
  exampleModalCenter: boolean = false;
  doc = excelDocViewer;
  selectedFiles: FileList;
  progressInfos = [];
  message = '';
  fileInfos: Observable<any>;
  imageTypeError: string = '';
  imageFileError: string = '';
  imageError: string = '';
  cardImageBase64: string;
  isImageSaved: boolean;
  fileList: number = 0;
  show: boolean = false;
  showPopup: boolean = false;
  partnerId: number;
  count: number = 0;
  fileUrl = fileUploadUrl;
  currencySymbol:string=''
  amount!:number
  priceNumber:number

  constructor(
    private readonly skillpartnerDashboardService: SkillpartnerDashboardService,
    private router: Router,
    private authenticationService: AuthenticationService,
    private uploadService: FileUploaderService,
    private datePipe: DatePipe
  ) {
    this.form = new UntypedFormGroup({
      firstName: new UntypedFormControl('', [Validators.required]),
      lastName: new UntypedFormControl('', [Validators.required]),
      dob: new UntypedFormControl('', [Validators.required]),
      email: new UntypedFormControl('', [Validators.required, Validators.email, Validators.pattern(emailRegex)]),
      phone: new UntypedFormControl('', [Validators.required, Validators.pattern(phoneRegex)]),
      altPhone: new UntypedFormControl('', Validators.pattern(phoneRegex)),
      rate: new UntypedFormControl('$', [Validators.required]),
    });
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }

  get email() {
    return this.form.get('email');
  }

  get altPhone() {
    return this.form.get('altPhone');
  }

  get phone() {
    return this.form.get('phone');
  }

  get firstName() {
    return this.form.get('firstName');
  }

  get lastName() {
    return this.form.get('lastName');
  }

  get dob() {
    return this.form.get('dob');
  }

  get rate() {
    return this.form.get('rate');
  }

  ngOnInit(): void {
    this.today.setFullYear(this.today.getFullYear() - 18);
    this.skillPartnerId = this.user?.id;

  }

  onReset(): void {
    this.form.reset();
  }

  public downloadSP(): void {
    this.skillpartnerDashboardService.getSpTemplate().subscribe(
      (response) => {
        let blob: Blob = response as Blob;
        var url = window.URL.createObjectURL(new Blob([response]));
        let a = document.createElement('a');
        a.href = url;
        a.setAttribute('download', `sampleTemplate.doc`);
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

  keyPressNumbers(event) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  submit() {
    if (!this.form.valid) return;
    const priceString = this.form.value.rate;
    this.priceNumber = parseFloat(priceString.substring(1)); // remove "$" and parse as number
    console.log(this.priceNumber);
    var request = {
      skillPartnerEntity: {
        skillPartnerId: this.skillPartnerId,
      },
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      dob: this.datePipe.transform(this.form.value.dob, 'yyyy-MM-dd'),
      primaryEmail: this.form.value.email,
      phoneNumber: this.form.value.phone,
      alternatePhoneNumber: this.form.value.altPhone,
      rateCard: this.priceNumber
    };
    var array = [];
    array.push(request);

    this.skillpartnerDashboardService.insertDetails5(array).subscribe(
      (data) => {
        this.showPopup = true;
        //
        $('#AddNewTalent-popup').modal('show');
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
  closePopup() {
    this.showPopup = false;
    $('#AddNewTalent-popup').modal('hide');
  }

  selectFiles(event) {
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
  }
  uploadFiles() {
    this.message = '';
    this.count += this.selectedFiles.length;

    if (this.selectedFiles.length > 3 || this.count > 3) {
      return;
    }
    for (let i = 0; i < this.selectedFiles.length; i++) {
      if (this.selectedFiles[i].size > 1024000) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'filesize is morethan 1mb',
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        this.upload(i, this.selectedFiles[i]);
      }
    }
  }
  upload(idx, file) {
    this.progressInfos[idx] = { value: 0, fileName: file.name };
    this.skillpartnerDashboardService.uploadExcel(file).subscribe(
      (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progressInfos[idx].value = Math.round((100 * event.loaded) / event.total);
        } else if (event instanceof HttpResponse) {
          this.fileInfos = this.uploadService.getFiles();
        }
      },
      (err) => {
        this.progressInfos[idx].value = 0;
        this.message = 'Could not upload the file:' + file.name;
      }
    );
  }

  fileChangeEvent(fileInput: any) {
    this.imageError = '';
    this.imageFileError = '';
    this.imageTypeError = '';
    this.fileList = fileInput.files.length;

    if (fileInput.files && fileInput.files[0]) {
      const max_size = 1024000;
      const allowed_types = ['application/vnd.ms-excel', '.csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      const max_height = 15200;
      const max_width = 25600;

      if (fileInput.files.length > 3) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'There are more than 3 files',
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
        // this.imageFileError = 'We can not upload more than 3 files';
        return;
      }

      if (fileInput.files[0].size > max_size) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'filesize is morethan 1mb',
          showConfirmButton: false,
          timer: 1500,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1200);
        this.imageError = 'Maximum size allowed is ' + max_size / 1000 + 'Mb';
        return false;
      }

      if (!_.includes(allowed_types, fileInput.files[0].type)) {
        this.imageTypeError = 'Only Files are allowed ( Excel | CSV )';
        return false;
      }
      if (this.imageFileError == '' && this.imageTypeError == '' && this.imageError == '') {
        this.show = true;
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: fileInput.files.length + ' Files Imported Successfully',
          // text: 'Something went wrong!',
          showConfirmButton: true,
          timer: 1500,
        });
      }
    }
  }

  removeImage() {
    this.cardImageBase64 = null;
    this.isImageSaved = false;
  }

  submit2() {
    setTimeout(() => {
      this.show = false;
    }, 1200);
  }
}
