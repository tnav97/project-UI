import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as countrycitystatejson from 'countrycitystatejson';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChangePasswordDto, Registration, SkillOwnerEntity } from 'src/app/api/flexcub-api/models';
import {
  LocationControllerService,
  OwnerSkillDomainControllerService,
  OwnerSkillTechnologiesControllerService,
  RegistrationControllerService,
  SeekerProjectControllerService,
} from 'src/app/api/flexcub-api/services';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private userSubject: BehaviorSubject<Registration>;
  public user: Observable<Registration>;
  errorMessage = '';
  this: any;

  constructor(
    private router: Router,
    private readonly registrationController: RegistrationControllerService,
    private readonly locationController: LocationControllerService,
    private readonly ownerSkillDomainController: OwnerSkillDomainControllerService,
    private readonly ownerSkillTechnologiesController: OwnerSkillTechnologiesControllerService,
    private readonly seekerProjectController: SeekerProjectControllerService
  ) {
    this.userSubject = new BehaviorSubject<Registration>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  private countryData = countrycitystatejson;

  getCountries() {
    return this.countryData.getCountries();
  }

  getStatesByCountry(countryShotName: string) {
    return this.countryData.getStatesByShort(countryShotName);
  }

  getCitiesByState(country: string, state: string) {
    return this.countryData.getCities(country, state);
  }

  public get userValue(): Registration {
    return this.userSubject.value;
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('universalSlot');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  register(request: Registration): Observable<Registration> {
    return this.registrationController.insertDetails({ body: request });
  }

  verifyCandidate(request): Observable<Registration> {
    return this.registrationController.verifyCandidate({ body: request });
  }

  verifyRegistrationForOwner(Token: string): Observable<SkillOwnerEntity> {
    return this.registrationController.verifyRegistrationForOwner({ token: Token });
  }

  setForgotPassword(email: string): Observable<boolean> {
    return this.registrationController.setForgotPassword({ emailId: email });
  }

  verifyForgotPass(request): Observable<ChangePasswordDto> {
    return this.registrationController.verifyForgotPass({ body: request });
  }

  setPasswordForOwner(skillOwnerRegistrationEntity) {
    return this.registrationController.setPasswordForOwner({ body: skillOwnerRegistrationEntity });
  }

  login(request: Registration): Observable<Registration> {
    return this.registrationController.getLoginDetails({ body: request }).pipe(
      map((user) => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      })
    );
  }

  getState() {
    return this.locationController.getStates();
  }

  getCityList(states: string) {
    return this.locationController.getCities({ state: states });
  }

  getStengthList() {
    return this.registrationController.getStrength();
  }

  getDomainList() {
    return this.ownerSkillDomainController.getDetails2();
  }

  getTechnologyList() {
    return this.ownerSkillTechnologiesController.getDetailsTech();
  }

  getSeekerProjectDetails(id) {
    return this.seekerProjectController.seekerProjectDetails({ skillSeekerId: id });
  }

  resendMail(id){
    return this.registrationController.resendMail({id:id})
  }
}
