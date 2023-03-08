import { ModuleWithProviders } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/pages.module').then((n) => n.PagesModule),
  },
];

const options: ExtraOptions = { useHash: false };
export const routing: ModuleWithProviders<RouterModule> = RouterModule.forRoot(routes, options);
