import { Component, OnInit } from '@angular/core';
import { Registration } from 'src/app/api/flexcub-api/models/registration';
import { Role } from 'src/app/core/models/role.model';
import { GlobalService } from 'src/app/global.service';
import { AuthenticationService } from 'src/app/pages/authentication/authentication.service';

@Component({
  selector: 'ng-headers',
  templateUrl: './ng-headers.component.html',
  styleUrls: ['./ng-headers.component.scss'],
})
export class NgHeadersComponent implements OnInit {
  // logo: string = 'assets/logo/flexcub-FINAL-version_color-text.svg';
  logo: string = 'assets/logo/flexcub-logo-revised.svg';
  menuCollapsed: boolean = false;
  user?: Registration;

  constructor(private authenticationService: AuthenticationService, private _globalService: GlobalService) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }

  ngOnInit(): void {}

  toggleMenu(): void {
    this.menuCollapsed = !this.menuCollapsed;
    this._globalService.notifyDataChanged('menu.isCollapsed', this.menuCollapsed);
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
}
