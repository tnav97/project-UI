import { Injectable } from '@angular/core';
import { InvoiceControllerService } from 'src/app/api/flexcub-api/services';

@Injectable({
  providedIn: 'root',
})
export class SkillseekerInvoiceService {
  constructor(private readonly invoiceController: InvoiceControllerService) {}

  getAdminInvoiceBySeeker(seekerId) {
    return this.invoiceController.getAdminInvoiceBySeeker({ seekerId: seekerId });
  }
}
