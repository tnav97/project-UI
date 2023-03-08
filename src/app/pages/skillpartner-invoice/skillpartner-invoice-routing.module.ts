import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateinvoiceComponent } from './createinvoice/createinvoice.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { PreviewInvoiceComponent } from './preview-invoice/preview-invoice.component';

const routes: Routes = [
  { path: '', component: InvoiceListComponent },
  { path: 'createinvoice', component: CreateinvoiceComponent },
  { path: 'previewInvoice/:id', component: PreviewInvoiceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SkillpartnerInvoiceRoutingModule {}
