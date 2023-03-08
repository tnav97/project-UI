import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateAgreeComponent } from './create-agree/create-agree.component';
import { CreateProjectsComponent } from './create-projects/create-projects.component';
import { CreateTaskComponent } from './create-task/create-task.component';
import { JobsCandidateSuggestionsComponent } from './jobs-candidate-suggestions/jobs-candidate-suggestions.component';
import { ListItemsNotificationComponent } from './list-items-notification/list-items-notification.component';
import { ListItemsComponent } from './list-items/list-items.component';
import { MsaLandingComponent } from './msa-landing/msa-landing.component';
import { PoLandingComponent } from './po-landing/po-landing.component';
import { PoComponent } from './po/po.component';
import { RatedetailsComponent } from './ratedetails/ratedetails.component';
import { SkillseekerCreateNewJobComponent } from './skillseeker-create-new-job/skillseeker-create-new-job.component';
import { SkillseekerDashboardComponent } from './skillseeker-dashboard.component';
import { SkillseekerDescribejobComponent } from './skillseeker-describejob/skillseeker-describejob.component';
import { SkillseekerExperienceComponent } from './skillseeker-experience/skillseeker-experience.component';
import { SkillseekerHiringPriorityComponent } from './skillseeker-hiring-priority/skillseeker-hiring-priority.component';
import { SkillseekerHiringComponent } from './skillseeker-hiring/skillseeker-hiring.component';
import { SkillseekerJoblistComponent } from './skillseeker-joblist/skillseeker-joblist.component';
import { SkillseekerbasicinfoComponent } from './skillseekerbasicinfo/skillseekerbasicinfo.component';
import { SowLandingComponent } from './sow-landing/sow-landing.component';
import { SowComponent } from './sow/sow.component';
import { ViewProComponent } from './view-pro/view-pro.component';
import { WidgetComponent } from './widget/widget.component';

const routes: Routes = [
  { path: '', component: SkillseekerDashboardComponent },
  { path: 'joblist', component: SkillseekerJoblistComponent },
  { path: 'createjob', component: SkillseekerCreateNewJobComponent }, //1
  { path: 'basicinfo', component: SkillseekerbasicinfoComponent }, //2
  { path: 'hiring', component: SkillseekerHiringComponent }, //4
  { path: 'hiringPriority', component: SkillseekerHiringPriorityComponent }, //6
  { path: 'experience', component: SkillseekerExperienceComponent }, //5
  { path: 'describejob', component: SkillseekerDescribejobComponent }, //3
  { path: 'ratedetails', component: RatedetailsComponent },
  {
    path: 'candidatesuggestion/jobId/:jobId',
    component: JobsCandidateSuggestionsComponent,
  },
  { path: 'ListItems/jobId/:jobId', component: ListItemsComponent },

  { path: 'widgets/jobId/:jobId', component: WidgetComponent },
  { path: 'msaLanding', component: MsaLandingComponent },
  { path: 'createagree', component: CreateAgreeComponent },
  { path: 'createproject', component: CreateProjectsComponent },
  { path: 'createtask', component: CreateTaskComponent },
  { path: 'sow/skillowner', component: SowComponent },
  { path: 'sowLanding', component: SowLandingComponent },
  { path: 'poLanding', component: PoLandingComponent },
  { path: 'po-process/skillowner', component: PoComponent },
  { path: 'notifications/:ownerId/:jobId', component: ListItemsNotificationComponent },
  { path: 'viewPro', component: ViewProComponent },
];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
