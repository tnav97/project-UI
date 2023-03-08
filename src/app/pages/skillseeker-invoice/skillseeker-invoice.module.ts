import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PreviewInvoiceComponent } from './preview-invoice/preview-invoice.component';
import { SkillseekerInvoiceRoutingModule } from './skillseeker-invoice-routing.module';
import { SkillseekerInvoiceComponent } from './skillseeker-invoice.component';

@NgModule({
  declarations: [PreviewInvoiceComponent, SkillseekerInvoiceComponent],
  imports: [CommonModule, SkillseekerInvoiceRoutingModule],
})
export class SkillseekerInvoiceModule {}
