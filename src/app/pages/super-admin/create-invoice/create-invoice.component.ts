import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { endOfWeek, startOfWeek } from 'date-fns';
import html2canvas from 'html2canvas';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { AdminInvoice, RegistrationEntity } from 'src/app/api/flexcub-api/models';
import { ownerImgUrl } from 'src/app/core/Constants/constant';
import Swal from 'sweetalert2';
import { SkillpartnerInvoiceService } from '../../skillpartner-invoice/skillpartner-invoice.service';
import { SuperAdminService } from '../super-admin.service';

@Component({
  selector: 'app-create-invoice',
  templateUrl: './create-invoice.component.html',
  styleUrls: ['./create-invoice.component.scss'],
  providers: [DatePipe],
})
export class CreateInvoiceComponent implements OnInit {
  @ViewChild('screen') screen: ElementRef;
  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('downloadLink') downloadLink: ElementRef;

  step: number = 1;
  tabledata: any = [];
  finalAmt: any;
  finalHours: any;
  _invoiceDataId:any;
  finalCount: any;
  invoiceDueDate:any
  // amountPayable:any;
  sum: any;
  totalAmount: number;
  user?: RegistrationEntity;
  invoiceId: number;
  to: string;
  checkbox1: boolean = false;
  array = [];
  seekerName: any;
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
  bgConfig: Partial<BsDatepickerConfig> = { isAnimated: true, selectWeek: true, dateInputFormat: 'MM/DD/YYYY', containerClass: 'theme-dark-blue' };
  // tabledata: any;
  // user?: RegistrationEntity;
  partnerId: number;
  soImgUrl = ownerImgUrl;
  listOfClient = [];
  listOfProject = [];

  clientForm = new UntypedFormGroup({
    client: new UntypedFormControl('', Validators.required),
    project: new UntypedFormControl('', Validators.required),
  });

  constructor(
    private router: Router,
    private readonly skillpartnerInvoiceService: SkillpartnerInvoiceService,
    private datePipe: DatePipe,
    private readonly superAdminService: SuperAdminService,
    private route: ActivatedRoute,
    private _formBuilder: UntypedFormBuilder
  ) {}
  ngOnInit(): void {
    this.invoiceClientDetails();
    // this.selectedDueDate = new Date(new Date().getTime() + 42 * 24 * 60 * 60 * 1000);
  }

  next(i): void {
    this.step = i;
  }

  onChangeClient(event) {
    this.clientForm.value.client;
    this.listOfProject = this.clientForm.value.client.clientProjects;
    this.clientForm.get('project').patchValue('');
  }

  onChangeProject(event) {
    this.superAdminService.getPartnerInvoiceBySeeker(this.clientForm.value.client.skillSeekerId, this.clientForm.value.project.projectId).subscribe(
      (res) => {
        this.tabledata = res;
        this.invoiceDueDate =  this.tabledata[0]?.invoiceDueDate
        console.log(this.invoiceDueDate);

        for (let i = 0; i < this.tabledata.length; i++) {
          this.seekerName = this.tabledata[0]?.client;
          this.skillpartnerInvoiceService.downloadImage(this.tabledata[i]?.ownerId).subscribe(
            (res) => {
              this.tabledata[i]['image'] = this.soImgUrl + this.tabledata[i]?.ownerId;
            },
            (err) => {
              if (err.status == 200) {
                this.tabledata[i]['image'] = this.soImgUrl + this.tabledata[i]?.ownerId;
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

  getAnswers(data: AdminInvoice, event) {
    if (event.checked) {
      // this.checkbox1=true
      const index = this.array.findIndex((object) => object.invoiceDataId === data.invoiceDataId);
      const index2 = this.tabledata.findIndex((object) => object.invoiceDataId === data.invoiceDataId);
      this.tabledata[index2].checkbox1 = true;
      if (index === -1) {
        var data2 = {
          invoiceId: data.invoiceDataId,
        };
        this.array.push(data);
        this.array2.push(data2);
      }
    } else {
      const index2 = this.tabledata.findIndex((object) => object.invoiceDataId === data.invoiceDataId);
      this.tabledata[index2].checkbox1 = false;
      const index = this.array.findIndex((object) => object.invoiceDataId === data.invoiceDataId);
      this.array.splice(index, 1);
      this.array2.splice(index, 1);
    }
    this.finalAmt = this.array?.reduce((n, { amount }) => n + amount, 0);
    this.finalCount = this.array?.length;
    this.finalHours = this.array.reduce((n, { totalHours }) => n + totalHours, 0);
    // this.amountPayable = this.array?.reduce((n,{actualAmount}) => n + actualAmount)
  }

  // getInvoiceDetails(id){
  //   this.skillpartnerInvoiceService.getInvoiceByInvoiceId(id).subscribe((res) => {
  //     this.tabledata.push(res);
  //     this.finalAmt=((this.tabledata[0]?.invoiceData?.reduce((n, {amount}) => n + amount, 0)))
  //     this.finalCount=this.tabledata[0]?.invoiceData?.length;
  //     this.finalHours=((this.tabledata[0]?.invoiceData?.reduce((n, {totalHours}) => n + totalHours, 0)))

  //   });
  // }

  invoiceClientDetails() {
    this.superAdminService.invoiceClientDetails().subscribe((res) => {
      this.listOfClient = res;
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

  send() {
    this.superAdminService.saveInvoiceDetailsByAdmin(this.array2).subscribe(
      (res) => {
        this.router.navigate(['/superadmin/invoiceList'], { queryParams: { type: 'SS' } }).then(() => {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'The Invoice is submitted successfully',
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
