import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import { filter } from 'rxjs';
import { RegistrationEntity, WorkEfforts } from 'src/app/api/flexcub-api/models';
import { AuthenticationService } from '../../authentication/authentication.service';
import { SkillpartnerInvoiceService } from '../../skillpartner-invoice/skillpartner-invoice.service';

@Component({
  selector: 'app-preview-invoice',
  templateUrl: './preview-invoice.component.html',
  styleUrls: ['./preview-invoice.component.scss'],
})





export class PreviewInvoiceComponent implements OnInit {
  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;

  tabledata: any = [];
  _duedate:any;
  finalAmt: any;

  finalHours: any;
  _client:WorkEfforts[];
  _serviceFeeAmount:any=[]
  amountPayable:any=[]
  finalCount: any;
  sum: any;
  totalAmount: number;
  user?: RegistrationEntity;
  invoiceId: number;
  to: string;
  // status:any;
  date: any;
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly skillpartnerInvoiceService: SkillpartnerInvoiceService,
    private readonly activateRoute: ActivatedRoute,
    private route: ActivatedRoute
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }
  ngOnInit(): void {
    this.activateRoute.queryParams
      .pipe(filter((param: Params) => !!param && !!param?.invoiceId && !!param?.isSkillPartner))
      .subscribe((param: Params) => {
        this.invoiceId = param.invoiceId;
        this.getInvoiceDetails(param.invoiceId, param.isSkillPartner);
      });
  }

  getInvoiceDetails(id, isSP) {
    this.skillpartnerInvoiceService.getInvoiceByInvoiceId(id, isSP).subscribe((res) => {
      this.tabledata.push(res);
      console.log(this.tabledata);




      // this._duedate=this.tabledata.dueDate

      this.finalAmt = this.tabledata[0]?.invoiceData?.reduce((n, { amount }) => n + amount, 0);
      this.finalCount = this.tabledata[0]?.invoiceData?.length;
      this.finalHours = this.tabledata[0]?.invoiceData?.reduce((n, { totalHours }) => n + totalHours, 0);
      this._serviceFeeAmount=this.tabledata[0]?.invoiceData?.reduce((n, { serviceFeesAmount }) => n + serviceFeesAmount, 0);
      this.amountPayable = this.finalAmt - this._serviceFeeAmount
    //  for(let  i=0;i>this.tabledata.length;i++){

    //   this._client[i].clientName = this.tabledata[0]?.invoiceData[i]?.clientName;
    //   console.log(this._client[i].clientName);
    //   this._client[i].skillSeekerProjectEntityId = this.tabledata[0]?.invoiceData[i]?.skillSeekerProjectEntityId;
    //  }
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
}

