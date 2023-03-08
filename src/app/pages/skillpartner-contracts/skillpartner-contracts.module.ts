import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaterialModule } from 'src/app/material.module';
import { SkillpartnerContractsRoutingModule } from './skillpartner-contracts-routing.module';
import { SkillpartnerContractsComponent } from './skillpartner-contracts.component';
import { SkillpartnerListItemComponent } from './skillpartner-list-item/skillpartner-list-item.component';
// import { NgxSliderModule } from '@angular-slider/ngx-slider/slider.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  declarations: [SkillpartnerContractsComponent, SkillpartnerListItemComponent],
  imports: [CommonModule, CoreModule, SkillpartnerContractsRoutingModule, MaterialModule, NgxSliderModule, ReactiveFormsModule, FormsModule],
})
export class SkillpartnerContractsModule {}
