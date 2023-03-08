import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import html2canvas from 'html2canvas';
import { RegistrationEntity } from 'src/app/api/flexcub-api/models';
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
  finalAmt: any;
  finalHours: any;
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
    private route: ActivatedRoute
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }
  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.invoiceId = params.id;
      this.to = params.to;
      // this.status=params.status;
      this.date = params.date;
      this.getInvoiceDetails(params.id);
    });
  }

  getInvoiceDetails(id) {
    this.skillpartnerInvoiceService.getInvoiceByInvoiceId(id, false).subscribe((res) => {
      this.tabledata.push(res);
      this.finalAmt = this.tabledata[0]?.invoiceData?.reduce((n, { amount }) => n + amount, 0);
      this.finalCount = this.tabledata[0]?.invoiceData?.length;
      this.finalHours = this.tabledata[0]?.invoiceData?.reduce((n, { totalHours }) => n + totalHours, 0);
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
