import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Registration } from 'src/app/api/flexcub-api/models';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../authentication/authentication.service';
import { skillseekerdashboardService } from '../../skillseeker-dashboard/skillseeker-dashboard.service';

@Component({
  selector: 'app-create-projects',
  templateUrl: './create-projects.component.html',
  styleUrls: ['./create-projects.component.scss'],
  providers: [DatePipe],
})
export class CreateProjectsComponent implements OnInit {
  dateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const start = control.get('startDate');
    const end = control.get('endDate');
    return start.value !== null &&
      end.value !== null &&
      this.datePipe.transform(start.value, 'yyyy-MM-dd') < this.datePipe.transform(end.value, 'yyyy-MM-dd')
      ? null
      : { dateValid: true };
  };

  today = new Date();
  disabledDates: any;
  listOfStatus = ['PO In-Progress', 'SOW In-Progress', 'MSA In-Progress', 'On-Boarded', 'Active', 'In-Active', 'On-Hold'];
  step: number = 1;

  projectForm = new UntypedFormGroup(
    {
      ProjectTitle: new UntypedFormControl('', Validators.required),
      projectDescription: new UntypedFormControl('', Validators.required),
      ProjectDepartment: new UntypedFormControl('', Validators.required),
      startDate: new UntypedFormControl('', Validators.required),
      endDate: new UntypedFormControl('', Validators.required),
    },
    { validators: this.dateValidator }
  );

  user?: Registration;
  seekerId: Number;
  contractDetails: any;
  isLoading: boolean;
  departments = [];
  departmentData = [];
  onBoardDetails: any;
  currentId: any;
  projectName: any;
  projectDesc: any;
  projectTitle: any;
  taskinfo: any;
  taskForm!: UntypedFormGroup;

  constructor(
    private skillseekerDashboard: skillseekerdashboardService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }

  ngOnInit(): void {
    this.skillseekerDashboard.getDepatmentData().subscribe((data) => {
      if (data.length) {
        this.departmentData = data;
      }
    });
    this.seekerId = this.user?.id;
    this.taskForm = new UntypedFormGroup({
      ProjectDepartment1: new UntypedFormControl('', Validators.required),
      TaskTitle: new UntypedFormControl('', Validators.required),
      taskDescription: new UntypedFormControl('', Validators.required),
    });
    this.getSeekerProjectDetails();
  }

  next(i): void {
    this.step = i;
  }

  back(i): void {
    this.step = i;
  }

  projectChange() {
    var data = this.taskForm.get('ProjectDepartment1').value;

    this.projectTitle = this.taskForm.get('ProjectDepartment1').value.title;
    this.projectDesc = this.taskForm.get('ProjectDepartment1').value.summary.replace(/<(?:.|\n)*?>/gm, ' ');

    this.taskinfo = [];
    this.skillseekerDashboard.seekerTaskDetails(data.id, this.seekerId).subscribe((res) => {
      this.taskinfo = res;
      this.taskinfo = this.taskinfo.sort((a, b) => {
        return b.taskId - a.taskId;
      });
    });
  }

  deleteTask(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.skillseekerDashboard.deleteSeekerTaskDetails(id).subscribe(
          (res) => {
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
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
    });
  }

  getSeekerProjectDetails(): void {
    this.authenticationService.getSeekerProjectDetails(this.seekerId).subscribe((response) => {
      this.projectName = response;
    });
  }

  handler() {
    var date = new Date(this.projectForm.get('startDate').value);

    date.setDate(date.getDate() + 1);
    this.disabledDates = date;
  }

  createTask() {
    var array1 = [];
    var request = {
      skillSeekerProject: {
        id: this.taskForm.value.ProjectDepartment1.id,
      },
      taskTitle: this.taskForm.value.TaskTitle,
      taskDescription: this.taskForm.value.taskDescription,
    };
    array1.push(request);

    this.skillseekerDashboard.insertSeekerTaskDetails(array1).subscribe(
      (res) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Details updated successfully',
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

  onBoardingSubmit() {
    //
    // return
    if (this.projectForm.invalid) {
      return false;
    }
    var array = [];
    let c = {
      skillSeeker: {
        id: this.seekerId ?? null,
      },
      ownerSkillDomainEntity: { domainId: this.projectForm.get('ProjectDepartment').value ?? null },
      title: this.projectForm.get('ProjectTitle').value ?? null,
      summary: this.projectForm.get('projectDescription').value ?? null,
      primaryContactEmail: this.user?.emailId ?? null,
      primaryContactPhone: this.user?.contactPhone ?? null,
      secondaryContactEmail: '',
      secondaryContactPhone: null,
      startDate: this.datePipe.transform(this.projectForm.get('startDate').value, 'yyyy-MM-dd') ?? null,
      endDate: this.datePipe.transform(this.projectForm.get('endDate').value, 'yyyy-MM-dd') ?? null,
      skillSeekerTechnologyData: null,
    };
    array.push(c);

    this.skillseekerDashboard.addNewSkillSeekarData(array).subscribe(
      (res) => {
        this.router.navigate(['/ssdashboard/viewPro']).then(() => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Details updated successfully',
            showConfirmButton: false,
            timer: 1500,
          });
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
