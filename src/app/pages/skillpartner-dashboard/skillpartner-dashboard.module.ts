import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { FileUploadInputForDirective } from 'src/app/core/Directives/FileUploadInputForDirective.directive';
import { BytesPipe } from 'src/app/core/Pipes/bytes.pipe';
import { MaterialModule } from 'src/app/material.module';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { MatFileUploadQueueComponent } from './mat-file-upload-queue/mat-file-upload-queue.component';
import { MatFileUploadComponent } from './mat-file-upload/mat-file-upload.component';
import { SkillPartnerAddNewTalentComponent } from './skill-partner-add-new-talent/skill-partner-add-new-talent.component';
import { SkillpartnerDashboardComponent } from './skillpartner-dashboard.component';
import { routing } from './skillpartner-dashboard.routing';

@NgModule({
  declarations: [
    SkillpartnerDashboardComponent,
    SkillPartnerAddNewTalentComponent,
    FileUploaderComponent,
    MatFileUploadQueueComponent,
    MatFileUploadComponent,
    BytesPipe,
    FileUploadInputForDirective,
  ],
  imports: [CommonModule, routing, MaterialModule, ReactiveFormsModule, NgxDocViewerModule, BsDatepickerModule.forRoot()],
})
export class SkillpartnerDashboardModule {}
