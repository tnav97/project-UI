import { Injectable } from '@angular/core';
import { IMenuOptionDefaults, IMenus } from '../core/models';

@Injectable({
  providedIn: 'root',
})
export class PageMenuService {
  menus: Array<{ path: string; children: Array<IMenus> }> = [];
  defaults: IMenuOptionDefaults = {
    calendar: true,
    candidates: true,
    newDashboard: true,
    contracts: true,
    dashboard: true,
    inHiring: true,
    invoices: true,
    jobs: true,
    skillOwner: true,
    skillPartner: true,
    skillSeeker: true,
  };

  constructor() {}

  GET_MENUS(): Array<any> {
    return [
      {
        path: '',
        children: this.getChildrens(),
      },
    ];
  }

  protected getChildrens(): Array<IMenus> {
    var children: Array<IMenus> = this.defaultMenus();
    for (const [key, value] of Object.entries(this.defaults)) {
      children.forEach((ele: IMenus, i: number) => {
        ele.key === key ? (children[i].view = Boolean(value)) : null;
      });
    }
    children = children.filter((ele: any) => ele.view === true);
    return children;
  }

  defaultMenus(): Array<IMenus> {
    return [
      {
        path: 'newDashboard',
        view: true,
        key: 'newDashboard',
        menu: {
          title: 'Dashboard',
          icon: 'extension',
          selected: false,
          expanded: false,
        },
      },
      {
        path: 'dashboard',
        view: true,
        key: 'dashboard',
        menu: {
          title: 'Dashboard',
          icon: 'dashboard',
          selected: false,
          expanded: false,
        },
      },
      {
        path: 'skillowner',
        view: true,
        key: 'skillOwner',
        menu: {
          title: 'Skill Owner',
          icon: 'people',
          selected: false,
          expanded: false,
        },
      },
      {
        path: 'skillpartner',
        view: true,
        key: 'skillPartner',
        menu: {
          title: 'Skill Partner',
          icon: 'groups',
          selected: false,
          expanded: false,
        },
      },
      {
        path: 'skillseeker',
        view: true,
        key: 'skillSeeker',
        menu: {
          title: 'Skill Seeker',
          icon: 'person_search',
          selected: false,
          expanded: false,
        },
      },
      {
        path: 'in-hiring',
        view: true,
        key: 'inHiring',
        menu: {
          title: 'In hiring',
          icon: 'list_alt',
          selected: false,
          expanded: false,
        },
      },
      {
        path: 'candidates',
        view: true,
        key: 'candidates',
        menu: {
          title: 'Candidates',
          icon: 'people',
          selected: false,
          expanded: false,
        },
      },
      {
        path: 'contracts',
        view: true,
        key: 'contracts',
        menu: {
          title: 'Contracts',
          icon: 'assignment',
          selected: false,
          expanded: false,
        },
      },
      {
        path: 'calendar',
        view: true,
        key: 'calendar',
        menu: {
          title: 'Calendar',
          icon: 'calendar_today',
          selected: false,
          expanded: false,
        },
      },
      {
        path: 'invoices',
        view: true,
        key: 'invoices',
        menu: {
          title: 'Invoice',
          icon: 'description',
          selected: false,
          expanded: false,
        },
      },
    ];
  }
}
