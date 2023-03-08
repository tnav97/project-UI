import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ownerImgUrl } from 'src/app/core/Constants/constant';
import { Role } from 'src/app/core/models';
import { AuthenticationService } from 'src/app/pages/authentication/authentication.service';
import { SkillpartnerHiringService } from 'src/app/pages/skillpartner-hiring/skillpartner-hiring.service';
import { Registration } from './../../../api/flexcub-api/models/registration';

@Component({
  selector: 'ng-additionals',
  templateUrl: './ng-additionals.component.html',
  styleUrls: ['./ng-additionals.component.scss'],
})
export class NgAdditionalsComponent implements OnInit {
  user?: Registration;
  ownerId: number;
  soImgUrl = ownerImgUrl;
  imageAvailable: boolean = false;
  name: string;
  id: any;

  constructor(
    private authenticationService: AuthenticationService,
    private readonly skillpartnerHiringService: SkillpartnerHiringService,
    private router: Router
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }
  ngOnInit(): void {
    if (this.user?.lastName == null) {
      this.name = this.user?.firstName;
    } else {
      this.name = this.user?.firstName + ' ' + this.user?.lastName;
    }

    this.id = this.user?.id;
    this.skillOwnerImage(this.id);
  }

  skillOwnerImage(ownerId) {
    if (this.isOwner) {
      this.skillpartnerHiringService.downloadImage(ownerId).subscribe((res) => {
        this.imageAvailable = true;
      });
    }
  }

  get isAdmin() {
    return this.user && this.user.roles.roleDescription === Role.SuperAdmin;
  }
  get isPartner() {
    return this.user && this.user.roles.roleDescription === Role.Partner;
  }
  get isSeeker() {
    return this.user && this.user.roles.roleDescription === Role.Seeker;
  }
  get isOwner() {
    return this.user && this.user.roles.roleDescription === Role.Owner;
  }

  get isSsAdmin() {
    return this.user && this.user.roles.roleDescription === Role.SsAdmin;
  }

  get isSeekerAdmin() {
    return this.user && this.user.subRoles === Role.SeekerAdmin;
  }

  careerProfile(ownerId: number): void {
    this.router.navigate(['/sodashboard/careerProfile/ownerId/' + ownerId]);
  }

  logout() {
    this.authenticationService.logout();
  }
}
