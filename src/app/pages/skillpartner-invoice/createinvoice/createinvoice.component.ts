import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { addDays, endOfWeek, isBefore, startOfWeek, subDays } from 'date-fns';
import html2canvas from 'html2canvas';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FileResponse, RegistrationEntity, TimeSheet, WorkEfforts } from 'src/app/api/flexcub-api/models';
import { AppService } from 'src/app/app.service';
import { ownerImgUrl } from 'src/app/core/Constants/constant';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../authentication/authentication.service';
import { SkillpartnerInvoiceService } from '../skillpartner-invoice.service';

@Component({
  selector: 'app-createinvoice',
  templateUrl: './createinvoice.component.html',
  styleUrls: ['./createinvoice.component.scss'],
  providers: [DatePipe],
})
export class CreateinvoiceComponent implements OnInit {
  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;

  _view:boolean;
  webkitRelativePath1:string
  step: number = 1;
  tabledata: any = [];
  finalAmt: any;
  finalHours: any;
  finalCount: any;
  _serviceFeeAmount:any
  amountPayable:any
  sum: any;
  totalAmount: number;
  user?: RegistrationEntity;
  invoiceId: number;
  to: string;
  checkbox1: boolean = false;
  array = [];
  taxid: any;
  location: any;
  partnerName: any;
  array2 = [];
  // status:any;
  date: any;
  selectedDueDate: Date;
  selectedWeek: Date = startOfWeek(new Date(), { weekStartsOn: 0 });
  startDate: any;
  end: any;
  today = new Date();
  endDate: Date = new Date();
  maxDate: Date = endOfWeek(new Date(), { weekStartsOn: 0 });
  bgConfig: Partial<BsDatepickerConfig> = { isAnimated: true, selectWeek: true, containerClass: 'theme-dark-blue' };
  // tabledata: any;
  // user?: RegistrationEntity;
  partnerId: number;
  soImgUrl = ownerImgUrl;
  ownerId:number;
  ownerInfo!: WorkEfforts;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly skillpartnerInvoiceService: SkillpartnerInvoiceService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private readonly _appService: AppService,
    private _formBuilder: UntypedFormBuilder
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }
  ngOnInit(): void {
    this.partnerId = this.user?.id;
    this.partnerName = this.user?.businessName;
    this.taxid = this.user?.taxIdBusinessLicense;
    this.location = this.user?.city;
    // this.selectedDueDate = new Date(new Date().getTime() + 42 * 24 * 60 * 60 * 1000);
  }

  next(i): void {
    this.step = i;
  }

  getAnswers(data: WorkEfforts, event) {
    if (event.checked) {
      // this.checkbox1=true
      const index = this.array.findIndex((object) => object.skillOwnerId === data.skillOwnerEntityId);
      const index2 = this.tabledata.findIndex((object) => object.skillOwnerEntityId === data.skillOwnerEntityId);
      this.tabledata[index2].checkbox1 = true;
      if (index === -1) {
        var data2 = {
          skillSeekerId: data.skillSeekerEntityId,
          skillSeekerProjectId: data.skillSeekerProjectEntityId,
          skillOwnerId: data.skillOwnerEntityId,
          totalHours: data.totalHours,
          amount: data.amount,
        };
        this.array.push(data);
        this.array2.push(data2);
      }
    } else {
      const index2 = this.tabledata.findIndex((object) => object.skillOwnerEntityId === data.skillOwnerEntityId);
      this.tabledata[index2].checkbox1 = false;
      const index = this.array.findIndex((object) => object.skillOwnerId === data.skillOwnerEntityId);
      this.array.splice(index, 1);
      this.array2.splice(index, 1);
    }
    this.finalAmt = this.array?.reduce((n, { amount }) => n + amount, 0);
    this.finalCount = this.array?.length;
    this.finalHours = this.array.reduce((n, { totalHours }) => n + totalHours, 0);
    this._serviceFeeAmount=this.array?.reduce((n, { serviceFeesAmount }) => n + serviceFeesAmount, 0);
    this.amountPayable = this.finalAmt - this._serviceFeeAmount;
  }

  buildWeekOptions(j?: Date): void {
    if (j) {
      const date = startOfWeek(j, { weekStartsOn: 0 });
      const date2 = endOfWeek(j, { weekStartsOn: 0 });
      (this.startDate = this._appService.convertTime(date)),
        (this.end = this._appService.convertTime(date2)),
        this.getOwnersByPartners(this.partnerId, this.startDate, this.end);
    }
  }

  weekChange(position: 'next' | 'previous'): void {
    const next = () => {
      const j = addDays(startOfWeek(this.selectedWeek), 7);
      const k = isBefore(j, this.maxDate);

      if (!k) return;
      this.selectedWeek = j;
    };

    const previous = () => {
      const j = subDays(startOfWeek(this.selectedWeek), 7);
      this.selectedWeek = j;
    };

    position === 'next' ? next() : position === 'previous' ? previous() : null;
  }

  getOwnersByPartners(partnerId: number, startDate: string, endDate: string) {
    this.skillpartnerInvoiceService.getOwnersByPartners(partnerId, startDate, endDate).subscribe(
      (res) => {
        this.tabledata = res;
       console.log(this.tabledata);


        for (let i = 0; i < this.tabledata.length; i++) {
          this.ownerId=this.tabledata[i]?.skillOwnerEntityId
          this.skillpartnerInvoiceService.downloadImage(this.tabledata[i]?.skillOwnerEntityId).subscribe(
            (res) => {
              this.tabledata[i]['image'] = this.soImgUrl + this.tabledata[i]?.skillOwnerEntityId;
            },
            (err) => {
              if (err.status == 200) {
                this.tabledata[i]['image'] = this.soImgUrl + this.tabledata[i]?.skillOwnerEntityId;
              } else {
                this.tabledata[i]['image'] = `assets/images/avatar-default-skillowner.png`;
              }
            }
          );
        }
      },
      (error) => {
        this.tabledata = [];
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

  // getInvoiceDetails(id){
  //   this.skillpartnerInvoiceService.getInvoiceByInvoiceId(id).subscribe((res) => {
  //     this.tabledata.push(res);
  //     this.finalAmt=((this.tabledata[0]?.invoiceData?.reduce((n, {amount}) => n + amount, 0)))
  //     this.finalCount=this.tabledata[0]?.invoiceData?.length;
  //     this.finalHours=((this.tabledata[0]?.invoiceData?.reduce((n, {totalHours}) => n + totalHours, 0)))

  //   });
  // }

  download() {
    html2canvas(this.screen.nativeElement).then((canvas) => {
      this.canvas.nativeElement.src = canvas.toDataURL();
      this.downloadLink.nativeElement.href = canvas.toDataURL('image/png');
      this.downloadLink.nativeElement.download = 'invoice.png';
      this.downloadLink.nativeElement.click();
    });
  }

  send() {
    var request = {
      startDate: this.startDate,
      endDate: this.end,
      dueDate: this._appService.convertTime(new Date(new Date().getTime() + 42 * 24 * 60 * 60 * 1000)),
      skillPartnerId: this.partnerId,
      partnerInvoiceResponseList: this.array2,
    };

    this.skillpartnerInvoiceService.saveInvoiceDetailsByPartner(request).subscribe(
      (res) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'The Invoice is submitted successfully',
          showConfirmButton: false,
          timer: 1500,
        });
        this.router.navigate(['/spInvoice']);
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

  urlDownloadTimesheetDocuments(id){
    this.skillpartnerInvoiceService.urlDownloadTimesheetDocuments(id).subscribe(
      (data:FileResponse)=>{
    this.webkitRelativePath1 = data?.fileDownloadUri

      })

  }


  openView(n:WorkEfforts ){
    this._view = true;
    this.ownerInfo = n;
    n.skillOwnerEntityId
  }

  closeView(): void {
    this._view = false;
  }

}
