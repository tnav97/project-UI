import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkillPartnerAddNewTalentComponent } from './skill-partner-add-new-talent/skill-partner-add-new-talent.component';
import { SkillpartnerDashboardComponent } from './skillpartner-dashboard.component';

const routes: Routes = [
  { path: '', component: SkillpartnerDashboardComponent },
  { path: 'addTalent', component: SkillPartnerAddNewTalentComponent },
];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
