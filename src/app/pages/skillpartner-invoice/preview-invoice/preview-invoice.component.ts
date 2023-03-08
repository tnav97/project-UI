import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import startOfWeek from 'date-fns/startOfWeek';
import html2canvas from 'html2canvas';
import { FileResponse, RegistrationEntity, WorkEfforts } from 'src/app/api/flexcub-api/models';
import { AppService } from 'src/app/app.service';
import { AuthenticationService } from '../../authentication/authentication.service';
import { SkillpartnerInvoiceService } from '../skillpartner-invoice.service';

@Component({
  selector: 'app-preview-invoice',
  templateUrl: './preview-invoice.component.html',
  styleUrls: ['./preview-invoice.component.scss'],
})
export class PreviewInvoiceComponent implements OnInit {
  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;
  _serviceFeeAmount:any
  ownerId:number;
  amountPayable:any
  tabledata: any = [];
  _view:boolean=false;
  finalAmt: any;
  finalHours: any;
  finalactualAmount: any;
  finalCount: any;
  sum: any;
  totalAmount: number;
  user?: RegistrationEntity;
  invoiceId: number;
  to: string;
  timesheetId:number;

  selectedWeek: Date = startOfWeek(new Date(), { weekStartsOn: 0 });
  selecteddate!: Date

  webkitRelativePath1:string='';
  // status:any;
  date: any;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly skillpartnerInvoiceService: SkillpartnerInvoiceService,
    private route: ActivatedRoute,
    private readonly _appService: AppService,
    private  datePipe:DatePipe
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }
  ngOnInit(): void {
    console.log(this.selecteddate);

    this.route.params.subscribe((params) => {
      this.invoiceId = params.id;
      this.to = params.to;
      // this.status=params.status;
      this.date = params.date;
      this.getInvoiceDetails(params.id);
    });
  }

  getInvoiceDetails(id) {
    this.skillpartnerInvoiceService.getInvoiceByInvoiceId(id, true).subscribe((res) => {
      this.tabledata.push(res);
      console.log(this.tabledata);
      this.selecteddate=this.tabledata[0].startDate;
      const dateObject = this.datePipe.transform(this.tabledata[0].startDate, 'YYYY-MM-dd');
      console.log(dateObject);

      this.selecteddate= new Date(Date.parse(dateObject));
      console.log(this.selecteddate);

      console.log(res);
      console.log(this.tabledata[0]?.invoiceData?.timesheetId);

      this.finalAmt = this.tabledata[0]?.invoiceData?.reduce((n, { amount }) => n + amount, 0);
      this.timesheetId = this.tabledata[0]?.invoiceData?.timesheetId;
      this.finalCount = this.tabledata[0]?.invoiceData?.length;
      this.finalHours = this.tabledata[0]?.invoiceData?.reduce((n, { totalHours }) => n + totalHours, 0);
      // this.finalactualAmount = this.tabledata[0]?.invoiceData?.reduce((n, { actualAmount }) => n + actualAmount, 0);
      this._serviceFeeAmount=this.tabledata[0]?.invoiceData?.reduce((n, { serviceFeesAmount }) => n + serviceFeesAmount, 0);
      this.amountPayable = this.finalAmt - this._serviceFeeAmount
      // this.urlDownloadTimesheetDocuments(this.timesheetId);

    });
  }

  download() {
    html2canvas(this.screen.nativeElement).then((canvas) => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'invoice.png';
      this.downloadLink.nativeElement.click();
    });
  }

  getId(){

  }

  urlDownloadTimesheetDocuments(id){
    this.skillpartnerInvoiceService.urlDownloadTimesheetDocuments(id).subscribe(
      (data:FileResponse)=>{
    this.webkitRelativePath1 = data?.fileDownloadUri

      })

  }

  openView(n:number ){
    this._view = true;
    this.ownerId=n;
  }


    // this._view = true;
    // this.ownerInfo = n;
    // n.skillOwnerEntityId

  closeView(): void {
    this._view = false;
  }
}
