import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CareerProfileComponent } from './career-profile/career-profile.component';
import { SkillownerDashboardComponent } from './skillowner-dashboard.component';
import { SlotComponent } from './slot/slot.component';

const routes: Routes = [
  { path: '', component: SkillownerDashboardComponent },
  { path: 'careerProfile', component: CareerProfileComponent },
  { path: 'slot', component: SlotComponent },
];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
