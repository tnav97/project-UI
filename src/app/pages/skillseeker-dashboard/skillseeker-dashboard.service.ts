import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import {
  FeedbackRate,
  FlowLockedDto,
  Job,
  NewSlotRequestBySeekerDto,
  ProjectTaskDetails,
  RateApprovalDto,
  RequirementPhaseDetailsDto,
  SelectionPhaseResponse,
  SkillOwnerDto,
  SkillSeekerProject,
  SkillSeekerTask,
  SlotConfirmByOwnerDto,
  SlotConfirmBySeekerDto,
} from 'src/app/api/flexcub-api/models';
import {
  JobControllerService,
  LocationControllerService,
  NotificationControllerService,
  OwnerSkillDomainControllerService,
  OwnerSkillLevelAndExperienceControllerService,
  PoControllerService,
  SeekerAdminControllerService,
  SeekerMsaControllerService,
  SeekerProjectControllerService,
  SeekerTaskControllerService,
  SelectionPhaseControllerService,
  SkillOwnerControllerService,
  SkillSeekerControllerService,
  StatementOfWorkControllerService,
  TalentRecommendationControllerService,
} from 'src/app/api/flexcub-api/services';
import { BaseAndMaxRateControllerService } from 'src/app/api/flexcub-api/services/base-and-max-rate-controller.service';

@Injectable({
  providedIn: 'root',
})
export class skillseekerdashboardService {
  constructor(
    private router: Router,
    private http: HttpClient,
    private readonly baseAndmaxRateController: BaseAndMaxRateControllerService,
    private readonly jobController: JobControllerService,
    private readonly notificationController: NotificationControllerService,
    private readonly seekerProjectController: SeekerProjectControllerService,
    private readonly ownerSkillLevelAndExperienceController: OwnerSkillLevelAndExperienceControllerService,
    private readonly skillSeekerController: SkillSeekerControllerService,
    private readonly selectionPhaseController: SelectionPhaseControllerService,
    private readonly locationController: LocationControllerService,
    private readonly talentRecommendationController: TalentRecommendationControllerService,
    private readonly seekerMsaController: SeekerMsaControllerService,
    private readonly statementOfWorkController: StatementOfWorkControllerService,
    private readonly poController: PoControllerService,
    private readonly skillOwnerController: SkillOwnerControllerService,
    private readonly seekerAdminController: SeekerAdminControllerService,
    private readonly ownerSkillDomainController: OwnerSkillDomainControllerService,
    private readonly seekerTaskController: SeekerTaskControllerService
  ) {}

  getCityDetails() {
    return this.locationController.getStates();
  }

  getData() {
    return this.baseAndmaxRateController.getBaseAndMaxRateCardData();
  }

  insertBaseAndMaxRateCard(request) {
    return this.baseAndmaxRateController.insertBaseAndMaxRateCard({ body: request });
  }

  seekerNotification(id) {
    return this.notificationController.seekerNotification({ id: id });
  }

  getSeekerLastFiveNotification(id) {
    return this.notificationController.getSeekerLastFiveNotification({ seekerId: id });
  }

  updateSlotConfirmedBySeeker(jobId, skillOwnerId): Observable<SlotConfirmBySeekerDto> {
    return this.selectionPhaseController.updateSlotConfirmedBySeeker({ jobId: jobId, skillOwnerId: skillOwnerId });
  }
  updateNewSlotBySeeker(jobId, skillOwnerId): Observable<NewSlotRequestBySeekerDto> {
    return this.selectionPhaseController.updateNewSlotBySeeker({ jobId: jobId, skillOwnerId: skillOwnerId });
  }

  addNewSkillSeekarData(data: any): Observable<Array<SkillSeekerProject>> {
    return this.seekerProjectController.insertSeekerProjectDetails({ body: data });
  }

  updateSeekerProjectDetails(data: any): Observable<SkillSeekerProject> {
    return this.seekerProjectController.updateSeekerProjectDetails({ body: data });
  }

  seekerMarkAsRead(id): Observable<boolean> {
    return this.notificationController.seekerMarkAsRead({ id: id });
  }
  getOwnerSkillYearOfExperienceDetails() {
    return this.ownerSkillLevelAndExperienceController.getOwnerSkillYearOfExperienceDetails();
  }

  getById(Id: number): Observable<SkillOwnerDto> {
    return this.skillOwnerController.getById({ id: Id });
  }

  skillOwnerRate(req): Observable<Array<RateApprovalDto>> {
    return this.selectionPhaseController.skillOwnerRate({ body: req });
  }

  seekerTaskDetails(Id: number, skillseekerId): Observable<Array<SkillSeekerTask>> {
    return this.seekerTaskController.seekerTaskDetails({ projectId: Id, skillSeekerId: skillseekerId });
  }

  deleteSeekerTaskDetails(Id: number) {
    return this.seekerTaskController.deleteSeekerTaskDetails({ id: Id });
  }

  deleteSeekerProjectDetails(Id: number) {
    return this.seekerProjectController.deleteSeekerProjectDetails({ id: Id });
  }

  addJobDetails(request): Observable<Job> {
    return this.jobController.addJobDetails({ body: request });
  }

  getHiringPriority() {
    return this.jobController.getHiringPriority();
  }

  getRetrieveJob(Id) {
    return this.jobController.getJobDetails({ seekerId: Id });
  }

  shortlistingMail(jobId: string) {
    return this.selectionPhaseController.shortlistingMail({ jobId: jobId });
  }

  getDepatmentData(): Observable<any> {
    return this.ownerSkillDomainController.getDetails2();
  }

  publish(jobId: string): Observable<Job> {
    return this.jobController.publish({ jobId: jobId });
  }

  getCandidateSuggetion(jobId: string) {
    return this.talentRecommendationController.talentRecommendation({ jobId: jobId });
  }

  getCandidateItems(jobId: string) {
    return this.selectionPhaseController.getCandidatesByJobId({ jobId: jobId });
  }

  candidateInterviewDetails(jobId: string, skillOwnerId: number): Observable<SelectionPhaseResponse> {
    return this.selectionPhaseController.candidateInterviewDetails({ jobId: jobId, skillOwnerId: skillOwnerId });
  }

  getLocation(text: string) {
    return this.skillSeekerController.getLocationByKeyword({ keyword: text });
  }

  InsertRequirementPhasesPath(InsertRequirementPhaseDto): Observable<SelectionPhaseResponse[]> {
    return this.selectionPhaseController.insertRequirementPhases({ body: InsertRequirementPhaseDto });
  }

  InsertSelectionPhasesPath(InsertSelectionPhaseDto) {
    return this.selectionPhaseController.insertSelectionPhases({ body: InsertSelectionPhaseDto });
  }

  getProjectDropdownData(id: any) {
    return this.seekerProjectController.seekerProjectDetails({ skillSeekerId: id });
  }

  isLocked(jobId: string): Observable<FlowLockedDto> {
    return this.selectionPhaseController.isLocked({ jobId: jobId });
  }

  getSelectionPhase(jobId: string, skillOwnerId: number): Observable<SlotConfirmByOwnerDto> {
    return this.selectionPhaseController.getSelectionPhase({ jobId: jobId, skillOwnerId: skillOwnerId });
  }

  reInitiateHiring(jobId: string, skillOwnerId: number) {
    return this.selectionPhaseController.reInitiateHiring({ jobId: jobId, skillOwnerId: skillOwnerId });
  }

  selectedForRound(jobId: string, skillOwnerId: number, stage: number): Observable<RequirementPhaseDetailsDto> {
    return this.selectionPhaseController.selectedForRound({ jobId: jobId, skillOwnerId: skillOwnerId, stage: stage });
  }

  updateDetailsForParticularRound(req) {
    return this.selectionPhaseController.updateDetailsForParticularRound({ body: req });
  }

  rejectCandidate(req) {
    return this.selectionPhaseController.rejectCandidate({ body: req });
  }

  acceptInterview(jobId: string, ownerId: number) {
    return this.selectionPhaseController.acceptInterview({ jobId: jobId, ownerId: ownerId });
  }

  scheduleInterview(req) {
    return this.selectionPhaseController.scheduleInterview({ body: req });
  }
  uploadFile(skillSeekerId: number, skillSeekerProjectId: number, jobId: string, ownerId: number, agreefile: Blob[]) {
    return this.seekerMsaController.uploadFile1({
      skillSeekerId: skillSeekerId,
      skillSeekerProjectId: skillSeekerProjectId,
      jobId: jobId,
      ownerId: ownerId,
      body: { document: agreefile },
    });
  }

  uploadFileSOW(
    ownerId: number,
    skillSeekerId: number,
    domainId: number,
    roles: string,
    skillSeekerProjectId: number,
    jobId: string,
    sowfile: Blob[]
  ) {
    return this.statementOfWorkController.uploadFile({
      ownerId: ownerId,
      skillSeekerId: skillSeekerId,
      domainId: domainId,
      roles: roles,
      skillSeekerProjectId: skillSeekerProjectId,
      jobId: jobId,
      body: { document: sowfile },
    });
  }

  uploadFilePO(
    skillSeekerId: number,
    skillSeekerProjectId: number,
    skillOwnerId: number,
    Role: string,
    Domain: number,
    JobId: string,
    profile: Blob[]
  ) {
    return this.poController.uploadFile2({
      skillSeekerId: skillSeekerId,
      skillSeekerProjectId: skillSeekerProjectId,
      skillOwnerId: skillOwnerId,
      Role: Role,
      Domain: Domain,
      JobId: JobId,
      body: { document: profile },
    });
  }

  downloadAgreement(id: any) {
    return this.seekerMsaController.downloadAgreement({ id: id });
  }

  getSowTemplate() {
    return this.statementOfWorkController.getSowTemplate$Pdf();
  }

  getPoTemplate() {
    return this.poController.getProductOwnerTemplate();
  }

  getMsaTemplate() {
    return this.seekerMsaController.getSkillSeekerMsaTemplate$Pdf();
  }

  getSowDetails(skillSeekerId: any) {
    return this.statementOfWorkController.getSowDetails({ skillSeekerId: skillSeekerId });
  }

  getPoDetails(skillSeekerId: any) {
    return this.poController.getPoDetails({ skillSeekerId: skillSeekerId });
  }
  getMsaDetailsBySeeker(skillSeekerId: any) {
    return this.seekerMsaController.getMsaDetailsBySeeker({ skillSeekerId: skillSeekerId });
  }

  skillSeekerByAdmin() {
    return this.seekerAdminController.skillSeekerByAdmin();
  }
  downloadImage(Id: number) {
    return this.skillOwnerController.downloadImage({ id: Id });
  }

  downloadResume(Id: number) {
    return this.skillOwnerController.downloadResume({ ownerId: Id });
  }

  getSeekerNotificationByOwner(id, jobid) {
    return this.notificationController.getSeekerNotificationByOwner({ ownerId: id, jobId: jobid });
  }

  insertSeekerTaskDetails(data: any): Observable<Array<SkillSeekerTask>> {
    return this.seekerTaskController.insertSeekerTaskDetails({ body: data });
  }

  updateSeekerTaskDetails(data: any): Observable<SkillSeekerTask> {
    return this.seekerTaskController.updateSeekerTaskDetails({ body: data });
  }

  getProjectTaskDetailsBySeeker(id): Observable<ProjectTaskDetails> {
    return this.skillSeekerController.getProjectTaskDetailsBySeeker({ skillSeekerId: id });
  }

  feedback():Observable<Array<FeedbackRate>>{
    return this.selectionPhaseController.feedback();
  }
}
