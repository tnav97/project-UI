import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contracts, OnBoarding } from 'src/app/api/flexcub-api/models';
import {
  PoControllerService,
  SeekerMsaControllerService,
  SkillSeekerControllerService,
  StatementOfWorkControllerService,
} from 'src/app/api/flexcub-api/services';

@Injectable({
  providedIn: 'root',
})
export class SkillseekerContractsService {
  constructor(
    private readonly skillSeekerController: SkillSeekerControllerService,
    private readonly statementOfWorkController: StatementOfWorkControllerService,
    private readonly poController: PoControllerService,
    private readonly seekerMsaController: SeekerMsaControllerService
  ) {}

  getContractDetails(id): Observable<Contracts[]> {
    return this.skillSeekerController.getContractDetails({ seekerId: id });
  }

  getListsOfContractDetails(id) {
    return this.skillSeekerController.getListsOfContractDetails({ ownerId: id });
  }

  getContractStatus() {
    return this.seekerMsaController.getContractStatus();
  }

  updateMsaStatus(msaId, msaStatusId) {
    return this.seekerMsaController.updateMsaStatus({ msaId: msaId, msaStatusId: msaStatusId });
  }

  updateSowStatus(sowId, sowStatusId) {
    return this.statementOfWorkController.updateSowStatus({ sowId: sowId, sowStatusId: sowStatusId });
  }

  updatePOStatus(poId, poStatusId) {
    return this.poController.updatePoStatus({ id: poId, status: poStatusId });
  }

  downloadMSA(msaId) {
    return this.seekerMsaController.downloadOwnerAgreement1({ id: msaId });
  }

  downloadSOW(sowId) {
    return this.statementOfWorkController.downloadOwnerAgreement({ id: sowId });
  }

  downloadPO(poId) {
    return this.poController.downloadAgreementPo({ id: poId });
  }

  downloadMSABlob(msaId) {
    return this.seekerMsaController.downloadAgreement({ id: msaId });
  }

  downloadSOWBlob(sowId) {
    return this.statementOfWorkController.downloadAgreementSow$Pdf({ id: sowId });
  }

  downloadPOBlob(poId) {
    return this.poController.downloadAgreement1$Pdf({ id: poId });
  }

  onBoarding(req): Observable<OnBoarding> {
    return this.skillSeekerController.response({ body: req });
  }
}
