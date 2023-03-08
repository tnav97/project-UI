import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  AcceptRejectDto,
  Client,
  ClientEntity,
  FileResponse,
  SkillOwnerDto,
  SkillOwnerGender,
  SlotConfirmByOwnerDto,
} from 'src/app/api/flexcub-api/models';
import {
  ClientControllerService,
  LocationControllerService,
  NotificationControllerService,
  OwnerSkillDomainControllerService,
  OwnerSkillLevelAndExperienceControllerService,
  OwnerSkillLevelControllerService,
  OwnerSkillRolesControllerService,
  OwnerSkillSetControllerService,
  OwnerSkillTechnologiesControllerService,
  SelectionPhaseControllerService,
  SkillOwnerControllerService,
  VisaStatusControllerService,
} from 'src/app/api/flexcub-api/services';
import { IInput } from 'src/app/core/models/input';

@Injectable({
  providedIn: 'root',
})
export class SkillownerDashboardService {
  private inputValueSubject = new BehaviorSubject<IInput>(null);
  inputValue$ = this.inputValueSubject.asObservable();
  uploadProgress: number;
  progress: any;



  constructor(
    private router: Router,
    private http: HttpClient,
    private readonly notificationController: NotificationControllerService,
    private readonly skillownercontroller: SkillOwnerControllerService,
    private readonly clientController: ClientControllerService,
    private readonly locationController: LocationControllerService,
    private readonly ownerSkillDomainController: OwnerSkillDomainControllerService,
    private readonly ownerSkillTechnologiesController: OwnerSkillTechnologiesControllerService,
    private readonly ownerSkillLevelController: OwnerSkillLevelControllerService,
    private readonly ownerSkillLevelAndExperienceController: OwnerSkillLevelAndExperienceControllerService,
    private readonly ownerSkillSetController: OwnerSkillSetControllerService,
    private readonly ownerSkillRolesController: OwnerSkillRolesControllerService,
    private readonly selectionPhaseController: SelectionPhaseControllerService,
    private readonly visaStatusControllerService: VisaStatusControllerService
  ) {}

  initialize(input: IInput) {
    this.inputValueSubject.next(input);
  }



  getInputValue() {
    return this.inputValueSubject.getValue();
  }

  getOwnerLastFiveNotification(id) {
    return this.notificationController.getLastFiveNotificationOfOwner({ ownerId: id });
  }

  getById(Id: number): Observable<SkillOwnerDto> {
    return this.skillownercontroller.getById({ id: Id });
  }

  ownerNotification(Id) {
    return this.notificationController.ownerNotification({ id: Id });
  }

  acceptRejectBySkillOwner(request): Observable<AcceptRejectDto> {
    return this.selectionPhaseController.acceptRejectBySkillOwner({ body: request });
  }

  ownerMarkAsRead(Id): Observable<boolean> {
    return this.notificationController.ownerMarkAsRead({ id: Id });
  }

  updateSlotBySkillOwner(request): Observable<SlotConfirmByOwnerDto> {
    return this.selectionPhaseController.updateSlotBySkillOwner({ body: request });
  }

  insertAttachment(Id, skillOwnerEntity) {
    return this.skillownercontroller.insertAttachment({ id: Id, body: { image: skillOwnerEntity } });
  }

  insertAttachment2(Id, skillOwnerEntity: Blob) {
    return this.skillownercontroller.insertAttachment({ id: Id, body: { resume: skillOwnerEntity } });
  }

  insertAttachment3(Id, skillOwnerEntity: Blob[]) {
    return this.skillownercontroller.insertAttachment({ id: Id, body: { document: skillOwnerEntity } });
  }

  insertAttachment4(Id:number, skillOwnerEntity: Blob) {
    return this.skillownercontroller.insertAttachment({ id: Id, body: { federal: skillOwnerEntity } });
  }

  insertAttachment1(ownerId, Id, skillOwnerEntity: Blob) {
    return this.skillownercontroller.insertAttachment1({ ownerId: ownerId, id: Id, body: { document: skillOwnerEntity } });
  }

  deletePortfolio1(ownerId, Id) {
    return this.skillownercontroller.deletePortfolio1({ id: ownerId, count: Id });
  }

  getClient(id) {
    return this.clientController.getSkillOwnerId({ ownerId: id });
  }

  rejectCandidate(req) {
    return this.selectionPhaseController.rejectCandidate({ body: req });
  }

  getGenderList(): Observable<SkillOwnerGender[]> {
    return this.skillownercontroller.getGenderList();
  }

  insertClient(clientEntity: ClientEntity): Observable<Client> {
    return this.clientController.insertClient({ body: clientEntity });
  }

  insertCommonSlotByOwner(slotConfirmByOwnerDto) {
    return this.selectionPhaseController.insertUniversalSlot({ body: slotConfirmByOwnerDto });
  }

  getState() {
    return this.locationController.getStates();
  }

  updateOwnerProfile(request1): Observable<SkillOwnerDto> {
    return this.skillownercontroller.updateOwnerProfile({ body: request1 });
  }

  downloadResumeFile(Id: number) {
    return this.skillownercontroller.fileDownloadResume({ id: Id });
  }

  downloadResume(Id: number): Observable<FileResponse> {
    return this.skillownercontroller.downloadResume({ ownerId: Id });
  }

  downloadOther(Id: number, count: number) {
    return this.skillownercontroller.downloadOtherDocuments({ ownerId: Id, count: count });
  }

  otherFilesDownload(Id: number, count: number=1): Observable<FileResponse> {
    return this.skillownercontroller.otherFilesDownload({ ownerId: Id, count: count });
  }

  acceptInterview(jobId: string, ownerId: number) {
    return this.selectionPhaseController.acceptInterview({ jobId: jobId, ownerId: ownerId });
  }

  downloadImage(Id): Observable<Blob> {
    return this.skillownercontroller.downloadImage({ id: Id });
  }

  getTechData(): Observable<any> {
    return this.ownerSkillTechnologiesController.getDetailsTech();
  }

  getRolesData(): Observable<any> {
    return this.ownerSkillRolesController.getDetailsroles();
  }

  getLevelData(): Observable<any> {
    return this.ownerSkillLevelController.getDetails1();
  }

  getDomainData(): Observable<any> {
    return this.ownerSkillDomainController.getDetails2();
  }

  getOwnerSkillSetYearOfExperienceDetails(): Observable<any> {
    return this.ownerSkillLevelAndExperienceController.getOwnerSkillYearOfExperienceDetails();
  }

  getAllTableData(ownerId: any): Observable<any> {
    return this.ownerSkillSetController.getDetails({ skillOwnerId: ownerId });
  }

  insertSkillSetData(data: any): Observable<any> {
    return this.ownerSkillSetController.insertDetails1({ body: data });
  }

  updateSkillSetData(data: any): Observable<any> {
    return this.ownerSkillSetController.updateDetails({ body: data });
  }

  deleteSkillId(id: any): Observable<any> {
    return this.ownerSkillSetController.deleteDetails({ skillId: id });
  }

  getVisa(): Observable<any> {
    return this.visaStatusControllerService.getVisa();
  }

  fileDownloadFederal(Id: number):Observable<FileResponse>{
    return this.skillownercontroller.fileDownloadFederal({id:Id})
  }

  downloadFederal(ownerId:number):Observable<FileResponse>{
    return this.skillownercontroller.downloadFederal({ownerId:ownerId})
  }
}
