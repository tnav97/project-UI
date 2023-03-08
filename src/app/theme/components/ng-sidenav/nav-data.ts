export const navbarData = [
  {
    routeLink: 'ssdashboard',
    icon: 'fal fa-home',
    label: 'Dashboard',
    exact: true,
  },
  {
    routeLink: 'ssdashboard/joblist',
    icon: 'fal fa-box-open',
    label: 'Jobs',
    exact: true,
  },
  {
    routeLink: 'ssContracts/list',
    icon: 'fal fa-chart-bar',
    label: 'Contracts',
    exact: true,
  },
  {
    routeLink: '',
    icon: 'fal fa-tags',
    label: 'Hiring',
    exact: true,
  },
  {
    routeLink: '',
    icon: 'fal fa-cog',
    label: 'Invoice',
    exact: true,
  },
  {
    routeLink: 'seekerNotification',
    icon: 'fal fa-bell',
    label: 'Notification',
    exact: true,
  },
  // {
  //     routeLink: 'skillseeker',
  //     icon: 'fal fa-box-open',
  //     label: 'Skill Seeker',
  // },
  // {
  //     routeLink: 'skillpartner',
  //     icon: 'fal fa-chart-bar',
  //     label: 'Skill Partner'
  // },
  // {
  //     routeLink: 'skillowner',
  //     icon: 'fal fa-tags',
  //     label: 'Skill Owner'
  // },
  // {
  //     routeLink: 'pages',
  //     icon: 'fal fa-file',
  //     label: 'Pages'
  // },
  // {
  //     routeLink: 'media',
  //     icon: 'fal fa-camera',
  //     label: 'Media'
  // },
  // {
  //     routeLink:'settings',
  //     icon:'fal fa-cog',
  //     label:'Settings'
  // },
];

export const navPartnerData = [
  {
    routeLink: 'spdashboard',
    icon: 'fal fa-home',
    label: 'Dashboard',
    exact: true,
  },
  {
    routeLink: 'spdashboard/addTalent',
    icon: 'fal fa-box-open',
    label: 'Talents',
    exact: true,
  },
  {
    routeLink: 'spContracts',
    icon: 'fal fa-chart-bar',
    label: 'Contracts',
    exact: true,
  },
  {
    routeLink: 'spHiring',
    icon: 'fal fa-tags',
    label: 'Hiring',
    exact: false,
  },
  {
    routeLink: 'spInvoice',
    icon: 'fal fa-file',
    label: 'Invoice',
    exact: false,
  },
  {
    routeLink: 'partnerNotification',
    icon: 'fal fa-bell',
    label: 'Notification',
    exact: true,
  },
  // {
  //     routeLink: 'media',
  //     icon: 'fal fa-camera',
  //     label: 'Media'
  // },
  // {
  //     routeLink:'settings',
  //     icon:'fal fa-cog',
  //     label:'Settings'
  // },
];

export const navOwnerData = [
  {
    routeLink: 'sodashboard',
    icon: 'fal fa-home',
    label: 'Dashboard',
    exact: true,
  },

  {
    routeLink: 'soTimesheet',
    icon: 'fal fa-chart-bar',
    label: 'Timesheets',
    exact: true,
  },
  {
    routeLink: 'soHotJobs',
    icon: 'fal fa-tags',
    label: 'Hot Jobs',
    exact: true,
  },
  {
    routeLink: '',
    icon: 'fal fa-book-open',
    label: 'Learn & Grow',
    exact: true,
  },
  {
    routeLink: 'sodashboard/careerProfile',
    icon: 'fal fa-file',
    label: 'Career Profile',
    exact: true,
  },
  {
    routeLink: 'ownerNotification',
    icon: 'fal fa-bell',
    label: 'Notification',
    exact: true,
  },
  // {
  //     routeLink: 'sodashboard',
  //     icon: 'fal fa-home',
  //     label: 'Dashboard',
  // },
  // {
  //     routeLink: '/joblist',
  //     icon: 'fal fa-box-open',
  //     label: 'Jobs',
  // },
  // {
  //     routeLink: 'skillpartner',
  //     icon: 'fal fa-chart-bar',
  //     label: 'Contracts'
  // },
  // {
  //     routeLink: 'skillowner',
  //     icon: 'fal fa-tags',
  //     label: 'Hiring'
  // },
  // {
  //     routeLink: 'pages',
  //     icon: 'fal fa-file',
  //     label: 'Pages'
  // },
  // {
  //     routeLink: 'media',
  //     icon: 'fal fa-camera',
  //     label: 'Media'
  // },
  // {
  //     routeLink:'settings',
  //     icon:'fal fa-cog',
  //     label:'Settings'
  // },
];

export const navSsAdminData = [
  {
    routeLink: 'superadmin',
    icon: 'fal fa-home',
    label: 'Dashboard',
    exact: true,
  },
  {
    routeLink: '/',
    icon: 'fal fa-briefcase',
    label: 'Jobs',
    exact: true,
  },
  {
    routeLink: '/',
    icon: 'fal fa-file-archive',
    label: 'Contract & Legal',
    exact: true,
  },
  {
    routeLink: '/',
    icon: 'fal fa-tag',
    label: 'Hiring',
    exact: true,
  },
  {
    routeLink: 'superadmin/createInvoice',
    icon: 'fal fa-file',
    label: 'Invoice',
    exact: true,
  },

  {
    routeLink: 'superadmin/clients',
    icon: 'fal fa-users',
    label: 'Clients',
    exact: true,
  },
  {
    routeLink: '/',
    icon: 'fal fa-window-restore',
    label: 'Projects',
    exact: true,
  },
  {
    routeLink: 'superadmin/addnew-ss',
    icon: 'fal fa-user-plus',
    label: 'Add Client',
    exact: true,
    query: { type: 'Basic' },
  },
  {
    routeLink: 'superadmin/addnew-ss',
    icon: 'fal fa-cubes',
    label: 'Add Project',
    exact: true,
    query: { type: 'Project' },
  },
  {
    routeLink: 'superadmin/addnew-ss',
    icon: 'fal fa-tags',
    label: 'Add Job',
    exact: true,
    query: { type: 'Requirement' },
  },
  {
    routeLink: 'notification',
    icon: 'fal fa-bell',
    label: 'Notification',
    exact: true,
  },
];

export const navSeekerAdminData = [
  {
    routeLink: 'ssdashboard',
    icon: 'fal fa-home',
    label: 'Dashboard',
    exact: true,
  },
  {
    routeLink: 'ssdashboard/joblist',
    icon: 'fal fa-box-open',
    label: 'Jobs',
    exact: true,
  },
  {
    routeLink: 'ssContracts/list',
    icon: 'fal fa-chart-bar',
    label: 'Contracts',
    exact: true,
  },
  {
    routeLink: '',
    icon: 'fal fa-tags',
    label: 'Hiring',
    exact: true,
  },
  {
    routeLink: '',
    icon: 'fal fa-cog',
    label: 'Invoice',
    exact: true,
  },
  {
    routeLink: 'seekerNotification',
    icon: 'fal fa-bell',
    label: 'Notification',
    exact: true,
  },
  {
    routeLink: 'seekerRoles',
    icon: 'fal fa-solid fa-users',
    label: 'Employees',
    exact: true,
  },
  // {
  //     routeLink: 'skillseeker',
  //     icon: 'fal fa-box-open',
  //     label: 'Skill Seeker',
  // },
  // {
  //     routeLink: 'skillpartner',
  //     icon: 'fal fa-chart-bar',
  //     label: 'Skill Partner'
  // },
  // {
  //     routeLink: 'skillowner',
  //     icon: 'fal fa-tags',
  //     label: 'Skill Owner'
  // },
  // {
  //     routeLink: 'pages',
  //     icon: 'fal fa-file',
  //     label: 'Pages'
  // },
  // {
  //     routeLink: 'media',
  //     icon: 'fal fa-camera',
  //     label: 'Media'
  // },
  // {
  //     routeLink:'settings',
  //     icon:'fal fa-cog',
  //     label:'Settings'
  // },
];
