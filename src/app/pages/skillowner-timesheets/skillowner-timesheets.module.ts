import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material.module';
import { SkillownerTimesheetsRoutingModule } from './skillowner-timesheets-routing.module';
import { SkillownerTimesheetsComponent } from './skillowner-timesheets.component';

@NgModule({
  declarations: [SkillownerTimesheetsComponent],
  imports: [
    CommonModule,
    BsDatepickerModule.forRoot(),
    SkillownerTimesheetsRoutingModule,
    MaterialModule,
    CoreModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class SkillownerTimesheetsModule {}
