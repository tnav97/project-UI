import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MaterialModule } from 'src/app/material.module';
import { OwnerJobHistoryComponent } from './owner-job-history/owner-job-history.component';
import { OwnerJobNotificationsComponent } from './owner-job-notifications/owner-job-notifications.component';
import { SkillownerHotJobsRoutingModule } from './skillowner-hot-jobs-routing.module';
import { SkillownerHotJobsComponent } from './skillowner-hot-jobs.component';

import { customHotJobsPipe } from 'src/app/core/Pipes/search.pipe';

@NgModule({
  declarations: [SkillownerHotJobsComponent, OwnerJobHistoryComponent, OwnerJobNotificationsComponent, customHotJobsPipe],
  imports: [CommonModule, SkillownerHotJobsRoutingModule, MaterialModule, ReactiveFormsModule, FormsModule, NgxPaginationModule],
})
export class SkillownerHotJobsModule {}
