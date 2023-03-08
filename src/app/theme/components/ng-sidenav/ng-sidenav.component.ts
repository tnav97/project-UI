import { Component, EventEmitter, HostListener, OnDestroy, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Registration } from 'src/app/api/flexcub-api/models';
import { INavMenus, Role } from 'src/app/core/models';
import { GlobalService } from 'src/app/global.service';
import { AuthenticationService } from 'src/app/pages/authentication/authentication.service';
import { MenuService } from '../../services/menu.service';
import { navbarData, navOwnerData, navPartnerData, navSeekerAdminData, navSsAdminData } from './nav-data';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'ng-sidenav',
  templateUrl: './ng-sidenav.component.html',
  styleUrls: ['./ng-sidenav.component.scss'],
})
export class NgSidenavComponent implements OnInit, OnDestroy {
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;
  navPartnerData = navPartnerData;
  navOwnerData = navOwnerData;
  navSsAdminData = navSsAdminData;
  navSeekerAdminData = navSeekerAdminData;
  user: Registration;

  menuCollapsed: boolean = true;
  menuShouldCollapse: boolean = true;
  sizes = {
    collapseSideBar: 991,
    hideSideBar: 500,
  };
  menuItems: Array<INavMenus> = [];
  protected onRouteChange!: Subscription;
  protected menuItemsSub!: Subscription;

  constructor(
    private readonly _globalService: GlobalService,
    private readonly _menuService: MenuService,
    private readonly router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
    this._globalService.subscribe('menu.isCollapsed', (menuCollapsed: boolean) => {
      this.menuCollapsed = menuCollapsed;
    });
  }

  ngOnInit(): void {
    this.menuCollapse();
    this.screenWidth = window.innerWidth;
    this.onRouteChange = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (this.menuItems) {
          this.selectMenuAndNotify();
        } else {
          setTimeout(() => this.selectMenuAndNotify());
        }
      }
    });

    this.menuItemsSub = this._menuService.menuItems.subscribe(this.updateMenu.bind(this));

    // if (this._shouldMenuCollapse()) {
    //   this.menuCollapse();
    // }
  }

  toggleCollapse(): void {
    this.menuCollapsed = !this.menuCollapsed;
    this._globalService.notifyDataChanged('menu.isCollapsed', this.menuCollapsed);
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }

  collapseSidenav(): void {
    this.menuCollapsed = !this.menuCollapsed;
    this._globalService.notifyDataChanged('menu.isCollapsed', this.menuCollapsed);
    this.collapsed = false;
    this.onToggleSideNav.emit({
      collapsed: this.collapsed,
      screenWidth: this.screenWidth,
    });
  }
  updateMenu(newMenuItems: Array<INavMenus>): void {
    this.menuItems = newMenuItems;
    this.selectMenuAndNotify();
  }

  selectMenuAndNotify(): void {
    if (this.menuItems) {
      this.menuItems = this._menuService.selectMenuItem(this.menuItems);
      this._globalService.notifyDataChanged('menu.activeLink', this._menuService.getCurrentItem());
    }
  }

  menuCollapse(): void {
    this.menuCollapseChange(true);
  }

  menuExpand(): void {
    this.menuCollapseChange(false);
  }

  menuCollapseChange(isCollapsed: boolean): void {
    this.menuCollapsed = isCollapsed;
    this._globalService.notifyDataChanged('menu.isCollapsed', this.menuCollapsed);
  }

  _shouldMenuCollapse(): boolean {
    return window.innerWidth <= this.sizes.collapseSideBar;
  }

  @HostListener('window:resize')
  onResize(event: any) {
    this.screenWidth = window.innerWidth;

    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({
        collapsed: this.collapsed,
        screenWidth: this.screenWidth,
      });
      const menuShouldCollapse = this._shouldMenuCollapse();
      if (this.menuCollapsed !== menuShouldCollapse) {
        this.menuCollapseChange(menuShouldCollapse);
      }
      this.menuShouldCollapse = menuShouldCollapse;
    }
  }

  // @HostListener('window:resize')
  // onResize(): void {
  //   const menuShouldCollapse = this._shouldMenuCollapse();
  //   if (this.menuCollapsed !== menuShouldCollapse) {
  //     this.menuCollapseChange(menuShouldCollapse);
  //   }
  //   this.menuShouldCollapse = menuShouldCollapse;
  // }

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
    return this.user && (this.user.roles.roleDescription === Role.SsAdmin || this.user.roles.roleDescription === Role.SuperAdmin);
  }

  get isSeekerAdmin() {
    return this.user && this.user.subRoles === Role.SeekerAdmin;
  }

  ngOnDestroy(): void {
    this.onRouteChange?.unsubscribe();
    this.menuItemsSub?.unsubscribe();
  }
}
