import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreviewInvoiceComponent } from './preview-invoice/preview-invoice.component';
import { SkillseekerInvoiceComponent } from './skillseeker-invoice.component';

const routes: Routes = [
  { path: '', component: SkillseekerInvoiceComponent },
  { path: 'previewInvoice/:id', component: PreviewInvoiceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SkillseekerInvoiceRoutingModule {}
