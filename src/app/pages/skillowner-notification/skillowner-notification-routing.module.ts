import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkillownerNotificationComponent } from './skillowner-notification.component';

const routes: Routes = [{ path: '', component: SkillownerNotificationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SkillownerNotificationRoutingModule {}
