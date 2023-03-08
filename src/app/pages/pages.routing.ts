import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/helpers/auth.guard';
import { Role } from '../core/models';
import { PagesComponent } from './pages.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./authentication/authentication.module').then((n) => n.AuthenticationModule),
  },
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'ssdashboard',
        loadChildren: () => import('./skillseeker-dashboard/skillseekerDashboard.module').then((n) => n.SkillseekerDashboardModule),
        canActivate: [AuthGuard],
        data: { roles: [Role.Seeker] },
      },
      {
        path: 'ssContracts',
        loadChildren: () => import('./skillseeker-contracts/skillseeker-contracts.module').then((n) => n.SkillseekerContractsModule),
        canActivate: [AuthGuard],
        data: { roles: [Role.Seeker] },
      },
      {
        path: 'ssInvoice',
        loadChildren: () => import('./skillseeker-invoice/skillseeker-invoice.module').then((n) => n.SkillseekerInvoiceModule),
        canActivate: [AuthGuard],
        data: { roles: [Role.Seeker] },
      },
      {
        path: 'seekerNotification',
        loadChildren: () => import('./skillseeker-notification/skillseeker-notification.module').then((n) => n.SkillseekerNotificationModule),
        canActivate: [AuthGuard],
        data: { roles: [Role.Seeker] },
      },
      {
        path: 'seekerRoles',
        loadChildren: () => import('./skillseeker-roles/skillseeker-roles.module').then((n) => n.SkillseekerRolesModule),
        canActivate: [AuthGuard],
        data: { roles: [Role.Seeker] },
      },
      {
        path: 'spdashboard',
        loadChildren: () => import('./skillpartner-dashboard/skillpartner-dashboard.module').then((n) => n.SkillpartnerDashboardModule),
        canActivate: [AuthGuard],
        data: { roles: [Role.Partner] },
      },
      {
        path: 'spHiring',
        loadChildren: () => import('./skillpartner-hiring/skillpartner-hiring.module').then((n) => n.SkillpartnerHiringModule),
        canActivate: [AuthGuard],
        data: { roles: [Role.Partner] },
      },
      {
        path: 'spContracts',
        loadChildren: () => import('./skillpartner-contracts/skillpartner-contracts.module').then((n) => n.SkillpartnerContractsModule),
        canActivate: [AuthGuard],
        data: { roles: [Role.Partner] },
      },
      {
        path: 'spInvoice',
        loadChildren: () => import('./skillpartner-invoice/skillpartner-invoice.module').then((n) => n.SkillpartnerInvoiceModule),
        canActivate: [AuthGuard],
        data: { roles: [Role.Partner] },
      },
      {
        path: 'sodashboard',
        loadChildren: () => import('./skillowner-dashboard/skillowner-dashboard.module').then((n) => n.SkillownerDashboardModule),
        canActivate: [AuthGuard],
        data: { roles: [Role.Owner] },
      },
      {
        path: 'ownerNotification',
        loadChildren: () => import('./skillowner-notification/skillowner-notification.module').then((n) => n.SkillownerNotificationModule),
        canActivate: [AuthGuard],
        data: { roles: [Role.Owner] },
      },
      {
        path: 'soHotJobs',
        loadChildren: () => import('./skillowner-hot-jobs/skillowner-hot-jobs.module').then((n) => n.SkillownerHotJobsModule),
        canActivate: [AuthGuard],
        data: { roles: [Role.Owner] },
      },
      {
        path: 'soTimesheet',
        loadChildren: () => import('./skillowner-timesheets/skillowner-timesheets.module').then((n) => n.SkillownerTimesheetsModule),
        canActivate: [AuthGuard],
        data: { roles: [Role.Owner] },
      },
      {
        path: 'partnerNotification',
        loadChildren: () => import('./skillpartner-notification/skillpartner-notification.module').then((n) => n.SkillpartnerNotificationModule),
        canActivate: [AuthGuard],
        data: { roles: [Role.Partner] },
      },
      {
        path: 'superadmin',
        loadChildren: () => import('./super-admin/super-admin.module').then((n) => n.SuperAdminModule),
        canActivate: [AuthGuard],
        data: { roles: [Role.SsAdmin, Role.SuperAdmin] },
      },
    ],
  },
];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forChild(routes);
