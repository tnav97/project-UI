import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddNewSkillPartnerComponent } from './add-new-skill-partner/add-new-skill-partner.component';
import { AddNewSkillSeekerComponent } from './add-new-skill-seeker/add-new-skill-seeker.component';
import { ContractsListComponent } from './contracts-list/contracts-list.component';
import { CreateInvoiceComponent } from './create-invoice/create-invoice.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { PartnerComponent } from './partner/partner.component';
import { PreviewInvoiceComponent } from './preview-invoice/preview-invoice.component';
import { SuperAdminClientsComponent } from './super-admin-clients/super-admin-clients.component';
import { SuperAdminComponent } from './super-admin.component';

const routes: Routes = [
  { path: '', component: SuperAdminComponent },
  { path: 'clients', component: SuperAdminClientsComponent },
  { path: 'partner', component: PartnerComponent },
  { path: 'contracts', component: ContractsListComponent },
  { path: 'addnew-ss', component: AddNewSkillSeekerComponent },
  { path: 'addnew-sp', component: AddNewSkillPartnerComponent },
  { path: 'createInvoice', component: CreateInvoiceComponent },
  { path: 'invoiceList', component: InvoiceListComponent },
  { path: 'previewInvoice', component: PreviewInvoiceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuperAdminRoutingModule {}
