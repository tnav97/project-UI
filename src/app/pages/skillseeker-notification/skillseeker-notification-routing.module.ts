import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkillseekerNotificationComponent } from './skillseeker-notification.component';

const routes: Routes = [{ path: '', component: SkillseekerNotificationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SkillseekerNotificationRoutingModule {}
