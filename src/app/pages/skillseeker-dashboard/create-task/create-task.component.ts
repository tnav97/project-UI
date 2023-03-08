import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { filter, first } from 'rxjs/operators';
import { Registration, SkillSeekerTask } from 'src/app/api/flexcub-api/models';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../authentication/authentication.service';
import { skillseekerdashboardService } from '../../skillseeker-dashboard/skillseeker-dashboard.service';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss'],
  providers: [DatePipe],
})
export class CreateTaskComponent implements OnInit {
  today = new Date();
  disabledDates: any;
  listOfStatus = ['PO In-Progress', 'SOW In-Progress', 'MSA In-Progress', 'On-Boarded', 'Active', 'In-Active', 'On-Hold'];
  step: number = 1;
  dialogConfig: string = '';

  user?: Registration;
  seekerId: number;
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
  updatetaskForm!: UntypedFormGroup;
  taskNumber: any;

  constructor(
    private skillseekerDashboard: skillseekerdashboardService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
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
    this.getSeekerProjectDetails();
    this.taskForm = new UntypedFormGroup({
      ProjectDepartment1: new UntypedFormControl('', Validators.required),
      TaskTitle: new UntypedFormControl('', Validators.required),
      taskDescription: new UntypedFormControl('', Validators.required),
    });
    this.updatetaskForm = new UntypedFormGroup({
      TaskTitle: new UntypedFormControl('', Validators.required),
      taskDescription: new UntypedFormControl('', Validators.required),
    });

    this.activateRoute.queryParams
      .pipe(
        filter((param: Params) => !!param && !!param?.projectId),
        first()
      )
      .subscribe((param: Params) => {
        this.authenticationService.getSeekerProjectDetails(this.seekerId).subscribe((response) => {
          var data = response;
          this.projectName = response;

          var selectedProject = data.find((x) => x.id == param?.projectId);
          if (selectedProject) {
            this.taskForm.get('ProjectDepartment1').patchValue(selectedProject);
            this.projectChange();
          }
        });
      });
  }

  open(list) {
    this.dialogConfig = 'rateCard';
    this.updatetaskForm.get('TaskTitle').patchValue(`${list.taskTitle}`);
    this.updatetaskForm.get('taskDescription').patchValue(`${list.taskDescription}`);
    this.taskNumber = list.taskId;
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
    this.projectDesc = this.taskForm.get('ProjectDepartment1')?.value?.summary?.replace(/<(?:.|\n)*?>/gm, ' ') ?? '';

    // this.taskinfo = [];
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
            this.taskinfo = [];
            this.skillseekerDashboard.seekerTaskDetails(this.taskForm.value.ProjectDepartment1.id, this.seekerId).subscribe((res) => {
              this.taskinfo = res;
              this.taskinfo = this.taskinfo.sort((a, b) => {
                return b.taskId - a.taskId;
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
    });
  }

  getSeekerProjectDetails(): void {
    this.authenticationService.getSeekerProjectDetails(this.seekerId).subscribe((response) => {
      this.projectName = response;
    });
  }

  createTask() {
    var array1 = [];
    var request: SkillSeekerTask = {
      skillSeekerProjectEntity: {
        id: this.taskForm.get('ProjectDepartment1').value.id,
      },
      taskTitle: this.taskForm.value.TaskTitle,
      taskDescription: this.taskForm.value.taskDescription,
      skillSeeker: {
        id: this.seekerId,
      },
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
        this.taskinfo = [];
        this.skillseekerDashboard.seekerTaskDetails(this.taskForm.value.ProjectDepartment1.id, this.seekerId).subscribe((res) => {
          this.taskinfo = res;
          this.taskinfo = this.taskinfo.sort((a, b) => {
            return b.taskId - a.taskId;
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

  updateTask() {
    var request = {
      taskId: this.taskNumber,
      skillSeekerProjectEntity: {
        id: this.taskForm.value.ProjectDepartment1.id,
      },
      taskTitle: this.updatetaskForm.value.TaskTitle,
      taskDescription: this.updatetaskForm.value.taskDescription,
      skillSeeker: {
        id: this.seekerId,
      },
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
        this.taskinfo = [];
        this.skillseekerDashboard.seekerTaskDetails(this.taskForm.value.ProjectDepartment1.id, this.seekerId).subscribe((res) => {
          this.taskinfo = res;
          this.taskinfo = this.taskinfo.sort((a, b) => {
            return b.taskId - a.taskId;
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
