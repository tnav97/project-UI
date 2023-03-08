import { LabelType, Options } from '@angular-slider/ngx-slider';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JobDto, Registration } from 'src/app/api/flexcub-api/models';
import { Priority, Remote, Travel } from 'src/app/core/models/skill-seeker.model';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../authentication/authentication.service';
import { SkillownerDashboardService } from '../../skillowner-dashboard/skillowner-dashboard.service';
import { skillseekerdashboardService } from '../skillseeker-dashboard.service';

@Component({
  selector: 'app-skillseeker-joblist',
  templateUrl: './skillseeker-joblist.component.html',
  styleUrls: ['./skillseeker-joblist.component.scss'],
})
export class SkillseekerJoblistComponent implements OnInit {
  @ViewChild('skillsSetRef', { static: false }) skillsSetRefElement: ElementRef;
  address: Object;
  experienceId:number
  establishmentAddress: Object;
  checkedvalue: boolean = false;
  checkedvalue1: boolean = false;
  formattedAddress: string;
  formattedEstablishmentAddress: string;
  phone: string;
  jobid: any;
  array = [];
  candidateSuggestionList: any;
  checked: string = 'DISABLE';
  checked1: string = 'Not Required';
  level: Priority[] = [
    { value: 'Low', name: 'Low' },
    { value: 'Medium', name: 'Medium' },
    { value: 'High', name: 'High' },
  ];
  Experience: any = ['0', '0+', '1+', '2+', '3+', '4+', '5+', '6+', '7+', '9+', '11+', '15+'];
  technology1: any;
  condition: boolean = true;
  condition1: boolean = true;
  role: any;
  selectedlvl: any;
  disabledName: boolean = true;
  step: number = 1;
  form: UntypedFormGroup;
  counter: number = 1;
  skills: string[] = [];
  fixedskills: string[] = [];
  extraskills: string[] = [];
  skillSetValue: string[] = [];
  dummyArray: any[] = [];
  subscription: any;
  default = { id: 0, title: 'Default' };
  defaultDepartment = { domainId: 0, domainValues: 'Default' };
  skillsSet: any;
  userData: any[] = [];
  userList1: any[] = [];
  lastkeydown1: number = 0;
  category1: boolean = false;
  category2: boolean = false;
  category3: boolean = false;
  remote: any;
  taxId: string;
  seekersId: any;
  travel: any;
  domainList: any;
  hiringPriority: any;
  value: number = 0;
  value1: number = 0;
  options: Options = {
    floor: 0,
    step: 5,
    ceil: 100,
  };

  options1: Options = {
    floor: 0,
    step: 5,
    ceil: 100,
  };
  projectname: string = '';
  departmentname: any;
  baseRate: any = 90;
  maxRate: any = 150;
  options2: Options = {
    floor: 0,
    ceil: 200,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '$' + value;
        case LabelType.High:
          return '$' + value;
        default:
          return '' + value;
      }
    },
  };
  projectName: any;
  cityPin: any;
  optionss = ['USA', 'New York', 'Los Angels'];
  listOfOptions = [];
  levelExperience: any;
  objs: any;
  selected: any;
  activeButton: any;
  activeButton1: any;
  experienceVal:string;
  activeButton3: any;

  remoteValue = 0;
  travelValue = 0;
  Technologies: any;
  TechnologyList: any;
  travels: Travel[] = [
    { value: 'yes', viewValue: 'Yes' },
    { value: 'no', viewValue: 'No' },
  ];
  remotes: Remote[] = [
    { value: 'yes', viewValue: 'Yes' },
    { value: 'no', viewValue: 'No' },
  ];
  activeButton2: any;
  tabledata: any;
  newTableData: any;
  id1: number = 0;
  show = false;
  user?: Registration;
  skillSeekerId: number;
  id3: any;
  levels= [];

  searchText: string = '';

  @Output() setAddress: EventEmitter<any> = new EventEmitter();
  @ViewChild('addresstext') addresstext: any;

  autocompleteInput: string;
  queryWait: boolean;

  keyword = 'cityNames';
  data = [];
  citydata: any;
  addressData: any;
  isLoading = false;
  skipvar: any;
  maxEditorTextLength: number = 500;
  currentEditorTextLength: number = 0;
  moduleAccess = [];
  jobCreateVisibility: Boolean;

  constructor(
    private service: AuthenticationService,
    private readonly authnticationService: AuthenticationService,
    private readonly skillseekerdashboardService: skillseekerdashboardService,
    private readonly skillOwnerdashboardService:SkillownerDashboardService,
    private router: Router,
    public zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
    this.authnticationService.user.subscribe((x) => (this.user = x));
    this.form = new UntypedFormGroup({
      jobtitle: new UntypedFormControl('', [Validators.required]),
      location: new UntypedFormControl('', [Validators.required]),
      technology: new UntypedFormControl('', [Validators.required]),
      richText: new UntypedFormControl('', [Validators.required]),
      skillSet: new UntypedFormControl('', [Validators.required]),
      department: new UntypedFormControl(''),
      project: new UntypedFormControl(''),
      level1: new UntypedFormControl('', Validators.required),
      experience: new UntypedFormControl(Validators.required),
      level2: new UntypedFormControl('', Validators.required),
      role: new UntypedFormControl(''),
      counter: new UntypedFormControl(''),
      remote: new UntypedFormControl(true),
      remotePercent: new UntypedFormControl(null),
      travel: new UntypedFormControl(true),
      travelPercent: new UntypedFormControl(null),
      ratePercent: new UntypedFormControl(null),
    });
  }

  ngOnInit(): void {
    this.skillSeekerId = this.user?.id;
    this.taxId = this.user?.taxIdBusinessLicense;
    this.moduleAccess = this.user?.modulesAccess;
    this.jobCreateVisibility = this.moduleAccess.some((element) => {
      if (element.seekerModule === 'Job Creation') {
        return true;
      }

      return false;
    });
    this.getTechnologyList();
    this.getOwnerSkillYearOfExperienceDetails();
    this.getDomainList();
    this.getRetrieveJob();
    this.getHiringPriority();
    this.getSeekerProjectDetails();
    this.getLevelData();

    this.skillseekerdashboardService.getCityDetails().subscribe((response) => {
      this.citydata = response;
      this.citydata.map((city) => (city.address = `${city.cityNames}`));
    });
    // this.setOptions();
    this.getData();
    this.authnticationService.getTechnologyList().subscribe((response) => {
      this.TechnologyList = response;
      for (let i = 0; i < this.TechnologyList.length; i++) {
        this.dummyArray.push(this.TechnologyList[i].technologyValues);
      }
      Object.assign(this.userData, this.dummyArray);
    });
  }

  ngAfterViewInit() {}

  onChangeSearch(keyword: string) {
    this.isLoading = true;
    this.skillseekerdashboardService.getLocation(keyword).subscribe((response) => {
      this.isLoading = false;
      this.addressData = response;
    });
  }

  get jobtitle() {
    return this.form.get('jobtitle');
  }

  get location() {
    return this.form.get('location');
  }
  get technology() {
    return this.form.get('technology');
  }
  get richText() {
    return this.form.get('richText');
  }
  get level1() {
    return this.form.get('level1');
  }
  get level2() {
    return this.form.get('level2');
  }
  get experience() {
    return this.form.get('experience');
  }
  get skillSet() {
    return this.form.get('skillSet');
  }

  get project() {
    return this.form.get('project');
  }

  get department() {
    return this.form.get('department');
  }

  invokeEvent(place: Object, locate: string) {
    this.form.get('location').patchValue(locate);
    this.setAddress.emit(place);
  }

  onSkillsSetKeydown() {
    if (this.skillsSet && this.skillsSet.trim() != '') {
      if (this.skills.indexOf(this.skillsSet) !== -1 || this.skills.indexOf(this.capitalizeFirstLetter(this.skillsSet)) !== -1) {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Value already exist',
          showConfirmButton: false,
          timer: 1500,
        });
        this.skillsSet = '';
      } else {
        if (this.dummyArray.indexOf(this.skillsSet) !== -1) {
          this.skills.push(this.skillsSet);
          this.fixedskills.push(this.skillsSet);
          this.skillsSet = '';
        } else {
          this.extraskills.push(this.skillsSet);
          this.skills.push(this.skillsSet);
          this.skillsSet = '';
          /*let request = {
            technologyValues: this.skillsSet,
          };
          this.authnticationService.insertTechnologyList(request).subscribe(
            (data) => {
              this.skills.push(this.skillsSet);
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Value Added in Database',
                showConfirmButton: false,
                timer: 1500,
              });
              this.skillsSet = '';
            },
            (error) => {
              Swal.fire('Technology is already existed in Database!');
              this.skillsSet = '';
            }
          );*/
        }
      }
    }
  }

  change(item) {
    if (this.skills.indexOf(item) !== -1) {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Value already exist',
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      if (this.dummyArray.indexOf(item) !== -1) {
        this.fixedskills.push(this.skillsSet);
        this.skills.push(item);
      }
    }
    this.skillsSet = '';
  }

  skillsSetFocus() {
    this.skillsSetRefElement.nativeElement.focus();
  }

  dropSkill(index: any, skill) {
    this.skills.splice(index, 1);
    if (this.extraskills.includes(skill)) {
      this.extraskills.splice(this.extraskills.indexOf(skill), 1);
    }
    if (this.fixedskills.includes(skill)) {
      this.fixedskills.splice(this.fixedskills.indexOf(skill), 1);
    }
  }

  getUserIdsFirstWay($event) {
    let userId = (<HTMLInputElement>document.getElementById('userIdFirstWay')).value;
    this.userList1 = [];

    if (userId.length > 0) {
      if ($event.timeStamp - this.lastkeydown1 > 300) {
        this.userList1 = this.searchFromArray(this.userData, this.capitalizeFirstLetter(userId));
      }
    }
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  searchFromArray(arr, regex) {
    let matches = [],
      i;

    for (i = 0; i < arr.length; i++) {
      if (arr[i].match(regex)) {
        matches.push(arr[i]);
      }
    }
    return matches;
  }

  projectChange() {
    this.projectname = this.form.value.project.title.toString();
  }

  departmentChange() {
    this.departmentname = this.form.value.department.domainValues.toString();
  }

  next(i: number) {
    if (i === 8 && this.counter.toString().startsWith('0')) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Number of positions should be greater than 0',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    this.step = i;
  }
  skip(i: number) {
    this.step = i;
    this.skipvar = 'skip';
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/ssdashboard', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]).then(() => {
        const Toast = Swal.mixin({
          toast: true,
          width: 500,
          position: 'top',
          showConfirmButton: false,
          timer: 10000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });

        Swal.fire({
          icon: 'success',
          title: `${this.form.value.jobtitle} added successfully`,
          timer: 5000,
        });
      });
    });
    // var x = document.getElementById("snackbar") as HTMLElement;

    // // Add the "show" class to DIV
    // x.className = "show";

    // // After 3 seconds, remove the show class from DIV
    // setTimeout(()=>
    // {
    //    x.className = ""
    // }, 30000);
  }

  back(i: number) {
    this.step = i;
  }

  category(id: number) {
    if (id == 0) {
      this.category1 = false;
      this.category2 = false;
      this.category3 = false;
    }
    if (id == 1) {
      this.category1 = true;
      this.category2 = false;
      this.category3 = false;
    }
    if (id == 2) {
      this.category1 = false;
      this.category2 = true;
      this.category3 = false;
    }
    if (id == 3) {
      this.category1 = false;
      this.category2 = false;
      this.category3 = true;
    }
  }
  formatLabel(value: number) {
    if (value >= 1) {
      return Math.round(value / 1) + '%';
    }

    return value;
  }

  counter1() {
    if (this.counter <= 1) {
      this.counter = 1;
    } else {
      this.counter = --this.counter;
    }
  }

  counter2() {
    this.counter = ++this.counter;
  }

  getTechnologyList(): void {
    this.authnticationService.getTechnologyList().subscribe((response) => {
      this.Technologies = response;
    });
  }

  getDomainList(): void {
    this.authnticationService.getDomainList().subscribe((response) => {
      this.domainList = response;
    });
  }

  getSeekerProjectDetails(): void {
    this.authnticationService.getSeekerProjectDetails(this.skillSeekerId).subscribe((response) => {
      this.projectName = response;
    });
  }
  getData(): void {
    this.skillseekerdashboardService.getData().subscribe((response) => {});
  }

  selectedlevel(value) {
    this.selectedlvl = value;
  }

  setActive(buttonName) {
    // this.role = buttonName;
    // this.role = buttonName.skillLevelDescription;
    // this.roles = buttonName.skillLevelDescription
    this.activeButton = buttonName;
    this.condition = true;
    this.activeButton1 = ''
  }
  isActive(buttonName) {
    this.role = buttonName;
    return this.activeButton === buttonName;
  }
  isActive1(buttonName) {
    return this.activeButton1 === buttonName;
  }
  setActive1(buttonName) {
    // this.experienceVal = buttonName.experience
    // this.experienceId = buttonName.id
    this.activeButton1 = buttonName;
    for (let i = 0; i <= 11; i++) {
      if (buttonName === this.Experience[i]) {
        i += 1;
        this.id1 = i;
      }
    }
    this.condition = false;

  }
  isActive3(buttonName) {
    return this.activeButton3 === buttonName;
  }
  setActive3(data) {
    this.condition1 = false;

    this.id3 = data.id;
    this.activeButton3 = data.hiringPriority;
  }

  // setOptions() {
  //   setTimeout(() => {
  //     this.listOfOptions = this.optionss;
  //   }, 5000);
  // }

  sectionProcessMethod(jobId) {
    this.router.navigate(['/ssdashboard/ListItems/jobId/' + jobId]);
  }

  // myFunction() {
  //   // Get the snackbar DIV
  //   var x = document.getElementById("snackbar") as HTMLElement;

  //   // Add the "show" class to DIV
  //   x.className = "show";

  //   // After 3 seconds, remove the show class from DIV
  //   setTimeout(()=>
  //   {
  //      x.className = x.className.replace("show", "");
  //   }, 3000);
  // }

  submit() {
    this.show = true;
    this.authnticationService.getTechnologyList().subscribe((response) => {
      this.TechnologyList = response;
      for (let j = 0; j < this.fixedskills.length; j++) {
        for (let i = 0; i < this.TechnologyList.length; i++) {
          if (this.fixedskills[j] === this.TechnologyList[i].technologyValues) {
            var request = {
              technologyId: this.TechnologyList[i].technologyId,
            };
            this.array.push(request);
          }
        }
      }
    });

    setTimeout(() => {
      if (this.form.value.department === '' || this.form.value.project === '') {
        let request1: JobDto = {
          jobTitle: this.form.value.jobtitle,
          jobLocation: this.autocompleteInput,
          screeningQuestions: this.checkedvalue,
          ownerSkillTechnologiesEntity: this.array,
          jobDescription: this.form.value.richText.replace(/<[^>]*>/g, ''),
          ownerSkillYearOfExperience: {
            id: this.id1,
          },
          project: this.projectname ?? '',
          seekerProject: {
            id: 0,
            ownerSkillDomainEntity: {
              domainId: 9,
            },
          },
          hiringPriority: {
            id: this.id3,
          },
          numberOfPositions: this.counter,
          remote: this.form.value.remotePercent,
          travel: this.form.value.travelPercent,
          baseRate: this.baseRate,
          maxRate: this.maxRate,
          federalSecurityClearance: this.checkedvalue1,
          taxIdBusinessLicense: this.taxId,
          status: 'New',
          skillSeeker: {
            id: this.skillSeekerId,
          },
          customTech: this.extraskills.toString(),
        };

        this.skillseekerdashboardService.addJobDetails(request1).subscribe(
          (data) => {
            this.jobid = data.jobId;
            this.publish();
            this.show = false;
            console.log(request1);
          },
          (error) => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: error,
              showConfirmButton: false,
              timer: 1500,
            });
            this.show = false;
            return;
          }
        );
      } else {
        let request1: JobDto = {
          jobTitle: this.form.value.jobtitle,
          jobLocation: this.autocompleteInput,
          screeningQuestions: this.checkedvalue,
          ownerSkillTechnologiesEntity: this.array,
          jobDescription: this.form.value.richText.replace(/<[^>]*>/g, ''),
          ownerSkillYearOfExperience: {
            id: this.id1,
          },
          project: this.projectname ?? '',
          seekerProject: {
            id: this.form.value.project.id,
            ownerSkillDomainEntity: {
              domainId: this.form.value.department.domainId,
            },
          },
          hiringPriority: {
            id: this.id3,
          },
          ownerSkillDomainEntity: {
            domainId: this.form.value.department.domainId,
          },
          numberOfPositions: this.counter,
          remote: this.form.value.remotePercent,
          travel: this.form.value.travelPercent,
          baseRate: this.baseRate,
          maxRate: this.maxRate,
          federalSecurityClearance: this.checkedvalue1,
          taxIdBusinessLicense: this.taxId,
          status: 'New',
          skillSeeker: {
            id: this.skillSeekerId,
          },
          customTech: this.extraskills.toString(),
        };

        this.skillseekerdashboardService.addJobDetails(request1).subscribe(
          (data) => {
            this.jobid = data.jobId;
            this.publish();
            this.show = false;
            console.log(request1);
          },
          (error) => {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: error,
              showConfirmButton: false,
              timer: 1500,
            });
            this.show = false;
            return;
          }
        );
      }
    }, 5000);
  }

  publish() {
    if (this.jobid) {
      this.skillseekerdashboardService.publish(this.jobid).subscribe((response) => {});
      this.next(10);
      setTimeout(() => {
        this.reloadCurrentRoute();
      }, 2000);
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Job publish is failed because draft is not saved',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  converttoplain(html) {
    var temp = document.createElement('div');
    temp.innerHTML = html;
    return temp.textContent || temp.innerText || '';
  }

  getOwnerSkillYearOfExperienceDetails(): void {
    this.skillseekerdashboardService.getOwnerSkillYearOfExperienceDetails().subscribe((response) => {
      this.levelExperience = response;
      this.objs = this.levelExperience.map((x) => ({
        lvl: x[0],
        exp: x[1].split(','),
      }));
    });
  }

  getLevelData():void{
    this.skillOwnerdashboardService.getLevelData().subscribe((res)=>{
          this.levels=res
    })
  }

  getHiringPriority() {
    this.skillseekerdashboardService.getHiringPriority().subscribe((response) => {
      this.hiringPriority = response;
    });
  }

  getRetrieveJob() {
    this.authnticationService.user.subscribe((x) => (this.user = x));
    this.seekersId = this.user?.id;
    if (this.seekersId) {
      this.skillseekerdashboardService.getRetrieveJob(this.seekersId).subscribe((response) => {
        this.tabledata = response;
        this.tabledata.forEach((element) => {
          if (element['status'] === 'Active') element['status'] = 'New';
        });
        this.tabledata = this.tabledata.sort((a, b) => {
          return a.jobId.slice(4) - b.jobId.slice(4);
        });
        this.cdr.detectChanges();
      });
    }
  }

  listData(x: any) {
    this.selected = x;
  }

  isActive2(buttonName) {
    return this.activeButton2 === buttonName;
  }
  setActive2(buttonName) {
    this.activeButton2 = buttonName;
  }

  getAddress(place: object) {
    this.address = place['formatted_address'];
    this.phone = this.getPhone(place);
    this.formattedAddress = place['formatted_address'];
    this.zone.run(() => (this.formattedAddress = place['formatted_address']));
  }

  getEstablishmentAddress(place: object) {
    this.establishmentAddress = place['formatted_address'];
    this.phone = this.getPhone(place);
    this.formattedEstablishmentAddress = place['formatted_address'];
    this.zone.run(() => {
      this.formattedEstablishmentAddress = place['formatted_address'];
      this.phone = place['formatted_phone_number'];
    });
  }

  getAddrComponent(place, componentTemplate) {
    let result;

    for (let i = 0; i < place.address_components.length; i++) {
      const addressType = place.address_components[i].types[0];
      if (componentTemplate[addressType]) {
        result = place.address_components[i][componentTemplate[addressType]];
        return result;
      }
    }
    return;
  }

  getStreetNumber(place) {
    const COMPONENT_TEMPLATE = { street_number: 'short_name' },
      streetNumber = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return streetNumber;
  }

  getStreet(place) {
    const COMPONENT_TEMPLATE = { route: 'long_name' },
      street = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return street;
  }

  getCity(place) {
    const COMPONENT_TEMPLATE = { locality: 'long_name' },
      city = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return city;
  }

  getState(place) {
    const COMPONENT_TEMPLATE = { administrative_area_level_1: 'short_name' },
      state = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return state;
  }

  getDistrict(place) {
    const COMPONENT_TEMPLATE = { administrative_area_level_2: 'short_name' },
      state = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return state;
  }

  getCountryShort(place) {
    const COMPONENT_TEMPLATE = { country: 'short_name' },
      countryShort = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return countryShort;
  }

  getCountry(place) {
    const COMPONENT_TEMPLATE = { country: 'long_name' },
      country = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return country;
  }

  getPostCode(place) {
    const COMPONENT_TEMPLATE = { postal_code: 'long_name' },
      postCode = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return postCode;
  }

  getPhone(place) {
    const COMPONENT_TEMPLATE = {
        formatted_phone_number: 'formatted_phone_number',
      },
      phone = this.getAddrComponent(place, COMPONENT_TEMPLATE);
    return phone;
  }

  viewCandidate(jobId: string): void {
    this.router.navigate(['/ssdashboard/candidatesuggestion/jobId/' + jobId]);
  }

  viewRequirement(jobId: string): void {
    this.router.navigate(['/ssdashboard/widgets/jobId/' + jobId]);
  }

  getCandidateSuggestion(jobId: string): void {
    this.isLoading = true;
    this.skillseekerdashboardService.getCandidateSuggetion(jobId).subscribe((response) => {
      this.candidateSuggestionList = response;
      if (this.candidateSuggestionList.length === 0) {
        this.router.navigate(['/ssdashboard/joblist']);
      }
    });
  }

  EnableDisable(event) {
    if (event.target.checked) {
      this.checkedvalue = true;
      this.checked = 'ENABLE';
    } else {
      this.checkedvalue = false;
      this.checked = 'DISABLE';
    }
  }

  resetChecked() {}

  required(event) {
    if (event.target.checked) {
      this.checkedvalue1 = true;
      this.checked1 = 'Required';
    } else {
      this.checkedvalue1 = false;
      this.checked1 = 'Not Required';
    }
  }

  onSearchTextEntered(searchValue: string) {
    this.searchText = searchValue;
  }
  textChanged($event) {
    this.currentEditorTextLength = $event.editor.getLength() - 1;
    if ($event.editor.getLength() > this.maxEditorTextLength) {
      $event.editor.deleteText(this.maxEditorTextLength, $event.editor.getLength());
    }
  }
}
