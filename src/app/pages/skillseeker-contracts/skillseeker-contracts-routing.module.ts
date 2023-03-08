import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListOfContractsComponent } from './list-of-contracts/list-of-contracts.component';
import { OnBoardingComponent } from './on-boarding/on-boarding.component';
import { SkillseekerContractsComponent } from './skillseeker-contracts.component';

const routes: Routes = [
  { path: '', component: SkillseekerContractsComponent },
  { path: 'list', component: ListOfContractsComponent },
  { path: 'onboard/:id', component: OnBoardingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SkillseekerContractsRoutingModule {}
