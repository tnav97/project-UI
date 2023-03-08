import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxPaginationModule } from 'ngx-pagination';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material.module';
import { EmployeesJobHistoryComponent } from './employees-job-history/employees-job-history.component';
import { EmployeesJobNotificationsComponent } from './employees-job-notifications/employees-job-notifications.component';
import { EmployeesListComponent } from './employees-list/employees-list.component';
import { SkillpartnerHiringRoutingModule } from './skillpartner-hiring-routing.module';
import { SkillpartnerHiringComponent } from './skillpartner-hiring.component';

@NgModule({
  declarations: [
    SkillpartnerHiringComponent,
    EmployeesListComponent,
    EmployeesJobHistoryComponent,
    EmployeesJobNotificationsComponent,
  ],
  imports: [CommonModule,CoreModule, SkillpartnerHiringRoutingModule, MaterialModule, ReactiveFormsModule, FormsModule, NgxPaginationModule,TabsModule,CoreModule],
})
export class SkillpartnerHiringModule {}
