export interface IMenu {
  title: string;
  icon: string;
  selected: boolean;
  expanded: boolean;
}

export interface IMenus {
  path: string;
  view: boolean;
  key: string;
  menu: IMenu;
}

export interface INavMenus {
  expanded: boolean;
  icon: string;
  order: number;
  pathMatch: string;
  route: { data: any; path: string; paths: Array<string> };
  selected: boolean;
  target: string;
  title: string;
}

export interface IMenuOptionDefaults {
  newDashboard: boolean;
  dashboard: boolean;
  calendar: boolean;
  contracts: boolean;
  candidates: boolean;
  inHiring: boolean;
  invoices: boolean;
  jobs: boolean;
  skillOwner: boolean;
  skillPartner: boolean;
  skillSeeker: boolean;
}
