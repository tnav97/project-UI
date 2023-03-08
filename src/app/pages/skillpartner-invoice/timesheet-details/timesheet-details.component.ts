import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IProjects, ITasks, ITimesheetMatrix, IWeekOptions } from 'src/app/core/models';
import { SkillpartnerInvoiceService } from '../skillpartner-invoice.service';
import { addDays, endOfWeek, isBefore, startOfWeek, subDays } from 'date-fns';
import { DatePipe } from '@angular/common';
import { OwnerTimeSheetControllerService, SkillOwnerControllerService } from 'src/app/api/flexcub-api/services';
import { FileResponse, SkillSeekerProject, SkillSeekerTask, TimeSheetResponse } from 'src/app/api/flexcub-api/models';
import { forInRight } from 'lodash';
import { HttpErrorResponse } from '@angular/common/http';
import * as _ from 'lodash';
import { ownerImgUrl } from 'src/app/core/Constants/constant';
@Component({
  selector: 'app-timesheet-details',
  templateUrl: './timesheet-details.component.html',
  styleUrls: ['./timesheet-details.component.scss']
})
export class TimesheetDetailsComponent {
  @Input() id!: number;
  @Input() selectedWeek: Date = startOfWeek(new Date(), { weekStartsOn: 0 });
  @Output() close: EventEmitter<boolean> = new EventEmitter();

  data=[]
  _close(): void {
    this.close.emit(true);
  }

  owner_TimesheetDetails:TimeSheetResponse[]=[];
  projects: IProjects[] = [];
  tasks: { [key: number]: SkillSeekerTask[] } = [];
  startDate!: string;
  endDate: any;
  timesheet_Id:number;
  webkitRelativePath1:string='';
  ownerImage: any = [];
  soImgUrl = ownerImgUrl;

  // selectedWeek: Date = startOfWeek(new Date(), { weekStartsOn: 0 });
  maxDate: Date = endOfWeek(new Date(), { weekStartsOn: 0 });
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
  ngOnInit() {
    this.getImage();
    this.getOwnerTimeSheetDetails();
    (async () => {
      await this.getProjects();
      this.buildWeekOptions();
    })();

  }

  constructor(
    private readonly _service :SkillpartnerInvoiceService,
    private datePipe: DatePipe,
    private readonly _service1:OwnerTimeSheetControllerService
  ){

  }

  buildWeekOptions(): void {
    const date = startOfWeek(this.selectedWeek, { weekStartsOn: 0 });
    console.log(date);

    const date2 = endOfWeek(this.selectedWeek, { weekStartsOn: 0 });
    this.startDate = this.datePipe.transform(date, 'YYYY-MM-dd');
    this.endDate = this.datePipe.transform(date2, 'YYYY-MM-dd');
    this.weekOptions.forEach((ele, i: number) => {
      ele.date = addDays(date, i);
    });
    this.getTimeSheet(this.startDate);
  }


  getOwnerTimeSheetDetails()
  {
    if(!this.id)return;
    this._service.getOwnerTimeSheetDetails(this.id).subscribe((res)=>{
      this.data = res
    })
  }

  getProjects(): Promise<void> {
    return new Promise((resolve) => {


      this._service1.getProjectDetails({ skillOwnerId: this.id }).subscribe(
        (res: SkillSeekerProject[]) => {
          this.projects = res.map((ele) => {
            console.log(ele?.id)
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

  getTimeSheet(startdate:string): void {
    // const r = subDays(startOfWeek(this.selectedWeek), 7);
     const k = this.datePipe.transform(startdate, 'YYYY-MM-dd');
    const j = { weekStartDate: k, ownerId:this.id };
    if(!this.id)return;
    this._service1.getTimeSheet(j).subscribe(
      (res: TimeSheetResponse[]) => {
        this.timesheet_Id = res[0]?.timeSheetId;


        this.projects.forEach((n) => (n.tasks = []));
        res?.forEach((e) => {

          const i = this.projects.findIndex((ele) => ele?.id === e?.skillSeekerProjectEntityId) ?? -1;
          console.log(e?.skillSeekerProjectEntityId);
          console.log(i);
          if (i === -1) return;

          Object.assign(this.projects[i], { timeSheetId: e?.timeSheetId ?? 0, approved: e?.approved ?? false, firstName:e?.firstName,startDate:e?.startDate,title:e?.title}); //Assigning the timesheet id for the create and update purposes.

          const ii = this.projects[i]?.tasks?.findIndex((ele) => ele?.id === e?.skillSeekerTaskEntityId) ?? 0;
          console.log(ii);
          console.log(e?.skillSeekerTaskEntityId);


          if (ii > -1) return; //Stopping to avoid the duplicates.

          let total = _.cloneDeep(this.total).map((ele) => {
            return { ...ele, duration: 0 };
          });
          const hrs = e?.hours?.split(',')?.map((n) => parseInt(n) || 0) ?? [0, 0, 0, 0, 0, 0, 0];
          !false ? hrs.forEach((n, i: number) => (total[i].duration = n)) : null;
          this.projects[i]?.tasks?.push({ title: e?.taskTitle, id: e?.skillSeekerTaskEntityId, duration: total, description: e?.taskDescription });
        });
        this.urlDownloadTimesheetDocuments(this.timesheet_Id)
      //  this.projects.length > 0 ? this.next(4) : null;
      },
      (err: HttpErrorResponse) => {
        this.projects.forEach((n) => (n.tasks = []));
      },
      () => {}
    );
  }


  // downloadAttachment(){
  //   this.downloadTimesheetDocuments(this.timesheet_Id);
  //   this.urlDownloadTimesheetDocuments(this.timesheet_Id);
  // }

urlDownloadTimesheetDocuments(id){
  this._service.urlDownloadTimesheetDocuments(id).subscribe(
    (data:FileResponse)=>{
  this.webkitRelativePath1 = data?.fileDownloadUri

    })

}

downloadTimesheetDocuments(id){
  this._service.downloadTimesheetDocuments(id).subscribe(
    (data:Blob)=>{
      console.log(data);
    }
  )
}

getImage(){
this._service.downloadImage(this.id).subscribe((res)=>{
this.ownerImage=this.soImgUrl+this.id
console.log(this.ownerImage);

})
}

}
