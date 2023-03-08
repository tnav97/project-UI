import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesJobHistoryComponent } from './employees-job-history/employees-job-history.component';
import { EmployeesJobNotificationsComponent } from './employees-job-notifications/employees-job-notifications.component';
import { EmployeesListComponent } from './employees-list/employees-list.component';

const routes: Routes = [
  { path: '', component: EmployeesListComponent },
  { path: 'jobsHistory/:id', component: EmployeesJobHistoryComponent },
  { path: 'jobsNotification/:id/:ownerId', component: EmployeesJobNotificationsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SkillpartnerHiringRoutingModule {}
