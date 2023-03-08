import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';

import { SkillseekerNotificationRoutingModule } from './skillseeker-notification-routing.module';
import { SkillseekerNotificationComponent } from './skillseeker-notification.component';

@NgModule({
  declarations: [SkillseekerNotificationComponent],
  imports: [CommonModule, SkillseekerNotificationRoutingModule, NgxPaginationModule],
})
export class SkillseekerNotificationModule {}
