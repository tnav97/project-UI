import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { addDays, endOfWeek, isBefore, startOfWeek, subDays } from 'date-fns';
import * as _ from 'lodash';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { OwnerTimeSheet, Registration, SkillSeekerProject, SkillSeekerTask, TimeSheetResponse } from 'src/app/api/flexcub-api/models';
import { OwnerTimeSheetControllerService } from 'src/app/api/flexcub-api/services';
import { AppService } from 'src/app/app.service';
import { IProjects, ITasks, ITimesheetMatrix, ITimesheetSelectionDto, IWeekOptions } from 'src/app/core/models';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'app-skillowner-timesheets',
  templateUrl: './skillowner-timesheets.component.html',
  styleUrls: ['./skillowner-timesheets.component.scss'],
  providers: [DatePipe],
})
export class SkillownerTimesheetsComponent implements OnInit {
  step: number = 1;
  @ViewChild('fileSelect') _fileSelect!: ElementRef<HTMLInputElement>;
  timesheetAttachment: FileList | any[] = [];
  startDate: any;
  endDate: any;
  projects: IProjects[] = [];
  timesheetAccess: Boolean;
  tasks: { [key: number]: SkillSeekerTask[] } = [];
  selections: ITimesheetSelectionDto = { project: null, task: null, timeSheetId: 0 };
  weekEnd: boolean = false;
  weekOptions: IWeekOptions[] = [
    { day: 'Sun', id: 0, date: '', weekEnd: true },
    { day: 'Mon', id: 1, date: '', weekEnd: false },
    { day: 'Tue', id: 2, date: '', weekEnd: false },
    { day: 'Wed', id: 3, date: '', weekEnd: false },
    { day: 'Thu', id: 4, date: '', weekEnd: false },
    { day: 'Fri', id: 5, date: '', weekEnd: false },
    { day: 'Sat', id: 6, date: '', weekEnd: true },
  ];
  durations: ITimesheetMatrix[] = [
    { duration: 0, weekEnd: true },
    { duration: 0, weekEnd: false },
    { duration: 0, weekEnd: false },
    { duration: 0, weekEnd: false },
    { duration: 0, weekEnd: false },
    { duration: 0, weekEnd: false },
    { duration: 0, weekEnd: true },
  ];
  total: ITimesheetMatrix[] = [
    { duration: 0, weekEnd: true },
    { duration: 0, weekEnd: false },
    { duration: 0, weekEnd: false },
    { duration: 0, weekEnd: false },
    { duration: 0, weekEnd: false },
    { duration: 0, weekEnd: false },
    { duration: 0, weekEnd: true },
  ];
  dialogConfig = {
    visible: false,
    startDate: '',
    endDate: '',
    type: '',
  };
  user?: Registration;
  bgConfig: Partial<BsDatepickerConfig> = { isAnimated: true, selectWeek: true, dateInputFormat: 'MM/DD/YYYY', containerClass: 'theme-dark-blue' };
  selectedWeek: Date = startOfWeek(new Date(), { weekStartsOn: 0 });
  maxDate: Date = endOfWeek(new Date(), { weekStartsOn: 0 });
  formTask!: UntypedFormGroup;
  selfTask: boolean = true;

  constructor(
    private readonly _timesheetService: OwnerTimeSheetControllerService,
    private readonly _authenticationService: AuthenticationService,
    private readonly fb: UntypedFormBuilder,
    private readonly _appService: AppService,
    private router: Router,
    private datePipe: DatePipe
  ) {
    this._authenticationService.user.subscribe((x) => (this.user = x));
  }

  ngOnInit(): void {
    this.timesheetAccess = this.user?.timeSheetAccess;


    if (!this.timesheetAccess) {
      this.router.navigate(['/sodashboard']).then(() => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'There is no active timesheets available',
          showConfirmButton: false,
          timer: 1500,
        });
      });
    }
    (async () => {
      await this.getProjects();
      this.buildWeekOptions();
    })();

    this.formTask = this.fb.group({
      task: [null, Validators.compose([Validators.required])],
      description: [null, Validators.compose([])],
      id: [0],
    });
  }

  getProjects(): Promise<void> {
    return new Promise((resolve) => {
      const user = this._authenticationService.userValue;
      // const id = this.user?.id;
      this._timesheetService.getProjectDetails({ skillOwnerId: user?.id }).subscribe(
        (res: SkillSeekerProject[]) => {
          this.projects = res.map((ele) => {
            const k = {
              id: ele?.id,
              title: ele?.title,
              tasks: [],
              _tasks: ele?.taskData,
              summary: ele?.summary,
              seekerId: ele?.skillSeeker?.id,
              timeSheetId: 0, //Default 0
            };

            this.tasks[ele?.id] = [...ele?.taskData] ?? [];
            return k;
          });
          resolve();
        },
        (err: HttpErrorResponse) => {
          resolve();
        },
        () => {}
      );
    });
  }

  getTimeSheet(time: string, copy?: boolean): void {
    const j = { weekStartDate: time, ownerId: this._authenticationService.userValue?.id };
    this._timesheetService.getTimeSheet(j).subscribe(
      (res: TimeSheetResponse[]) => {
        this.projects.forEach((n) => (n.tasks = []));
        res?.forEach((e) => {
          const i = this.projects.findIndex((ele) => ele?.id === e?.skillSeekerProjectEntityId) ?? -1;
          if (i === -1) return;

          Object.assign(this.projects[i], { timeSheetId: e?.timeSheetId ?? 0, approved: e?.approved ?? false }); //Assigning the timesheet id for the create and update purposes.

          const ii = this.projects[i]?.tasks?.findIndex((ele) => ele?.id === e?.skillSeekerTaskEntityId) ?? 0;
          if (ii > -1) return; //Stopping to avoid the duplicates.

          let total = _.cloneDeep(this.total).map((ele) => {
            return { ...ele, duration: 0 };
          });
          const hrs = e?.hours?.split(',')?.map((n) => parseInt(n) || 0) ?? [0, 0, 0, 0, 0, 0, 0];
          !copy ? hrs.forEach((n, i: number) => (total[i].duration = n)) : null;
          this.projects[i]?.tasks?.push({ title: e?.taskTitle, id: e?.skillSeekerTaskEntityId, duration: total, description: e?.taskDescription });
        });
        this.projects.length > 0 ? this.next(4) : null;
      },
      (err: HttpErrorResponse) => {
        this.projects.forEach((n) => (n.tasks = []));
      },
      () => {}
    );
  }

  next(i: number): void {
    this.step = i;
  }

  copyLast(): void {
    const j = subDays(startOfWeek(this.selectedWeek), 7);
    const k = this.datePipe.transform(j, 'YYYY-MM-dd');
    this.getTimeSheet(k, true);
    this.next(4);
  }

  itemSelection(n: IProjects | SkillSeekerTask, type: 'project' | 'task'): void {
    this.selections[type] = type === 'project' ? (n as IProjects)?.id : (n as SkillSeekerTask)?.taskId;
  }

  durationChange(event: Event, duration: ITimesheetMatrix, i: number): void {
    const j = parseFloat((event?.target as HTMLInputElement)?.value) || 0;
    const threshold = 20;
    j > threshold ? (alert(`Duration has to be less than or equal to ${20}`), (duration.duration = 0)) : (duration.duration = j);
    // this.total[i].duration += j;
  }

  get taskInfo(): SkillSeekerTask {
    const i = this.tasks[this.selections?.project]?.findIndex((n) => this.selections?.task === n?.taskId);
    return i > -1 ? this.tasks[this.selections?.project][i] : {};
  }

  get _total(): Array<number> {
    const j = [0, 0, 0, 0, 0, 0, 0];
    this.projects.forEach((project) => {
      project?.tasks?.forEach((task: ITasks) => {
        const k = task?.duration ?? [];
        k.forEach((n: any, i: number) => (j[i] += n?.duration ?? 0));
      });
    });
    return j;
  }

  getTotal(value: any[]): number {
    return value?.reduce((j: number, k: number) => j + k, 0) ?? 0;
  }

  createSheet(): void {
    const { project, task } = this.selections;
    const i = this.projects.findIndex((e) => e?.id === project) ?? -1;
    const ii = this.projects[i]?._tasks?.findIndex((e) => e?.taskId === task) ?? -1;
    if (ii === -1) return;

    const duration: ITimesheetMatrix[] = this.total.map((e: ITimesheetMatrix) => {
      return { ...e, duration: 0 };
    });

    const j = this.projects[i]?._tasks[ii];
    const k = { title: j?.taskTitle, duration: duration, id: j?.taskId, description: j?.taskDescription } as ITasks;

    const kk = this.projects[i]?.tasks?.findIndex((e) => e?.id === k?.id) ?? -1;
    kk === -1 ? this.projects[i]?.tasks?.push(k) : null;
    this.step = 4;
  }

  submitSheet(): void {
    const user = this._authenticationService.userValue;
    const j: OwnerTimeSheet[] = [];
    this.projects.forEach((ele) => {
      if (ele?.approved) return;
      const n: OwnerTimeSheet = {
        skillOwnerEntityId: this.user?.id as number ?? null,
        skillSeekerEntityId: ele?.seekerId,
        skillSeekerProjectEntityId: ele?.id,
        startDate: this._appService.convertTime(startOfWeek(new Date(this.startDate))),
        endDate: this._appService.convertTime(endOfWeek(new Date(this.endDate))),
        efforts: ele?.tasks?.map((n) => {
          return {
            skillSeekerTaskEntity: { id: n?.id },
            hours: n?.duration?.map((o) => (o = o?.duration))?.join(','),
          };
        }),
      };
      j.push(n);
    });

    /** Depricated, and commented for the future reference.  */
    /*
    ele?.timeSheetId > 0 ? (Object.assign(n, { timeSheetId: ele?.timeSheetId }), update.push(n)) : create.push(n)
    const n = [];
    create.length > 0 ? n.push(this._timesheetService.insertTimeSheet({ body: create as any[] })) : null;
    update.length > 0 ? n.push(this._timesheetService.updateTimeSheet({ body: update as any })) : null; */

    this._timesheetService.insertTimeSheet({ body: j as OwnerTimeSheet[] })
      .subscribe((info) => {
        Object.assign(this.dialogConfig, {
          visible: true,
          startDate: startOfWeek(this.selectedWeek)?.toISOString(),
          endDate: endOfWeek(this.selectedWeek)?.toISOString(),
          type: 'success',
        });
        if (this.timesheetAttachment.length > 0) {
          this._timesheetService.timesheetDocuments({
            timesheetId: info[0]?.timeSheetId as number,
            body: { document: this.timesheetAttachment[0] }
          }).subscribe((e) => {
            this.timesheetAttachment = [];
          }, (err) => { })
        }
      }, (error) => {
        this._appService.toastr(error);
      });
  }

  buildWeekOptions(): void {
    const date = startOfWeek(this.selectedWeek, { weekStartsOn: 0 });
    const date2 = endOfWeek(this.selectedWeek, { weekStartsOn: 0 });
    this.startDate = this.datePipe.transform(date, 'YYYY-MM-dd');
    this.endDate = this.datePipe.transform(date2, 'YYYY-MM-dd');
    this.weekOptions.forEach((ele, i: number) => {
      ele.date = addDays(date, i);
    });
    this.getTimeSheet(this.startDate);
  }

  fileSelection() : void {
    this._fileSelect?.nativeElement?.click();
    this._fileSelect.nativeElement.onchange = (e: Event) => {
      const files = (e?.target as HTMLInputElement)?.files ?? [];
      if (files.length === 0) return;

      const threshold = (1024 * 1024) * 1;
      if (files[0].size > threshold) return this._appService.toastr('File size has to be less than 1Mb');

      this.timesheetAttachment = files as FileList;

    };
  }



  weekChange(position: 'next' | 'previous'): void {
    const next = () => {
      const j = addDays(startOfWeek(this.selectedWeek), 7);
      const k = isBefore(j, this.maxDate);

      if (!k) return;
      this.selectedWeek = j;
      this.buildWeekOptions();
    };

    const previous = () => {
      const j = subDays(startOfWeek(this.selectedWeek), 7);
      this.selectedWeek = j;
      this.buildWeekOptions();
    };

    position === 'next' ? next() : position === 'previous' ? previous() : null;
  }

  taskSelection(event: Event): void {
    const j = (event?.target as HTMLInputElement)?.value;
    const i = this.projects[0]?._tasks?.findIndex((n) => j == (n?.taskId as any)) ?? -1;
    if (i === -1) return;

    const k = this.projects[0]?._tasks[i];
    this.formTask?.patchValue({
      task: k?.taskTitle,
      description: k?.taskDescription,
      id: k?.taskId ?? 0,
    });
    this.formTask?.updateValueAndValidity();
  }

  /** For the Skill seeker created tasks. */
  addTask(): void {
    const id = this.selections?.project ? this.selections.project : this.projects[0]?.id ?? 0;
    const { value } = this.formTask;
    const i = this.projects.findIndex((n) => n?.id === id) ?? -1;
    if (i === -1) return alert('Unable to find the project to add the task.');

    const ii = this.projects[i]?._tasks?.findIndex((n) => n.taskId == value?.task) ?? -1;
    if (ii === -1) return alert(`Unable to find the task to add.`);

    const kk = this.projects[i].tasks.findIndex((n) => n?.id == value?.task) ?? -1;
    if (kk > -1) return alert(`You aren't allowed the add the task which are available.`);

    const duration: ITimesheetMatrix[] = this.total.map((e: ITimesheetMatrix) => {
      return { ...e, duration: 0 };
    });

    const j = this.projects[i]?._tasks[ii];
    const k = { title: j?.taskTitle, duration: duration, id: j?.taskId, description: j?.taskDescription } as ITasks;
    this.projects[i]?.tasks?.push(k);

    Object.assign(this.dialogConfig, { visible: false, type: '' });
    this.formTask?.reset();
  }

  /** @deprecated
   * Requested not to remove this, In future if we get an requirement of SO can add the task, then this might be required.
   */
  createTask(): void {
    const id = this.selections?.project ? this.selections.project : this.projects[0]?.id ?? 0;
    const { value } = this.formTask;
    const i = this.projects.findIndex((n) => n?.id === id) ?? -1;
    if (i === -1) return alert('Unable to find the project to add the task.');

    value?.id
      ? (() => {
          const ii = this.projects[i]?._tasks?.findIndex((n) => n.taskId == value?.id) ?? -1;
          if (ii === -1) return alert(`Unable to find the task to add.`);
        })()
      : null;

    const kk = this.projects[i].tasks.findIndex((n) => n?.title === value?.task) ?? -1;
    if (kk > -1) return alert(`You aren't allowed the add the task which are available.`);

    const duration: ITimesheetMatrix[] = this.total.map((e: ITimesheetMatrix) => {
      return { ...e, duration: 0 };
    });

    const j = { title: value?.task, duration: duration, id: value?.id ?? 0, description: value?.description } as ITasks;
    this.projects[i]?.tasks?.push(j);

    Object.assign(this.dialogConfig, { visible: false, type: '' });
    this.formTask?.reset();
  }

  onlyDuration(event: KeyboardEvent): void {
    const regex = /[0-9\\.\\]/;
    const character = String.fromCharCode(event?.charCode);
    event?.keyCode !== 8 && !regex.test(character) ? event?.preventDefault() : null;
  }
}
