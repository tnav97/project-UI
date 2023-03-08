import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileResponse, InvoiceDetailResponse, InvoiceListingData, InvoiceRequest, InvoiceResponse, TimeSheet, WorkEfforts } from 'src/app/api/flexcub-api/models';
import { InvoiceControllerService, OwnerTimeSheetControllerService, SkillOwnerControllerService } from 'src/app/api/flexcub-api/services';

@Injectable({
  providedIn: 'root',
})
export class SkillpartnerInvoiceService {
  constructor(private readonly invoiceController: InvoiceControllerService,
     private readonly skillOwnerController: SkillOwnerControllerService,
     private readonly ownerTimeSheetControllerService:OwnerTimeSheetControllerService) {}

  getInvoices(id): Observable<Array<InvoiceListingData>> {
    return this.invoiceController.getInvoices({ partnerId: id });
  }

  getInvoiceByInvoiceId(invoiceId, isPartner): Observable<InvoiceDetailResponse> {
    return this.invoiceController.getInvoiceByInvoiceId({ invoiceId: invoiceId, partnerGenerated: isPartner });
  }

  getOwnersByPartners(partnerId: number, startDate: string, endDate: string): Observable<Array<WorkEfforts>> {
    return this.invoiceController.getOwnersByPartners({ partnerId: partnerId, startDate: startDate, endDate: endDate });
  }

  downloadImage(Id: number) {
    return this.skillOwnerController.downloadImage({ id: Id });
  }

  saveInvoiceDetailsByPartner(invoicerequest: InvoiceRequest): Observable<InvoiceResponse> {
    return this.invoiceController.saveInvoiceDetailsByPartner({ body: invoicerequest });
  }

  getOwnerTimeSheetDetails(id:number):Observable<Array<TimeSheet>>{
    return this.ownerTimeSheetControllerService.getOwnerTimeSheetDetails({skillOwnerId:id});
  }

  urlDownloadTimesheetDocuments(id:number):Observable<FileResponse>{
    return this.ownerTimeSheetControllerService.urlDownloadTimesheetDocuments({id:id})
  }

  downloadTimesheetDocuments(id:number):Observable<Blob>{
    return this.ownerTimeSheetControllerService.downloadTimesheetDocuments$Json({id:id})
  }
}
