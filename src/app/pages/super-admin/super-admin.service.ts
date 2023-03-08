import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { InvoiceUpdate, SkillSeeker } from 'src/app/api/flexcub-api/models';
import {
  InvoiceControllerService,
  LocationControllerService,
  OwnerSkillDomainControllerService,
  OwnerSkillLevelControllerService,
  OwnerSkillRolesControllerService,
  OwnerSkillTechnologiesControllerService,
  PoControllerService,
  SeekerAdminControllerService,
  SeekerMsaControllerService,
  SeekerProjectControllerService,
  SeekerRequirementControllerService,
  SeekerTechnologyControllerService,
  SkillPartnerControllerService,
  SkillSeekerControllerService,
  StatementOfWorkControllerService,
} from 'src/app/api/flexcub-api/services';

const EXP_YEAR = [
  { name: '1', displayName: '1' },
  { name: '2', displayName: '2' },
  { name: '3', displayName: '3' },
  { name: '4', displayName: '4' },
  { name: '5', displayName: '5' },
  { name: '6', displayName: '6' },
  { name: '7', displayName: '7' },
  { name: '8', displayName: '8' },
  { name: '9', displayName: '9' },
  { name: '10', displayName: '10' },
  { name: '11', displayName: '11' },
  { name: '12', displayName: '12' },
];

@Injectable({
  providedIn: 'root',
})
export class SuperAdminService {
  constructor(
    private http: HttpClient,
    private readonly locationController: LocationControllerService,
    private readonly ownerSkillDomainController: OwnerSkillDomainControllerService,
    private readonly ownerSkillTechnologiesController: OwnerSkillTechnologiesControllerService,
    private readonly seekerProjectController: SeekerProjectControllerService,
    private readonly ownerSkillLevelController: OwnerSkillLevelControllerService,
    private readonly ownerSkillRolesController: OwnerSkillRolesControllerService,
    private readonly seekerAdminController: SeekerAdminControllerService,
    private readonly seekerTechnologyController: SeekerTechnologyControllerService,
    private readonly seekerRequirementController: SeekerRequirementControllerService,
    private readonly skillSeekerController: SkillSeekerControllerService,
    private readonly seekerMsaController: SeekerMsaControllerService,
    private readonly invoiceController: InvoiceControllerService,
    private readonly statementOfWorkController: StatementOfWorkControllerService,
    private readonly poController: PoControllerService,
    private readonly skillPartnerControllerService: SkillPartnerControllerService
  ) {}

  getExpYear() {
    return of(EXP_YEAR);
  }

  getState() {
    return this.locationController.getStates();
  }

  addClientDetails(request): Observable<SkillSeeker> {
    return this.seekerAdminController.addClientDetails({ body: request });
  }

  updateClientDetails1(request1): Observable<SkillSeeker> {
    return this.seekerAdminController.updateClientDetails1({ body: request1 });
  }

  skillSeekerBasicDetail(Id: number) {
    return this.seekerAdminController.skillSeekerBasicDetail({ id: Id });
  }

  insertRequirementDetailsData(j: any[]) {
    return this.seekerRequirementController.insertRequirementDetailsData({ body: j });
  }

  getSuperAdminClients(): Observable<any> {
    return this.seekerAdminController.skillSeekerByAdmin();
  }

  getDepatmentData(): Observable<any> {
    return this.ownerSkillDomainController.getDetails2();
  }
  getTechnologyData(): Observable<any> {
    return this.ownerSkillTechnologiesController.getDetailsTech();
  }
  getRoleData(): Observable<any> {
    return this.ownerSkillRolesController.getDetailsroles();
  }
  getLeveleData(): Observable<any> {
    return this.ownerSkillLevelController.getDetails1();
  }

  addNewSkillSeekarData(data: any): Observable<any> {
    return this.seekerProjectController.insertSeekerProjectDetails({ body: data });
  }
  getNewSkillSeekarData(id: any): Observable<any> {
    return this.seekerProjectController.seekerProjectDetails({ skillSeekerId: id });
  }
  uodateSkillSeekarData(data: any): Observable<any> {
    return this.seekerTechnologyController.getDataByProjectId({ id: data });
  }
  getSkillSeekarDataById(seekarId: any): Observable<any> {
    return this.seekerProjectController.seekerProjectDetails({ skillSeekerId: seekarId });
  }

  getCoreTechnology(): Observable<any> {
    return this.ownerSkillTechnologiesController.getDetailsTech();
  }

  getLocation(text: string) {
    return this.skillSeekerController.getLocationByKeyword({ keyword: text });
  }

  getMsaDetails() {
    return this.seekerMsaController.getMsaDetails();
  }

  getAllContractDetails() {
    return this.skillSeekerController.getAllContractDetails();
  }

  getAllInvoiceDetails() {
    return this.invoiceController.getAllInvoiceDetails();
  }

  getAllInvoiceDetailAdmin() {
    return this.invoiceController.getAllInvoiceDetailAdmin();
  }

  invoiceClientDetails() {
    return this.invoiceController.invoiceClientDetails();
  }

  getInvoiceStatus() {
    return this.invoiceController.getInvoiceStatus();
  }

  getContractStatus() {
    return this.seekerMsaController.getContractStatus();
  }

  updateInvoiceStatus(invoiceId, id, comments) {
    return this.invoiceController.updateInvoiceStatus({ invoiceId: invoiceId, id: id, comments: comments });
  }

  updateMsaStatus(msaId, msaStatusId) {
    return this.seekerMsaController.updateMsaStatus({ msaId: msaId, msaStatusId: msaStatusId });
  }

  updateInvoiceDetailsByAdmin(body: InvoiceUpdate) {
    return this.invoiceController.updateInvoiceDetailsByAdmin({ body: body });
  }
  updateInvoiceDetailsByPartner(body: InvoiceUpdate) {
    return this.invoiceController.updateInvoiceDetailsByPartner({ body: body });
  }

  updateSowStatus(sowId, sowStatusId) {
    return this.statementOfWorkController.updateSowStatus({ sowId: sowId, sowStatusId: sowStatusId });
  }

  updatePOStatus(poId, poStatusId) {
    return this.poController.updatePoStatus({ id: poId, status: poStatusId });
  }

  updateSeekerInvoiceStatus(invoiceId, id, comments) {
    return this.invoiceController.updateSeekerInvoiceStatus({ invoiceId: invoiceId, statusId: id, comments: comments });
  }

  getAdminInvoiceData(seekerId) {
    return this.invoiceController.getAdminInvoiceData({ seekerId: seekerId });
  }

  getPartnerInvoiceBySeeker(seekerId, projectId) {
    return this.invoiceController.getPartnerInvoiceBySeeker({ seekerId: seekerId, projectId: projectId });
  }

  saveInvoiceDetailsByAdmin(req) {
    return this.invoiceController.saveInvoiceDetailsByAdmin({ body: req });
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

  getAllSkillPartner() {
    return this.seekerAdminController.getAllSkillPartner();
  }

  getSkillPartnerDetails() {
    return this.skillPartnerControllerService.getSkillPartnerDetails();
  }

  getPartnerDetails(id: any) {
    return this.skillPartnerControllerService.getPartnerDetails({ id: id });
  }

  updateSkillPartnerDetails(req) {
    return this.skillPartnerControllerService.updateSkillPartnerDetails({ body: req });
  }
}
