import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CoreModule } from 'src/app/core/core.module';
import { SearchPipe } from 'src/app/core/Pipes/filter.pipe';
// import { FilterPipe, SearchPipe } from 'src/app/core/Pipes/filter.pipe';
import { MaterialModule } from 'src/app/material.module';
import { LoaderModule } from '../loader/loader.module';
import { ListOfContractsComponent } from './list-of-contracts/list-of-contracts.component';
import { OnBoardingComponent } from './on-boarding/on-boarding.component';
import { OwnerListPopupComponent } from './owner-list-popup/owner-list-popup.component';
import { SkillseekerContractsRoutingModule } from './skillseeker-contracts-routing.module';
import { SkillseekerContractsComponent } from './skillseeker-contracts.component';
import { SkillseekerContractsService } from './skillseeker-contracts.service';

@NgModule({
  declarations: [SkillseekerContractsComponent, ListOfContractsComponent, OwnerListPopupComponent, OnBoardingComponent],
  imports: [
    LoaderModule,
    CoreModule,
    CommonModule,
    SkillseekerContractsRoutingModule,
    MaterialModule,
    NgxSliderModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
  ],
  providers: [SkillseekerContractsService],
})
export class SkillseekerContractsModule {}
