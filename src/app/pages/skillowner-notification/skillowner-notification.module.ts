import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { SkillownerNotificationRoutingModule } from './skillowner-notification-routing.module';
import { SkillownerNotificationComponent } from './skillowner-notification.component';

@NgModule({
  declarations: [SkillownerNotificationComponent],
  imports: [CommonModule, SkillownerNotificationRoutingModule, NgxPaginationModule],
})
export class SkillownerNotificationModule {}
