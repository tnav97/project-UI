import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CoreModule } from 'src/app/core/core.module';
import { MaterialModule } from 'src/app/material.module';
import { CreateinvoiceComponent } from './createinvoice/createinvoice.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { PreviewInvoiceComponent } from './preview-invoice/preview-invoice.component';
import { SkillpartnerInvoiceRoutingModule } from './skillpartner-invoice-routing.module';
import { SkillpartnerInvoiceComponent } from './skillpartner-invoice.component';
import { TimesheetDetailsComponent } from './timesheet-details/timesheet-details.component';

@NgModule({
  declarations: [SkillpartnerInvoiceComponent, CreateinvoiceComponent, InvoiceListComponent, PreviewInvoiceComponent, TimesheetDetailsComponent],
  imports: [
    CommonModule,
    BsDatepickerModule.forRoot(),
    SkillpartnerInvoiceRoutingModule,
    MaterialModule,
    CoreModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [ DatePipe ]
})
export class SkillpartnerInvoiceModule {}
