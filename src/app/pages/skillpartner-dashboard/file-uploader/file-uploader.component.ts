import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { Registration } from 'src/app/api/flexcub-api/models';
import { fileUploadUrl } from 'src/app/core/Constants/constant';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../authentication/authentication.service';
import { SkillpartnerDashboardService } from '../skillpartner-dashboard.service';
import { FileUploaderService } from './file-uploader.service';

@Component({
  selector: 'file-uploader, [file-uploader]',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent implements OnInit {
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
  user?: Registration;
  partnerId: number;
  count: number = 0;
  fileUrl = fileUploadUrl;

  constructor(
    private uploadService: FileUploaderService,
    private readonly skillpartnerDashboardService: SkillpartnerDashboardService,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.fileInfos = this.uploadService.getFiles();
    this.authenticationService.user.subscribe((x) => (this.user = x));
    this.partnerId = this.user?.id;
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
    // for (let i = 0; i < this.selectedFiles.length; i++) {
    //   this.upload(i, this.selectedFiles[i]);
    // }
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

  submit() {
    setTimeout(() => {
      this.show = false;
    }, 1200);
  }
}
