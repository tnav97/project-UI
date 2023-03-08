import { DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, first } from 'rxjs/operators';
import { FileResponse, Registration, SkillOwnerPortfolio } from 'src/app/api/flexcub-api/models';
import { AppService } from 'src/app/app.service';
import { emailRegex, ownerImgUrl, phoneRegex } from 'src/app/core/Constants/constant';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../authentication/authentication.service';
import { skillseekerdashboardService } from '../../skillseeker-dashboard/skillseeker-dashboard.service';
import { SkillownerDashboardService } from '../skillowner-dashboard.service';

@Component({
  selector: 'app-career-profile',
  templateUrl: './career-profile.component.html',
  styleUrls: ['./career-profile.component.scss'],
  providers: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CareerProfileComponent implements OnInit {

  dateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const start = control.get('contractstartdate');
    const end = control.get('contractenddate');
    return start.value !== null &&
      end.value !== null &&
      this.datePipe.transform(start.value, 'yyyy-MM-dd') < this.datePipe.transform(end.value, 'yyyy-MM-dd')
      ? null
      : { dateValid: true };
  };


  dateValidator1: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const start = control.get('visaStart');
    const end = control.get('visaEnd');
    return start.value !== null &&
      end.value !== null &&
      this.datePipe.transform(start.value, 'yyyy-MM-dd') < this.datePipe.transform(end.value, 'yyyy-MM-dd')
      ? null
      : { dateValid: true };
  };

  @ViewChild('picSelector') picSelector!: ElementRef<HTMLInputElement>;
  form: UntypedFormGroup;
  form1!: UntypedFormGroup;
  ownerDetails=[]
  array = [];
  image: any;
  today1 = new Date();
  storedId = [];
  // form1:FormGroup;
  uploadData: FormData;
  resumeFile: File = null; // Variable to store file to Upload
  fileName: string = ' '; // Variable to store file name
  imageError: string = '';
  ownerId: number;
  imageUrl: string = '';
  fileToUpload: File;
  isDisabled: boolean = false;
  staticImage: boolean = true;
  selectedfile1: boolean = false;
  allowed: boolean = false;
  receivedImageData: any;
  base64Data: any;
  convertedImage: any;
  group!: UntypedFormGroup;
  file: any;
  uploadedResume: FormData;
  uploadedFederal: FormData;
  fileToUploadResume: File;
  otherDocument: FormData;
  // Technologies: any;
  // domainList: any;
  levelExperience: any;

  genders: any;
  stateList: any;
  cityList: any;
  objs: any;
  objs1: any;
  visaStatuses: any;
  checked: boolean = false;
  orderForm!: UntypedFormGroup;
  items!: UntypedFormArray;
  progressValue: number = 0;
  progressValue1: number = 0;
  project: string;
  soImgUrl = ownerImgUrl;
  submitted: boolean = false;
  clientId: number;
  Aboutme: string = '';
  initialvalues = {
    technology: '',
    role: '',
    skillLevel: '',
    domain: '',
    lastUsed: '',
    experience: '',
  };
  skillSetForm = new UntypedFormGroup({
    technology: new UntypedFormControl('', Validators.required),
    role: new UntypedFormControl('', Validators.required),
    skillLevel: new UntypedFormControl('', Validators.required),
    domain: new UntypedFormControl('', Validators.required),
    lastUsed: new UntypedFormControl('', Validators.required),
    experience: new UntypedFormControl('',Validators.required ),
  });

  workDetailsForm = new UntypedFormGroup(
    {
      jobtitle: new UntypedFormControl('', [Validators.required]),
      companyname: new UntypedFormControl('', [Validators.required]),
      contractstartdate: new UntypedFormControl('', [Validators.required]),
      contractenddate: new UntypedFormControl('', [Validators.required]),
      project: new UntypedFormControl('', [Validators.required]),
      projectDesc: new UntypedFormControl('', [Validators.required]),
      department: new UntypedFormControl('', [Validators.required]),
      location: new UntypedFormControl('', [Validators.required]),
    },
    { validators: this.dateValidator }
  );

  otherDocs: any = new UntypedFormGroup({
    otherDocument: new UntypedFormControl(''),
  });
  otherDocs1: any = new UntypedFormGroup({
    otherDocument: new UntypedFormControl(''),
  });
  otherFiles:File[]= [];
  selected: any;

  countryList: any;
  id1: any;
  techArr: any = [];
  rolesArr: any = [];
  levelArr:any = [] || undefined;
   ExpArr:any =[];
  DomainArr: any = [];
  lastUsed: any;
  domainId: any;
  levelId:any;
  rolesId: any;
  changeExp: any;
  finalExpData: any;
  exp: any;
  today = new Date();
  getALLTableDataResult: any = [];
  skillSetLevelId: any;
  technologyId: any;
  objsskillSet: any=[];
  getExpData: any = [];
  getExpData2: any = [];
  file2: boolean = false;
  fieldTextType: boolean;
  isLoading: boolean = true;
  userStatus: string;
  isImageLoading: any;
  imageToShow: any;
  show1 = false;
  show2 = false;
  show3 = false;
  num: number = 0;
  file1: boolean = false;
  resumefile: File;
  num1: number = 0;
  aboutme: string;
  resumeFiles: File[] = [];
  federalFile: File[] = [];
  resumeDoc: any = new UntypedFormGroup({
    resumefile: new UntypedFormControl(''),
  });
  federalDoc: any = new UntypedFormGroup({
    federalfile: new UntypedFormControl(''),
  });
  editSkillSetValues: boolean = false;
  user?: Registration;
  maxNumberOfCharacters = 500;
  numberOfCharacters1 = 0;
  numberOfCharacters2 = 0;
  address: string;
  genderreq: any;
  exp2: any;
  ownerclientdetails: any;
  personalDetailsisValid: any = null;
  checkedvalue1:boolean

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private skillOwnerdashboardService: SkillownerDashboardService,
    private authenticationService: AuthenticationService,
    private readonly skillseekerdashboardService: skillseekerdashboardService,
    private HttpClient: HttpClient,
    private fb: UntypedFormBuilder,
    private cdr: ChangeDetectorRef,
    private datePipe: DatePipe,
    private readonly _appService: AppService
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
    this.form = new UntypedFormGroup({
      firstName: new UntypedFormControl({ value: '', disabled: true }, [Validators.required]),
      lastName: new UntypedFormControl({ value: '', disabled: true }, [Validators.required]),
      dob: new UntypedFormControl({ value: '', disabled: true }, [Validators.required]),
      email: new UntypedFormControl({ value: '', disabled: true }, [Validators.required, Validators.email, Validators.pattern(emailRegex)]),
      alternateEmail: new UntypedFormControl('', [Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      phone: new UntypedFormControl({ value: '', disabled: true }, [Validators.required, Validators.pattern(phoneRegex)]),
      Alternatephonenumber: new UntypedFormControl('', [Validators.pattern('^[6-9]{1}[0-9]{9}$')]),
      status: new UntypedFormControl('', [Validators.required]),
      aboutme: new UntypedFormControl('', [Validators.required]),
      gender: new UntypedFormControl('', [Validators.required]),
      resumefile: new UntypedFormControl('', [Validators.required]),
      multifile: new UntypedFormControl('', [Validators.required]),
      SSN: new UntypedFormControl('', [ssnInputValidator]),
      state: new UntypedFormControl(''),
      city: new UntypedFormControl(''),
      check: new UntypedFormControl(false),
      state1: new UntypedFormControl(''),
      city1: new UntypedFormControl(''),
      addressline1: new UntypedFormControl('', Validators.compose([Validators.required])),
      addressline2: new UntypedFormControl(),
      addressline3: new UntypedFormControl(),
      addressline4: new UntypedFormControl(),
      zipcode: new UntypedFormControl('', Validators.compose([Validators.required])),
      zipcode1: new UntypedFormControl(),
      linkedinurlprofileurl: new UntypedFormControl(),
      otherportfoliourl: new UntypedFormControl(),
      companyname: new UntypedFormControl(),
      jobtitle: new UntypedFormControl(),
      contractstartdate: new UntypedFormControl(),
      contractenddate: new UntypedFormControl(),
      project: new UntypedFormControl(),
      //rate: new UntypedFormControl('', Validators.compose([Validators.required])),
      department: new UntypedFormControl(),
      location: new UntypedFormControl(),
      years: new UntypedFormControl(''),
      months: new UntypedFormControl(''),
      statusVisa: new UntypedFormControl('', Validators.compose([Validators.required])),
      usAuthorization: new UntypedFormControl('', Validators.compose([Validators.required])),
      federalSecurityClearance: new UntypedFormControl('', Validators.compose([Validators.required])),
      visaStart: new UntypedFormControl('',Validators.required),
      visaEnd: new UntypedFormControl('',Validators.required),
      usc: new UntypedFormControl('', Validators.compose([Validators.required])),
      visaStatus: new UntypedFormControl('', Validators.compose([Validators.required])),

    },
    { validators: this.dateValidator1 }
    );

    this.form1 = new UntypedFormGroup({
      multifile: new UntypedFormControl('', [Validators.required]),
      SSN: new UntypedFormControl(''),
      gender: new UntypedFormControl(''),
      state: new UntypedFormControl(''),
      city: new UntypedFormControl(''),
      state1: new UntypedFormControl(''),
      city1: new UntypedFormControl(''),
      addressline1: new UntypedFormControl(),
      addressline2: new UntypedFormControl(),
      addressline3: new UntypedFormControl(),
      addressline4: new UntypedFormControl(),
      zipcode: new UntypedFormControl(),
      zipcode1: new UntypedFormControl(),
      linkedinurlprofileurl: new UntypedFormControl(),
      otherportfoliourl: new UntypedFormControl(),
      companyname: new UntypedFormControl(),
      jobtitle: new UntypedFormControl(),
      contractstartdate: new UntypedFormControl(),
      contractenddate: new UntypedFormControl(),
      project: new UntypedFormControl(),
      rate: new UntypedFormControl(),
      department: new UntypedFormControl(),
      location: new UntypedFormControl(),
      years: new UntypedFormControl(''),
      months: new UntypedFormControl(''),
    });
  }

  // preload(){
  //   this.getOwnerInfo()
  //     .then(() => {

  //     });
  // }

//   getOwnerInfo(): Promise<void> {
//     return new Promise((resolve) => {
//       const id = this.user?.id;
//       if (!id) return resolve()
//   })
// }



  ngOnInit(): void {
    // this.preload()
    this.today.setFullYear(this.today.getFullYear() - 18);
    this.ownerId = this.user?.id;
    this.getById(this.ownerId);
    this.getTechData();
    this.getRolesData();
    this.getLevelData();
    this.getDomainData();
    // this.getOwnerSkillSetYearOfExperienceDetails();
    this.getOwnerSkillYearOfExperienceDetails();
    this.getStateList();
    this.getCityList();
    this.getCountryList();
    this.downloadImage();
    // this.getfileDownloadFederal();
    this.downloadFederal()
    this.getAllTableData();
    this.getClient();
    this.getVisa();
    this.getGenderList();
    this.orderForm = new UntypedFormGroup({
      items: new UntypedFormArray([]),
    });
    this.otherDocument = new FormData();
    this.getResumeFiles();
    this.getOtherFiles();

    this.getdownloadImage();
    this.form.valueChanges.subscribe((value) => {
      if (
        value.ssn != '' &&
        this.ssn.valid &&
        value.years != '' &&
        value.months != '' &&
        value.rate != '' &&
        value.addressline1 != '' &&
        value.state != '' &&
        value.city != '' &&
        value.zipcode != ''
      ) {
        this.personalDetailsisValid = null;
      } else {
        this.personalDetailsisValid = true;
      }
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  public trackItem(index: number, getALLTableDataResult: any) {
    return getALLTableDataResult.id;
  }

  onOpenCalendar(container) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');

    // date: new Date();
  }

  handler() {}

  // resume upload funtion
  getResume(event: Event) {
    this.resumeFiles = [];
    const pattern = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    const files = (event.target as HTMLInputElement)?.files;
    if (pattern.includes(files[0].type)) {
      this.resumeFiles.push(files[0]);

      this.file1 = true;
      this.uploadedResume = new FormData();

      this.uploadedResume.append('resume', this.resumeFiles[0], this.resumeFiles[0]?.name);
      this.skillOwnerdashboardService.insertAttachment2(this.ownerId, this.resumeFiles[0] as Blob).subscribe(
        (res) => {
          this.show1 = true;
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Resume added successfully',
            showConfirmButton: false,
            timer: 1500,
          });
        },
        (error) => {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: error,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      );

      for (var i = 0; i <= 100; i++) {
        this.progressValue = i;
      }
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Please select pdf or word document',
        showConfirmButton: false,
        timer: 1500,
      });
      this.resumeDoc.reset();
    }
  }

  getFederal(event: Event) {
    this.federalFile = [];
    const pattern = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    const files = (event.target as HTMLInputElement)?.files;
    if (pattern.includes(files[0].type)) {
      this.federalFile.push(files[0]);

      this.file1 = true;
      this.uploadedFederal = new FormData();

      this.uploadedFederal.append('federal', this.federalFile[0], this.federalFile[0]?.name);
      this.skillOwnerdashboardService.insertAttachment4(this.ownerId, this.federalFile[0] as Blob).subscribe(
        (res) => {
          this.show1 = true;
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Federal added successfully',
            showConfirmButton: false,
            timer: 1500,
          });
        },
        (error) => {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: error,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      );

      for (var i = 0; i <= 100; i++) {
        this.progressValue = i;
      }
    } else {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Please select pdf or word document',
        showConfirmButton: false,
        timer: 1500,
      });
      this.resumeDoc.reset();
    }
  }

  changeStatus(event) {
    if (event.target.checked) {
      this.userStatus = 'Active';
    } else {
      this.userStatus = 'Not Active';
    }
  }

  getVisa() {
    this.skillOwnerdashboardService.getVisa().subscribe((response) => {
      this.visaStatuses = response;
    });
  }
  //other document upload function
  otherfile(event: Event): void {
    const files = (event.target as HTMLInputElement)?.files;
    if (files.length === 0) return;

    if (this.storedId.length == 0) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: `Already maximim files uploaded `,
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    if (files.length > this.storedId.length) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: `Maximim files can be uploaded upto ${this.storedId.length}`,
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    for (let i = 0; i < files.length; i++) {
      this.skillOwnerdashboardService.insertAttachment1(this.ownerId, this.storedId[i], files[i]).subscribe(
        (res) => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Other files Added Succesfully',
            showConfirmButton: false,
            timer: 1500,
          });
        },
        (error) => {
          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: error,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      );
    }
    this.progressValue1 = 100;
  }

  getQueryParams(): void {
    this.activatedRoute.params
      .pipe(
        filter((param: Params) => !!param),
        first()
      )
      .subscribe((param: Params) => {});
  }

  // On file Select
  formfile1: any = new UntypedFormGroup({
    multifile: new UntypedFormControl('', [Validators.required]),
  });

  getCountryList() {
    this.skillOwnerdashboardService.getState().subscribe((response) => {
      this.countryList = response;
    });
  }

  createItem(): UntypedFormGroup {
    return this.fb.group({
      portfolioUrls: '',
      id: 0,
    });
  }
  addItem(): void {
    this.items = this.orderForm.get('items') as UntypedFormArray;
    this.items.push(this.createItem());
  }

  get email() {
    return this.form.get('email');
  }

  get status() {
    return this.form.get('status');
  }

  get alternateEmail() {
    return this.form.get('alternateEmail');
  }

  get phone() {
    return this.form.get('phone');
  }

  get Alternatephonenumber() {
    return this.form.get('Alternatephonenumber');
  }

  get firstName() {
    return this.form.get('firstName');
  }

  get lastName() {
    return this.form.get('lastName');
  }

  get dob() {
    return this.form.get('dob');
  }

  get stateValue() {
    return this.form.get('state');
  }

  get cityValue() {
    return this.form.get('city');
  }

  // get visaStatus() {
  //   return this.form.get('visaStatus');
  // }

  get visaStart() {
    return this.form.get('visaStart');
  }

  get visaEnd() {
    return this.form.get('visaEnd');
  }

  getfile(event) {
    const max_size = 1024000;

    if (
      event.target.files[0].type == 'image/png' ||
      event.target.files[0].type == 'image/jpeg' ||
      event.target.files[0].type == 'image/gif' ||
      event.target.files[0].type == 'image/jpg' ||
      event.target.files[0].type == 'application/pdf' ||
      event.target.files[0].type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      event.target.files[0].type == 'application/msword'
    ) {
      if (event.target.files[0].size > max_size) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'filesize is morethan 1mb/Select image type of JPEG,JPG,PNG',
          showConfirmButton: false,
          timer: 5000,
        });
      }
      if (
        event.target.files[0].type == 'image/gif' ||
        event.target.files[0].type == 'application/pdf' ||
        event.target.files[0].type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        event.target.files[0].type == 'application/msword'
      ) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Failed to upload image, format not supported',
          showConfirmButton: false,
          timer: 5000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 1200);
        this.imageError = 'Maximum size allowed is ' + max_size / 1000 + 'Mb';
        return false;
      } else {
        this.fileToUpload = event.target.files[0];

        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);

        reader.onload = (event: any) => {
          this.imageUrl = event.target.result;
          document.getElementById('img').setAttribute('src', event.target.result);
        };

        if (this.fileToUpload) {
          this.uploadData = new FormData();
          this.uploadData.append('image', this.fileToUpload, this.fileToUpload.name);

          this.skillOwnerdashboardService.insertAttachment(this.ownerId, this.fileToUpload).subscribe(
            (res) => {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Profile picture added successfully',
                showConfirmButton: false,
                timer: 1500,
              });
            },
            (error) => {
              Swal.fire({
                position: 'center',
                icon: 'error',
                title: error,
                showConfirmButton: false,
                timer: 1500,
              });
            }
          );
        }
      }
    } else {
      this.form.reset();
    }
    this.staticImage = false;
  }

  getById(id: number) {
    this.skillOwnerdashboardService.getById(id).subscribe((data) => {
     this.ownerDetails[0]= data;
     console.log(data);

      if (data.ownerSkillStatusEntity !== null) {
        if (data.ownerSkillStatusEntity.skillOwnerStatusId === 1) {
          this.userStatus = 'Active';
          this.form.get('status').patchValue(true);
        } else {
          this.userStatus = 'Not Active';
          this.form.get('status').patchValue(false);
        }
      }

      if(data.federalSecurityClearance == true){
        this.checkedvalue1=true;
        this.form.get('federalSecurityClearance').patchValue(true)
      }
        else{
          this.checkedvalue1=false;
          this.form.get('federalSecurityClearance').patchValue(false)
        }




      this.form.get('firstName').patchValue(data?.firstName);
      this.form.get('lastName').patchValue(data?.lastName);
      this.form.get('dob').patchValue(this.datePipe.transform(data?.dob, 'MM-dd-YYYY'));
      this.form.get('email').patchValue(data?.primaryEmail);
      this.form.get('alternateEmail').patchValue(data?.alternateEmail);
      this.form.get('phone').patchValue(data?.phoneNumber);

      this.form.get('Alternatephonenumber').patchValue(data?.alternatePhoneNumber);
      const object = this.genders?.find((obj) => obj.id === data.gender.id);
      if (object) {
        this.form.get('gender').patchValue(object);
      }
      this.form.get('aboutme').patchValue(data?.aboutMe);
      if (data.aboutMe) {
        this.numberOfCharacters1 = data?.aboutMe.length;
      }
      this.form.get('months').patchValue(data?.expMonths);
      this.form.get('years').patchValue(data?.expYears);
      if (data?.address) {
        const myArray = data?.address.split(',');
        this.form.get('addressline1').patchValue(myArray[0] ?? '');
        this.form.get('addressline2').patchValue(myArray[1] ?? '');
        this.form.get('zipcode').patchValue(myArray[2]);
        this.form.get('state').patchValue(data?.state);
        this.getCityList();
        this.form.get('check').patchValue(true);
        this.form.get('addressline3').patchValue(myArray[0]);
        this.form.get('addressline4').patchValue(myArray[1]);
        this.form.get('addressline3').patchValue(myArray[0] ?? '');
        this.form.get('addressline4').patchValue(myArray[1] ?? '');
        this.form.get('zipcode1').patchValue(myArray[2]);
        this.form.get('city').patchValue(data?.city);
        this.form.get('state1').patchValue(data?.state);
        this.form.get('city1').patchValue(data?.city);
      }
      this.form.get('linkedinurlprofileurl').patchValue(data?.linkedIn);
      this.form.get('SSN').patchValue(data?.ssn);
      this.form.get('usAuthorization').patchValue(data?.usAuthorization);
      this.form.get('statusVisa').patchValue(data?.statusVisa);
      // this.form.get('federalSecurityClearance').patchValue(data?.federalSecurityClearance);
      this.form.get('visaStart').patchValue(this.datePipe.transform(data?.visaStartDate, 'MM-dd-YYYY'));
      this.form.get('visaEnd').patchValue(this.datePipe.transform(data?.visaEndDate, 'MM-dd-YYYY'));
      // this.form.get('visaValidity').patchValue(this.datePipe.transform(data?.visaValidity, 'MM-dd-YYYY'));
      this.form.get('usc').patchValue(data?.usc);

      data?.portfolioUrl?.forEach((e) => (this.orderForm.get('items') as UntypedFormArray)?.push(this.fb.group(e)));

    });
  }


  onKeyUp(event: any): void {
    this.numberOfCharacters1 = event.target.value.length;

    if (this.numberOfCharacters1 > this.maxNumberOfCharacters) {
      event.target.value = event.target.value.slice(0, this.maxNumberOfCharacters);
      this.numberOfCharacters1 = this.maxNumberOfCharacters;
    }
  }

  onKeyUp2(event: any): void {
    this.numberOfCharacters2 = event.target.value.length;

    if (this.numberOfCharacters2 > this.maxNumberOfCharacters) {
      event.target.value = event.target.value.slice(0, this.maxNumberOfCharacters);
      this.numberOfCharacters2 = this.maxNumberOfCharacters;
    }
  }

  keyPressNumbers(event) {
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  remove1() {
    this.resumeFiles = [];
    this.resumeDoc.reset();
    this.file1 = false;
  }

  remove(n:File,j:number): void {
    this.skillOwnerdashboardService.deletePortfolio1(this.ownerId as number, j).subscribe(
      (res) => {
        this.otherFiles.splice(j, 1);
        this._appService.toastr(`${n?.name} Deleted Successfully`, { icon: 'success' });
      }, (err) => this._appService.toastr(err));
  }

  save() {
    if (!this.show1) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Resume is mandatory',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    // if (this.form.value.gender === '') {
    //   this.genderreq = null;
    // } else {
    //   this.genderreq = this.form.value.gender;
    // }
    var request2 = {
      skillOwnerEntityId: this.ownerId,
      primaryEmail: this.form.value.email,
      ownerSkillStatusEntity: {
        skillOwnerStatusId: this.form.value.status === true ? 1 : 2,
      },
      // status: this.userStatus,
      phoneNumber: this.form.value.phone,
      aboutMe: this.form.value.aboutme,
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      alternateEmail: this.form.value.alternateEmail,
      alternatePhone: this.form.value.Alternatephonenumber,
      gender: this.form.value.gender === '' ? null : this.form.value.gender,
    };
    this.skillOwnerdashboardService.updateOwnerProfile(request2).subscribe(
      (res) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Basic details added successfully',
          showConfirmButton: false,
          timer: 1500,
        });
      },

      (error) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: error,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    );
  }
  removePortfolio(index: number) {
    (this.orderForm.get('items') as FormArray).removeAt(index);
  }

  save1() {
    var request = {
      skillOwnerEntityId: this.ownerId,
      primaryEmail: this.form.value.email,
      ownerSkillStatusEntity: {
        skillOwnerStatusId: this.form.value.status === true ? 1 : 2,
      },
      phoneNumber: this.form.value.phone,
      aboutMe: this.form.value.aboutme,
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      alternateEmail: this.form.value.alternateEmail,
      alternatePhone: this.form.value.Alternatephonenumber,
      ssn: this.form.value.SSN,
      rateCard: this.form.value.rate,
      state: this.form.value.state,
      city: this.form.value.city,
      address: `${this.form.value.addressline1},${this.form.value.addressline2},${this.form.value.zipcode}`,
      expMonths: parseInt(this.form.value.months),
      expYears: parseInt(this.form.value.years),
      linkedIn: this.form.value.linkedinurlprofileurl,
      portfolioUrl: ((this.orderForm.get('items') as UntypedFormArray)?.value as Array<SkillOwnerPortfolio>) ?? [],
      usc: this.form.value.usc == 'true' ? true : false,
      federalSecurityClearance: this.checkedvalue1 == true ? true : false,
      usAuthorization: this.form.value.usAuthorization == 'true' ? true : false,
      statusVisa: this.form.value.statusVisa,
      visaStartDate:this.datePipe.transform(this.form.value.visaStart, 'yyyy-MM-dd'),
      visaEndDate: this.datePipe.transform(this.form.value.visaEnd,'yyyy-MM-dd'),
      visaStatus: {
        visaId: this.form.value.visaStatus.visaId,
      },
    };

    this.skillOwnerdashboardService.updateOwnerProfile(request).subscribe(
      (response) => {
        this.isLoading = false;
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Personal details added successfully',
          showConfirmButton: false,
          timer: 1500,
        });
      },
      (error) => {
        this.isLoading = false;
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: error,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    );
  }

  getClient() {
    this.skillOwnerdashboardService.getClient(this.ownerId).subscribe((res) => {
      this.ownerclientdetails = res;
      if (this.ownerclientdetails) {
        var clientData = this.ownerclientdetails.client;
        for (let j = 0; j < clientData.length; j++) {
          if (clientData[j].currentEmployer === true) {
            this.workDetailsForm.get('jobtitle').patchValue(clientData[j].jobTitle);
            this.workDetailsForm.get('companyname').patchValue(clientData[j].employerName);
            this.workDetailsForm.get('contractstartdate').patchValue(this.datePipe.transform(clientData[j].startDate, 'MM-dd-YYYY'));
            this.workDetailsForm.get('contractenddate').patchValue(this.datePipe.transform(clientData[j].endDate, 'MM-dd-YYYY'));
            this.workDetailsForm.get('project').patchValue(clientData[j].project);
            this.workDetailsForm.get('projectDesc').patchValue(clientData[j].projectDescription);
            this.workDetailsForm.get('department').patchValue(clientData[j].department);
            this.workDetailsForm.get('location').patchValue(clientData[j].location);
          }
        }
      }
    });
  }

  save2() {
    var request1 = {
      skillOwnerEntityId: this.ownerId,
      jobTitle: this.workDetailsForm.value.jobtitle,
      employerName: this.workDetailsForm.value.companyname,
      project: this.workDetailsForm.value.project,
      projectDescription: this.workDetailsForm.value.project,
      department: this.workDetailsForm.value.department,
      startDate: this.datePipe.transform(this.workDetailsForm.value.contractstartdate, 'yyyy-MM-dd'),
      endDate: this.datePipe.transform(this.workDetailsForm.value.contractenddate, 'yyyy-MM-dd'),
      currentEmployer: true,
      location: this.workDetailsForm.value.location,
    };

    this.skillOwnerdashboardService.insertClient(request1).subscribe(
      (response) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Work details added successfully',
          showConfirmButton: false,
          timer: 1500,
        });
      },
      (error) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: error,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    );
  }

  fedaralSecurity(event){
    if (event.target.checked) {
      this.checkedvalue1 = true;
    }
    else {
      this.checkedvalue1 = false;

    }
  }

  // deleteOtherFile(n: File, i: number): void {
  //   this.skillOwnerdashboardService.deletePortfolio1(this.user?.id as number, i)
  //     .subscribe(() => {
  //       this.otherFiles.splice(i, 1);
  //       this._appService.toastr(`${n?.name} Deleted Successfully`, { icon: 'success' });
  //     }, (err) => this._appService.toastr(err));
  // }

  // uploadFedaral(): void {
  //   this.picSelector.nativeElement?.click();
  //   this.picSelector.nativeElement.onchange = (e: Event) => {
  //     const files = (e?.target as HTMLInputElement)?.files ?? [];
  //     const threshold = (1024 * 1000) * 1; //1MB
  //     // const inventory = [] as File[];
  //     if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(files[0]?.type ?? '')) return this._appService.toastr('Select the document type of PDF, WORD, DOC', { icon: 'error' });
  //     if (files[0]?.size > threshold) return this._appService.toastr('File size is has to be lesser or equal to 3MB.', { icon: 'error' });

  //     this.skillOwnerdashboardService.insertAttachment4(this.user?.id as number, files[0])
  //       .subscribe(() => {
  //         this.federalFile = [];
  //         this.federalFile.push(files[0]);
  //         this._appService.toastr('Fedaral file Added Successfully', { icon: 'success' });
  //       }, (err) => {
  //         this._appService.toastr(err, { icon: 'error' });
  //       });

  //   };
  // }


  getResumeFiles(): void {
    this.skillOwnerdashboardService.downloadResume(this.ownerId).subscribe(
      (data: FileResponse) => {
        /* if (i === 2) {
          const el = document.createElement('a');
          el.href = data?.fileDownloadUri;
          el.target = '_blank';
          document.body.appendChild(el);
          el.click();
          return;
        } */

        const file = {
          name: data?.fileName,
          lastModified: 1664008613761,
          lastModifiedDate: '',
          webkitRelativePath: data?.fileDownloadUri,
          size: data?.size,
        };

        this.resumeFiles.push(file as any);

        for (let j = 0; j <= 100; j++) {
          this.progressValue = j;
        }
        this.show1 = true;
        this.cdr.detectChanges();
        // if you want to open PDF in new tab
      },
      (error: HttpErrorResponse) => {
        //
      }
    );
  }

  // getOtherFiles(): void {
  //   for (let i = 1; i <= 3; i++) {
  //     this.skillOwnerdashboardService.otherFilesDownload(this.ownerId, i).subscribe(
  //       (data: FileResponse) => {
  //         /* if (i === 2) {
  //           const el = document.createElement('a');
  //           el.href = data?.fileDownloadUri;
  //           el.target = '_blank';

  //           document.body.appendChild(el);
  //           el.click();
  //           return;
  //         } */

  //         const file = {
  //           name: data?.fileName,
  //           id: i,
  //           lastModified: 1664008613761,
  //           lastModifiedDate: 'Sat Sep 24 2022 14:06:53 GMT+0530 (India Standard Time)',
  //           webkitRelativePath: data?.fileDownloadUri,
  //           size: data?.size,
  //         };
  //         this.show2 = true;
  //         this.otherFiles.push(file as any);
  //         if (this.otherFiles.length === 3) {
  //           this.show3 = true;
  //         }
  //         this.cdr.detectChanges();
  //         this.progressValue1 = 100;
  //       },
  //       (error: HttpErrorResponse) => {
  //         this.storedId.push(i);
  //       }
  //     );
  //   }
  // }

  // getfileDownloadFederal(){
  //   this.skillOwnerdashboardService.fileDownloadFederal(this.user?.id as number)
  //     .subscribe((j) => {
  //       const k = {
  //         name: j?.fileName, size: j?.size,
  //         lastModified: 1664008613761,
  //         lastModifiedDate: '',
  //         webkitRelativePath: j?.fileDownloadUri,
  //       };
  //       this.fedaralFile.push(k as any);
  //     }, (err) => { });
  // }

  downloadFederal(){
    this.skillOwnerdashboardService.downloadFederal(this.user?.id as number)
      .subscribe((j) => {
        const k = {
          name: j?.fileName, size: j?.size,
          lastModified: 1664008613761,
          lastModifiedDate: '',
          webkitRelativePath: j?.fileDownloadUri,
        };
        this.federalFile.push(k as any);
      }, (err) => { });
  }

  getOtherFiles(): void {
    this.skillOwnerdashboardService.otherFilesDownload(this.user?.id as number)
      .subscribe((j) => {
        const k = {
          name: j?.fileName, size: j?.size,
          lastModified: 1664008613761,
          lastModifiedDate: '',
          webkitRelativePath: j?.fileDownloadUri,
        };
        this.otherFiles.push(k as any);
      }, (err) => { });
  }
  get ssn() {
    return this.form.get('SSN');
  }
  getdownloadImage() {
    this.skillOwnerdashboardService.downloadImage(this.ownerId).subscribe(
      (data: Blob) => {
        var file = new Blob([data]);
        this.isImageLoading = true;
        this.isLoading = false;

        this.cdr.detectChanges();
      },
      (error) => {
        this.isLoading = false;
        this.isImageLoading = false;
        this.cdr.detectChanges();
      }
    );
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.imageToShow = reader.result;
        this.cdr.detectChanges();
      },
      false
    );

    if (image) {
      if (image.type !== 'application/pdf') reader.readAsDataURL(image);
    }
  }

  postOtherfile(i: number): void {
    this.otherDocument = new FormData();
    this.otherDocument.append('document', this.otherFiles[i], this.otherFiles[i]?.name);
    this.skillOwnerdashboardService.insertAttachment3(this.ownerId, this.otherFiles).subscribe(
      (res) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Other files added succesfully',
          showConfirmButton: false,
          timer: 1500,
        });
      },

      (error) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: error,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    );
  }

  downloadImage(): void {
    this.skillOwnerdashboardService.downloadImage(this.ownerId).subscribe((res) => {
      // this.receivedImageData = res;
      //
      // this.base64Data = this.receivedImageData.pic;
      // this.convertedImage = 'data:image/jpeg;base64,' + this.base64Data;
    });
  }

  getGenderList(): void {
    this.skillOwnerdashboardService.getGenderList().subscribe((response) => {
      this.genders = response;
    });
  }

  getTechData() {
    this.skillOwnerdashboardService.getTechData().subscribe((x) => {
      for (let i = 0; i < x.length; i++) {
        this.techArr.push({
          id: x[i].technologyId,
          value: x[i].technologyValues,
        });
      }
    });
  }

  getRolesData() {
    this.skillOwnerdashboardService.getRolesData().subscribe((z) => {
      for (let i = 0; i < z.length; i++) {
        this.rolesArr.push({
          id: z[i].rolesId,
          value: z[i].rolesDescription,
        });
      }
    });
  }
  getLevelData() {
    this.skillOwnerdashboardService.getLevelData().subscribe((y) => {

      for (let i = 0; i < y.length; i++) {
        this.levelArr.push({
          id: y[i].skillSetLevelId,
          value: y[i].skillLevelDescription,
        });
      }
    });
  }

  getOwnerSkillYearOfExperienceDetails() {
    // this.skillseekerdashboardService.getOwnerSkillYearOfExperienceDetails().subscribe((y) => {
    //   for (let i = 0; i < y.length; i++) {
    //     this.ExpArr.push({
    //       id: y[i].id,
    //       value: y[i].experience,
    //     });
    //   }
    //   console.log(this.ExpArr);

    // });

    this.skillOwnerdashboardService.getOwnerSkillSetYearOfExperienceDetails().subscribe((x) => {
      this.levelExperience = x;
      this.objsskillSet = this.levelExperience.map((x) => ({
        lvl: x[0],
        exp: x[1].split(','),
      }));
    });
  }

  // getOwnerSkillSetYearOfExperienceDetails() {
  //   this.skillOwnerdashboardService.getOwnerSkillSetYearOfExperienceDetails().subscribe((x) => {
  //     this.levelExperience = x;
  //     console.log(this.levelExperience);
  //  });
  // }

  getDomainData() {
    this.skillOwnerdashboardService.getDomainData().subscribe((k) => {
      for (let i = 0; i < k.length; i++) {
        this.DomainArr.push({
          id: k[i].domainId,
          value: k[i].domainValues,
        });
      }
    });
  }

  getAllTableData() {
    this.skillOwnerdashboardService.getAllTableData(this.ownerId).subscribe((res) => {
      this.getALLTableDataResult = res;
      for (let i = 0; i < this.getALLTableDataResult.length; i++) {
        this.getALLTableDataResult[i]['editable'] = false;
      }
      this.cdr.detectChanges();
    });
  }

  listData(x: any) {
    this.selected = x;
  }
  getStateList(): void {
    this.authenticationService.getState().subscribe((response) => {
      this.stateList = response;
    });
  }

  getCityList(): void {
    var queryParams = new HttpParams();
    queryParams = queryParams.append('states', this.stateValue.value);
    if (this.stateValue.value) {
      this.authenticationService.getCityList(this.stateValue.value).subscribe((response) => {
        this.cityList = response;
        this.cdr.detectChanges();
      });
    }
  }

  addressError: boolean = false;
  setAddrs() {
    const checkbox = document.getElementById('subscribe') as HTMLInputElement | null;
    if (
      this.form.value.state == '' ||
      this.form.value.city == '' ||
      this.form.value.addressline1 == '' ||
      this.form.value.addressline2 == '' ||
      this.form.value.zipcode == ''
    ) {
      this.addressError = true;
      checkbox.checked = false;
    } else {
      this.addressError = false;
    }
    if (checkbox?.checked && !this.addressError) {
      this.form.controls['state1']?.setValue(this.form.value.state);
      this.form.controls['city1']?.setValue(this.form.value.city);
      this.form.controls['addressline3']?.setValue(this.form.value.addressline1);
      this.form.controls['addressline4']?.setValue(this.form.value.addressline2);
      this.form.controls['zipcode1']?.setValue(this.form.value.zipcode);
      ['state1', 'city1', 'addressline3', 'addressline4', 'zipcode1'].forEach((e) => this.form.get(e)?.disable());
    } else {
      this.form.controls['state1'].setValue('');
      this.form.controls['city1'].setValue('');
      this.form.controls['addressline3'].reset();
      this.form.controls['addressline4'].reset();
      this.form.controls['zipcode1'].reset();
      ['state1', 'city1', 'addressline3', 'addressline4', 'zipcode1'].forEach((e) => this.form.get(e)?.enable());
    }
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  onReset() {
    this.submitted = false;
    this.workDetailsForm.reset();
  }

  deleteSkillId(id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, archive it!',
    }).then((result) => {
      if (result.isConfirmed) {
        // var index = this.candidates.map((data) => data.skillOwnerEntityId).indexOf(id);
        this.skillOwnerdashboardService.deleteSkillId(id).subscribe(
          (response) => {},
          (error) => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              text: 'Successfully deleted',
              showConfirmButton: false,
              timer: 1500,
            });
            this.getAllTableData();
          }
        );
      }
    });
  }

  InsertData() {
    let formData = this.skillSetForm.getRawValue();
    //
    let body = {
      skillOwnerEntityId: this.ownerId,
      ownerSkillLevelEntity: {
        skillSetLevelId: formData.skillLevel.id,
        // "skillSetLevelId":formData.skillLevel
      },
      ownerSkillTechnologiesEntity: {
        // "technologyId": this.technologyId
        technologyId: formData.technology,
      },
      ownerSkillRolesEntity: {
        // "rolesId": this.rolesId
        rolesId: formData.role,
      },
      ownerSkillDomainEntity: {
        // "domainId":this.domainId
        domainId: formData.domain,
      },
      // "experience": this.changeExp,
      // "lastUsed": this.lastUsed
      experience: formData.experience,
      lastUsed: this.datePipe.transform(formData.lastUsed, 'MMM-yyyy'),
    };

    this.skillOwnerdashboardService.insertSkillSetData(body).subscribe(
      (res) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Skillset added successfully!',
          showConfirmButton: false,
          timer: 1500,
        });
        this.skillSetForm.reset(this.initialvalues);
        if (res != '') {
          this.getAllTableData();
        }
      },
      (error) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: error,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    );
  }

  currentSkillSetId: any;
  currentSkillSetData: any;
  skillLevelDesc: any;
  editSkillSet(index) {
    this.getALLTableDataResult.map((tr) => {
      tr['editable'] = false;
    });
    this.currentSkillSetData = this.getALLTableDataResult[index];
    this.currentSkillSetData['editable'] = true;
   this.onChangeLevel3(this.currentSkillSetData['ownerSkillLevelEntity']['skillSetLevelId'], 'edit');
    this.currentSkillSetId = this.currentSkillSetData['ownerSkillSetId'];
    this.skillLevelDesc = this.currentSkillSetData['ownerSkillLevelEntity']['skillSetLevelId'];
    this.technologyId = this.currentSkillSetData['ownerSkillTechnologiesEntity']['technologyId'];
    this.rolesId = this.currentSkillSetData['ownerSkillRolesEntity']['rolesId'];
    this.domainId = this.currentSkillSetData['ownerSkillDomainEntity']['domainId'];
    this.changeExp = this.currentSkillSetData['experience'];
    this.lastUsed = this.currentSkillSetData['lastUsed'];
  }

  updateSKillSet() {
    let body = {
      ownerSkillSetId: this.currentSkillSetId,
      skillOwnerEntityId: Number(this.ownerId),
      ownerSkillLevelEntity: {
        skillSetLevelId: this.skillLevelDesc,
      },
      ownerSkillTechnologiesEntity: {
        technologyId: parseInt(this.technologyId),
      },
      ownerSkillRolesEntity: {
        rolesId: this.rolesId,
      },
      ownerSkillDomainEntity: {
        domainId: this.domainId,
      },
      experience: this.changeExp,
      lastUsed: this.datePipe.transform(this.lastUsed, 'MMM-YYYY'),
    };
    this.skillOwnerdashboardService.updateSkillSetData(body).subscribe((res) => {
      this.currentSkillSetId = '';
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Skillset data added successfully!',
        showConfirmButton: false,
        timer: 1500,
      });
      for (let i = 0; i < this.getALLTableDataResult.length; i++) {
        this.getALLTableDataResult[i]['editable'] = false;
      }
      this.getAllTableData();
    });
  }

  // onChangeLevel(val:any){
  //   this.skillLevelDesc = val.target.value;
  // }


  // onChangeLevel(val: any, type = '') {


  //   let value = type == 'edit' ? val.id : val.target.value;
  //   this.levelArr.forEach((e:any, i:any) => {
  //     if (e.value == this.skillSetForm.get('skillLevel').value.id) {
  //       this.skillSetLevelId = e.id;
  //     }
  //   });

  //   this.exp = type == 'edit' ? val.value : val.target.value;
  //   this.finalExpData = [];
  //   this.objsskillSet.forEach((e: any, i: any) => {
  //     if (e.lvl == this.skillSetForm.get('skillLevel').value.value) {
  //       this.finalExpData.push(this.objsskillSet[i]['exp']);
  //     }
  //   });

  //   this.getExpData = this.finalExpData[0];
  // }

  // onChangeLevel2(val: any, type = '') {
  //   let value = val;
  //   this.levelArr.forEach((e, i) => {
  //     if (e.id == val.target.value) {
  //       this.exp2 = e.value;
  //     }
  //   });

  //   let finalExpData = [];

  //   this.objsskillSet.forEach((e: any, i: any) => {
  //     if (e.lvl == this.exp2) {
  //       this.getExpData2 = e.exp;
  //     }
  //   });
  // }

  // onChangeLevel3(val: any, type = '') {
  //   let value = val;
  //   this.levelArr.forEach((e, i) => {
  //     if (e.id == val) {
  //       this.exp2 = e.value;
  //     }
  //   });

  //   let finalExpData = [];

  //   this.objsskillSet.forEach((e: any, i: any) => {
  //     if (e.lvl == this.exp2) {
  //       this.getExpData2 = e.exp;
  //     }
  //   });
  // }



  onChangeLevel(val: any, type = '') {
    //
console.log(this.levelArr);

    let value = type == 'edit' ? val.id : val.target.value;
    this.levelArr?.forEach((e, i) => {
      if (e.value == this.skillSetForm.get('skillLevel').value.id) {
        this.skillSetLevelId = e.id;
      }
    });

    this.exp = type == 'edit' ? val.value : val.target.value;
    this.finalExpData = [];
    console.log(this.objsskillSet);

    this.objsskillSet?.forEach((e: any, i: any) => {
      if (e.lvl == this.skillSetForm.get('skillLevel').value.value) {
        this.finalExpData.push(this.objsskillSet[i]['exp']);
      }
    });

    this.getExpData = this.finalExpData[0];
  }

  onChangeLevel2(val: any, type = '') {
    let value = val;
    this.levelArr.forEach((e, i) => {
      if (e.id == val.target.value) {
        this.exp2 = e.value;
      }
    });

    let finalExpData = [];

    this.objsskillSet.forEach((e: any, i: any) => {
      if (e.lvl == this.exp2) {
        this.getExpData2 = e.exp;
      }
    });
  }

  onChangeLevel3(val: any, type = '') {
    let value = val;
    this.levelArr.forEach((e, i) => {
      if (e.id == val) {
        this.exp2 = e.value;
      }
    });

    let finalExpData = [];

    this.objsskillSet.forEach((e: any, i: any) => {
      if (e.lvl == this.exp2) {
        this.getExpData2 = e.exp;
      }
    });
  }





  onChangeTechnology(val: any) {
    this.technologyId = val.target.value;
    //
  }

  onChangeRole(val: any) {
    this.rolesId = val.target.value;
    //
  }
  // onChangeExp(val: any) {
  //   // this.changeExp = val.target.value.split('+')[0];
  //   this.changeExp = val.target.value;
  //   //
  // }

  onChangeExp(val: any) {
    // this.changeExp = val.target.value.split('+')[0];
    this.changeExp = val.target.value;
    //
  }

  onChangeExp2(val: any) {
    // this.changeExp = val.target.value.split('+')[0];
    this.changeExp = val.target.value;
    //
  }
  onChangeDomain(val: any) {
    //
    this.domainId = val.target.value;
    //
  }
  onChangeLastUsed(val: any) {
    // this.lastUsed = parseInt(val.target.value)+1 ;
    this.lastUsed = val.target.value;
    //
  }
}

export function ssnInputValidator(control: AbstractControl): { [key: string]: any } | null {
  const ssn = control.value;
  if (!ssn) {
    return null;
  }
  const ssnRegEx = /^\d{3}-\d{2}-\d{4}$/;
  const valid = ssnRegEx.test(ssn);

  return valid ? null : { invalidSSN: true };
}

interface KeyValue {
  resumefile: any;
}
