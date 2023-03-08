import { Component, OnInit } from '@angular/core';
import { Routes } from '@angular/router';
import { GlobalService } from '../global.service';
import { MenuService } from '../theme/services/menu.service';
import { Registration } from './../api/flexcub-api/models/registration';
import { AuthenticationService } from './authentication/authentication.service';
import { PageMenuService } from './pages.menu';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  user: Registration;
  menuCollapsed: boolean = true;

  constructor(
    private _globalService: GlobalService,
    private _pageMenuService: PageMenuService,
    private _menuService: MenuService,
    private authenticationService: AuthenticationService
  ) {
    this._globalService.subscribe('menu.isCollapsed', (menuCollapsed: boolean) => {
      this.menuCollapsed = menuCollapsed;
    });
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }

  ngOnInit(): void {
    this.menuOptions();
  }

  screenWidth = 0;
  isSideNavCollpased = false;

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollpased = data.collapsed;
  }

  menuOptions(): void {
    for (const [key, value] of Object.entries(this._pageMenuService.defaults)) {
      this._pageMenuService.defaults[key] = false;
    }
    Object.assign(this._pageMenuService.defaults, {
      skillOwner: true,
      skillPartner: true,
      skillSeeker: true,
      newDashboard: true,
    });
    this._pageMenuService.menus = this._pageMenuService.GET_MENUS();
    this._menuService.updateMenuByRoutes(<Routes>this._pageMenuService.menus);

    //   if (this.user.roles.roleDescription === Role.Partner) {
    //    Object.assign(this._pageMenuService.defaults, { skillOwner: true, skillPartner: true, skillSeeker: true, newDashboard: true});
    //    this._pageMenuService.menus = this._pageMenuService.GET_MENUS();
    //    this._menuService.updateMenuByRoutes(<Routes>this._pageMenuService.menus);
    //   }
    //   else if(this.user.roles.roleDescription === Role.Seeker){
    //    Object.assign(this._pageMenuService.defaults, { skillOwner: true, skillPartner: true, skillSeeker: true, newDashboard: true});
    //    this._pageMenuService.menus = this._pageMenuService.GET_MENUS();
    //    this._menuService.updateMenuByRoutes(<Routes>this._pageMenuService.menus);
    //   }
    //   else{
    //    Object.assign(this._pageMenuService.defaults, { skillOwner: true, skillPartner: true, skillSeeker: true, newDashboard: true });
    //    this._pageMenuService.menus = this._pageMenuService.GET_MENUS();
    //    this._menuService.updateMenuByRoutes(<Routes>this._pageMenuService.menus);
    //   }
  }
}
