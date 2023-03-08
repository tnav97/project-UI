import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';

import { SkillpartnerNotificationRoutingModule } from './skillpartner-notification-routing.module';
import { SkillpartnerNotificationComponent } from './skillpartner-notification.component';

@NgModule({
  declarations: [SkillpartnerNotificationComponent],
  imports: [CommonModule, SkillpartnerNotificationRoutingModule, NgxPaginationModule],
})
export class SkillpartnerNotificationModule {}
