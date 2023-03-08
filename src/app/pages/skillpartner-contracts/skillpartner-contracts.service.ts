import { Injectable } from '@angular/core';
import {
  PoControllerService,
  SeekerMsaControllerService,
  SkillPartnerControllerService,
  StatementOfWorkControllerService,
} from 'src/app/api/flexcub-api/services';

@Injectable({
  providedIn: 'root',
})
export class SkillpartnerContractsService {
  constructor(
    private readonly skillpartnercontrollerservice: SkillPartnerControllerService,
    private readonly statementOfWorkController: StatementOfWorkControllerService,
    private readonly poController: PoControllerService,
    private readonly seekerMsaController: SeekerMsaControllerService
  ) {}

  getContractDetails1(id) {
    return this.skillpartnercontrollerservice.getContractDetails1({ partnerId: id });
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
}
