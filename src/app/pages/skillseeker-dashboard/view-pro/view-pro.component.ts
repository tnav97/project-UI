import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Registration, SkillSeekerProjectEntity } from 'src/app/api/flexcub-api/models';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../authentication/authentication.service';
import { skillseekerdashboardService } from '../skillseeker-dashboard.service';

@Component({
  selector: 'app-view-pro',
  templateUrl: './view-pro.component.html',
  styleUrls: ['./view-pro.component.scss'],
  providers: [DatePipe],
})
export class ViewProComponent implements OnInit {
  dateValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const start = control.get('startDate');
    const end = control.get('endDate');
    return start.value !== null &&
      end.value !== null &&
      this.datePipe.transform(start.value, 'yyyy-MM-dd') < this.datePipe.transform(end.value, 'yyyy-MM-dd')
      ? null
      : { dateValid: true };
  };
  dialogConfig: string = '';
  departmentData = [];
  today = new Date();
  disabledDates: any;
  projectDetails: any = [];
  user?: Registration;
  seekerId: Number;
  updatetaskForm!: UntypedFormGroup;
  taskNumber: any;
  projectId: any;

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
  constructor(
    private skillseekerDashboard: skillseekerdashboardService,
    private datePipe: DatePipe,
    private readonly router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }

  ngOnInit(): void {
    this.seekerId = this.user?.id;

    this.getProjectTaskDetailsBySeeker(this.seekerId);

    this.skillseekerDashboard.getDepatmentData().subscribe((data) => {
      if (data.length) {
        this.departmentData = data;
      }
    });

    this.updatetaskForm = new UntypedFormGroup({
      TaskTitle: new UntypedFormControl('', Validators.required),
      taskDescription: new UntypedFormControl('', Validators.required),
    });
  }

  handler() {
    var date = new Date(this.projectForm.get('startDate').value);

    date.setDate(date.getDate() + 1);
    this.disabledDates = date;
  }

  getProjectTaskDetailsBySeeker(id): void {
    this.skillseekerDashboard.getProjectTaskDetailsBySeeker(id).subscribe((response) => {
      var data = response.skillSeekerProjectAndTaskList.map(
        (val, index) =>
          (val['skillSeekerProjectEntity'] = {
            ...val['skillSeekerProjectEntity'],
            summary: val['skillSeekerProjectEntity']?.summary?.replace(/<(?:.|\n)*?>/gm, '') ?? '',
          })
      );
      if (data) {
        this.projectDetails = response.skillSeekerProjectAndTaskList;
        this.projectDetails = this.projectDetails.sort((a, b) => {
          return b.skillSeekerProjectEntity.id - a.skillSeekerProjectEntity.id;
        });
      }
    });
  }

  open(list, item) {
    this.dialogConfig = 'task';
    this.updatetaskForm.get('TaskTitle').patchValue(`${list.taskTitle}`);
    this.updatetaskForm.get('taskDescription').patchValue(`${list.taskDescription}`);
    this.taskNumber = list.taskId;
    this.projectId = item.skillSeekerProjectEntity?.id;
  }

  updateProject(list: SkillSeekerProjectEntity) {
    this.projectId = list.id;
    this.projectForm.get('ProjectTitle').patchValue(`${list.title}`);
    this.projectForm.get('projectDescription').patchValue(`${list.summary}`);
    this.projectForm.get('ProjectDepartment').patchValue(`${list?.ownerSkillDomainEntity?.domainId}`);
    if (list?.startDate) {
      this.projectForm.get('startDate').patchValue(this.datePipe.transform(`${list?.startDate}`, 'MM-dd-YYYY'));
    }
    if (list?.endDate) {
      this.projectForm.get('endDate').patchValue(this.datePipe.transform(`${list?.endDate}`, 'MM-dd-YYYY'));
    }
  }

  updateTask() {
    var request = {
      taskId: this.taskNumber,
      skillSeekerProjectEntity: {
        id: this.projectId,
      },
      taskTitle: this.updatetaskForm.value.TaskTitle,
      taskDescription: this.updatetaskForm.value.taskDescription,
    };

    this.skillseekerDashboard.updateSeekerTaskDetails(request).subscribe(
      (res) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Details updated successfully',
          showConfirmButton: false,
          timer: 1500,
        });
        this.dialogConfig = '';
        this.projectDetails = [];
        this.getProjectTaskDetailsBySeeker(this.seekerId);
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
            this.projectDetails = [];
            this.getProjectTaskDetailsBySeeker(this.seekerId);
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

  onProjectSubmit() {
    if (this.projectForm.invalid) {
      return false;
    }
    let c = {
      id: this.projectId,
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

    this.skillseekerDashboard.updateSeekerProjectDetails(c).subscribe(
      (res) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Details updated successfully',
          showConfirmButton: false,
          timer: 1500,
        });
        this.projectDetails = [];
        this.getProjectTaskDetailsBySeeker(this.seekerId);
        this.dialogConfig = '';
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

  redirectProject(id) {
    this.router.navigate(['/ssdashboard/createtask'], { queryParams: { projectId: id } });
  }

  deleteProject(id) {
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
        this.skillseekerDashboard.deleteSeekerProjectDetails(id).subscribe(
          (res) => {
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
            this.projectDetails = [];
            this.getProjectTaskDetailsBySeeker(this.seekerId);
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
}
