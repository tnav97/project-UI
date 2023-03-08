import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkillpartnerNotificationComponent } from './skillpartner-notification.component';

const routes: Routes = [{ path: '', component: SkillpartnerNotificationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SkillpartnerNotificationRoutingModule {}
