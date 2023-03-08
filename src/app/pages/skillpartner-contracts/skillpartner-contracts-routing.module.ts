import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkillpartnerContractsComponent } from './skillpartner-contracts.component';

const routes: Routes = [{ path: '', component: SkillpartnerContractsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SkillpartnerContractsRoutingModule {}
