import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgFlowchartModule } from '@joelwenzel/ng-flowchart';
import { AutoCompleteModule } from 'angular-ngx-autocomplete';
import { GojsAngularModule } from 'gojs-angular';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { QuillModule } from 'ngx-quill';
import { CoreModule } from 'src/app/core/core.module';
import { AutofocusDirective } from 'src/app/core/Directives/autofocus.directive';
import { OrderByPipe } from 'src/app/core/Pipes/order-by.pipe';
import { ReversePipe } from 'src/app/core/Pipes/reverse.pipe';
import { customSearchPipe } from 'src/app/core/Pipes/search.pipe';
import { SortByTaskPipe } from 'src/app/core/Pipes/task.pipe';
import { MaterialModule } from 'src/app/material.module';
import { LoaderModule } from '../loader/loader.module';
import { CreateAgreeComponent } from './create-agree/create-agree.component';
import { CreateProjectsComponent } from './create-projects/create-projects.component';
import { CreateTaskComponent } from './create-task/create-task.component';
import { EditInputComponent } from './edit-input/edit-input.component';
import { JobsCandidateSuggestionsComponent } from './jobs-candidate-suggestions/jobs-candidate-suggestions.component';
import { ListItemsEditComponent } from './list-items-edit/list-items-edit.component';
import { ListItemsNotificationComponent } from './list-items-notification/list-items-notification.component';
import { ListItemsPopupComponent } from './list-items-popup/list-items-popup.component';
import { ListItemsComponent } from './list-items/list-items.component';
import { MsaLandingComponent } from './msa-landing/msa-landing.component';
import { PoLandingComponent } from './po-landing/po-landing.component';
import { PoComponent } from './po/po.component';
import { RatedetailsComponent } from './ratedetails/ratedetails.component';
import { SearchComponent } from './search/search.component';
import { SkillseekerCreateNewJobComponent } from './skillseeker-create-new-job/skillseeker-create-new-job.component';
import { SkillseekerDashboardComponent } from './skillseeker-dashboard.component';
import { skillseekerdashboardService } from './skillseeker-dashboard.service';
import { SkillseekerDescribejobComponent } from './skillseeker-describejob/skillseeker-describejob.component';
import { SkillseekerExperienceComponent } from './skillseeker-experience/skillseeker-experience.component';
import { SkillseekerHiringPriorityComponent } from './skillseeker-hiring-priority/skillseeker-hiring-priority.component';
import { SkillseekerHiringComponent } from './skillseeker-hiring/skillseeker-hiring.component';
import { SkillseekerJoblistComponent } from './skillseeker-joblist/skillseeker-joblist.component';
import { SkillseekerbasicinfoComponent } from './skillseekerbasicinfo/skillseekerbasicinfo.component';
import { routing } from './skillseekerDashboard.routing';
import { SowLandingComponent } from './sow-landing/sow-landing.component';
import { SowComponent } from './sow/sow.component';
import { ViewProComponent } from './view-pro/view-pro.component';
import { WidgetComponent } from './widget/widget.component';

@NgModule({
  declarations: [
    SkillseekerDashboardComponent,
    SkillseekerJoblistComponent,
    SkillseekerCreateNewJobComponent,
    SkillseekerbasicinfoComponent,
    SkillseekerDescribejobComponent,
    SkillseekerHiringComponent,
    SkillseekerExperienceComponent,
    SkillseekerHiringPriorityComponent,
    RatedetailsComponent,
    JobsCandidateSuggestionsComponent,
    OrderByPipe,
    ReversePipe,
    WidgetComponent,
    ListItemsComponent,
    ListItemsPopupComponent,
    ListItemsEditComponent,
    MsaLandingComponent,
    CreateAgreeComponent,
    SortByTaskPipe,
    SowComponent,
    PoComponent,
    PoLandingComponent,
    SowLandingComponent,
    SearchComponent,
    customSearchPipe,
    AutofocusDirective,
    EditInputComponent,
    ListItemsNotificationComponent,
    CreateProjectsComponent,
    ViewProComponent,
    CreateTaskComponent,
  ],
  imports: [
    LoaderModule,
    CoreModule,
    HttpClientModule,
    CommonModule,
    routing,
    MaterialModule,
    ReactiveFormsModule,
    NgxSliderModule,
    FormsModule,
    QuillModule.forRoot(),
    RouterModule,
    AutoCompleteModule,
    NgFlowchartModule,
    GojsAngularModule,
    TimepickerModule,
    BsDatepickerModule.forRoot(),
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: '#78C000',
      innerStrokeColor: '#C7E596',
      animationDuration: 6000,
    }),
    PdfViewerModule,
  ],
  providers: [skillseekerdashboardService],
})
export class SkillseekerDashboardModule {}
