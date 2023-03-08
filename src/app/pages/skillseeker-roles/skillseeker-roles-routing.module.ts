import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddroleComponent } from './addrole/addrole.component';
import { SeekerlistComponent } from './seekerlist/seekerlist.component';
import { SkillseekerRolesComponent } from './skillseeker-roles.component';
import { UsermapComponent } from './usermap/usermap.component';

const routes: Routes = [
  { path: '', component: SeekerlistComponent },
  { path: 'addrole', component: AddroleComponent },
  { path: 'usermap', component: UsermapComponent },
  { path: 'rolelist', component: SkillseekerRolesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SkillseekerRolesRoutingModule {}
