import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OwnerJobHistoryComponent } from './owner-job-history/owner-job-history.component';
import { OwnerJobNotificationsComponent } from './owner-job-notifications/owner-job-notifications.component';

const routes: Routes = [
  { path: '', component: OwnerJobHistoryComponent },
  { path: 'jobsNotification/:ownerId/:jobId', component: OwnerJobNotificationsComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SkillownerHotJobsRoutingModule {}
