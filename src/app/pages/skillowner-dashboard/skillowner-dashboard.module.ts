import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { MaterialModule } from 'src/app/material.module';
import { LoaderModule } from '../loader/loader.module';
import { CareerProfileComponent } from './career-profile/career-profile.component';
import { SkillownerDashboardComponent } from './skillowner-dashboard.component';
import { routing } from './skillowner-dashboard.routing';
import { SlotModule } from './slot/slot.module';

@NgModule({
  declarations: [SkillownerDashboardComponent, CareerProfileComponent],
  imports: [
    CommonModule,
    SlotModule,
    routing,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    LoaderModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
  ],
})
export class SkillownerDashboardModule {}
