import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AutoCompleteModule } from 'angular-ngx-autocomplete';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { QuillModule } from 'ngx-quill';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material.module';
import { LoaderModule } from '../loader/loader.module';
import { routing } from '../pages.routing';
import { AddNewSkillPartnerComponent } from './add-new-skill-partner/add-new-skill-partner.component';
import { AddNewSkillSeekerComponent } from './add-new-skill-seeker/add-new-skill-seeker.component';
import { ContractsListComponent } from './contracts-list/contracts-list.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { InvoicePreviewComponent } from './invoice-preview/invoice-preview.component';
import { OwnerListPopupComponent } from './owner-list-popup/owner-list-popup.component';
import { PartnerComponent } from './partner/partner.component';
import { PreviewInvoiceComponent } from './preview-invoice/preview-invoice.component';
import { SuperAdminClientsComponent } from './super-admin-clients/super-admin-clients.component';
import { SuperAdminRoutingModule } from './super-admin.routing';
import { SuperAdminService } from './super-admin.service';

@NgModule({
  declarations: [
    SuperAdminClientsComponent,
    AddNewSkillSeekerComponent,
    CreateInvoiceComponent,
    InvoicePreviewComponent,
    ContractsListComponent,
    OwnerListPopupComponent,
    PreviewInvoiceComponent,
    InvoiceListComponent,
    PartnerComponent,
    AddNewSkillPartnerComponent,
  ],
  imports: [
    CommonModule,
    CoreModule,
    SuperAdminRoutingModule,
    HttpClientModule,
    LoaderModule,
    RouterModule,
    NgxSliderModule,
    QuillModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    routing,
    AutoCompleteModule,
    BsDatepickerModule.forRoot(),
    TabsModule,
  ],
  providers: [CurrencyPipe, SuperAdminService],
})
export class SuperAdminModule {}
