import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { InvoiceUpdateData } from 'src/app/api/flexcub-api/models';
import { ownerImgUrl } from 'src/app/core/Constants/constant';
import Swal from 'sweetalert2';
import { SkillpartnerInvoiceService } from '../../skillpartner-invoice/skillpartner-invoice.service';
import { skillseekerdashboardService } from '../../skillseeker-dashboard/skillseeker-dashboard.service';
import { SuperAdminService } from '../super-admin.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
  providers: [DatePipe],
})
export class InvoiceListComponent implements OnInit {
  @ViewChild('tabset') tabset: TabsetComponent;
  showSP: boolean = true;
  showSS: boolean = false;
  tabledata = [];
  isLoading = false;
  tabledata2 = [];
  invoiceStatusList = [];
  dialogConfig = '';
  candidateItemList = [];
  copycandidateItemList = [];
  copycandidateItemListData: Array<InvoiceUpdateData> = [];
  soImgUrl = ownerImgUrl;
  invoiceId = '';
  invoiceDate = '';

  constructor(
    private router: Router,
    private readonly superAdminService: SuperAdminService,
    private readonly skillseekerdashboardService: skillseekerdashboardService,
    private readonly skillpartnerInvoiceService: SkillpartnerInvoiceService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.getAllInvoiceDetails();
    this.getAllInvoiceDetailAdmin();
    this.getInvoiceStatus();
    if (window.location.search !== '') {
      this.showSS = true;
      this.showSP = false;
    }
  }

  updateStatus2(invoiceid, statusid, status) {
    Swal.fire({
      title: 'Are you sure?',
      text: `The status will be changed to ${status}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.skillpartnerInvoiceService.getInvoiceByInvoiceId(invoiceid, this.showSP).subscribe(
          (res) => {
            this.invoiceId = invoiceid;
            this.invoiceDate = res.invoiceDate;
            this.candidateItemList = res.invoiceData;
            for (let i = 0; i < this.candidateItemList.length; i++) {
              this.skillseekerdashboardService.downloadImage(this.candidateItemList[i]?.skillOwnerEntityId).subscribe(
                (res) => {
                  this.candidateItemList[i]['image'] = this.soImgUrl + this.candidateItemList[i]?.skillOwnerEntityId;
                },
                (err) => {
                  if (err.status == 200) {
                    this.candidateItemList[i]['image'] = this.soImgUrl + this.candidateItemList[i]?.skillOwnerEntityId;
                  } else {
                    this.candidateItemList[i]['image'] = `assets/images/avatar-default-skillowner.png`;
                  }
                }
              );
            }

            this.dialogConfig = 'rateCard';
          },
          (error) => {
            Swal.fire({
              position: 'center',
              icon: 'warning',
              title: error,
              showConfirmButton: false,
              timer: 1500,
            });
          }
        );
      }
    });
  }

  updateStatus(invoiceid, statusid, status, comment) {
    if (status != 'Rejected') {
      Swal.fire({
        title: 'Are you sure?',
        text: `The status will be changed to ${status}.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
      }).then(async (result) => {
        if (result.isConfirmed) {
          // if (status === 'Rejected') {
          //   const { value: text } = await Swal.fire({
          //     input: 'textarea',
          //     inputLabel: 'Comments',
          //     inputPlaceholder: 'Type your Comments here...',
          //     inputValue: comment,
          //     inputAttributes: {
          //       'aria-label': 'Type your Comments here',
          //     },
          //     showCancelButton: true,
          //     inputValidator: (value) => {
          //       if (!value) {
          //         return 'You need to write something!';
          //       }
          //     },
          //   });

          //   if (text) {
          //     this.superAdminService.updateInvoiceStatus(invoiceid, statusid, text).subscribe(
          //       (res) => {
          //         Swal.fire({
          //           position: 'center',
          //           icon: 'success',
          //           title: `${status} successfully`,
          //           showConfirmButton: false,
          //           timer: 1500,
          //         });
          //         this.getAllInvoiceDetails();
          //       },
          //       (error) => {
          //         Swal.fire({
          //           position: 'center',
          //           icon: 'warning',
          //           title: error,
          //           showConfirmButton: false,
          //           timer: 1500,
          //         });
          //       }
          //     );
          //   }
          // } else {
          this.superAdminService.updateInvoiceStatus(invoiceid, statusid, 'NA').subscribe(
            (res) => {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: `${status} successfully`,
                showConfirmButton: false,
                timer: 1500,
              });
              this.getAllInvoiceDetails();
            },
            (error) => {
              Swal.fire({
                position: 'center',
                icon: 'warning',
                title: error,
                showConfirmButton: false,
                timer: 1500,
              });
            }
          );
          //}
        }
      });
    }
    if (status === 'Rejected') {
      Swal.fire({
        input: 'textarea',
        inputLabel: 'Comments',
        //inputPlaceholder: 'Type your Comments here...',
        inputValue: comment,

        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'You need to write something!';
          }
        },
      }).then((result) => {
        if (result.isConfirmed) {
          this.superAdminService.updateInvoiceStatus(invoiceid, statusid, result.value).subscribe(
            (res) => {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: `${status} successfully`,
                showConfirmButton: false,
                timer: 1500,
              });
              this.getAllInvoiceDetails();
            },
            (error) => {
              Swal.fire({
                position: 'center',
                icon: 'warning',
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

  getAllInvoiceDetails() {
    this.superAdminService.getAllInvoiceDetails().subscribe((res) => {
      this.tabledata = res;
      this.tabledata = this.tabledata.sort((a, b) => {
        return b.invoiceId.slice(3) - a.invoiceId.slice(3);
      });
    });
  }

  getAllInvoiceDetailAdmin() {
    this.superAdminService.getAllInvoiceDetailAdmin().subscribe((res) => {
      this.tabledata2 = res;
      this.tabledata2 = this.tabledata2.sort((a, b) => {
        return b.invoiceId.slice(3) - a.invoiceId.slice(3);
      });
    });
  }

  onPreview(id): void {
    this.router.navigate(['/superadmin/previewInvoice'], { queryParams: { invoiceId: id, isSkillPartner: this.showSP } });
  }

  onPreview1(id): void {
    this.router.navigate(['/superadmin/previewInvoice'], { queryParams: { invoiceId: id, isSkillPartner: this.showSS } });
  }

  onSP() {
    this.showSP = true;
    this.showSS = false;
  }

  onSS() {
    this.showSP = false;
    this.showSS = true;
  }

  getInvoiceStatus() {
    this.superAdminService.getInvoiceStatus().subscribe((res) => {
      this.invoiceStatusList = res;
    });
  }

  get _publish(): boolean {
    return this.candidateItemList?.every((n) => n['amount'] !== null);
  }

  publish() {
    this.isLoading = true;

    if (!this.candidateItemList.every((n) => parseFloat(n['amount']) !== 0 && parseFloat(n['totalHours']) !== 0)) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Rate or totalHours cannot be 0',
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }

    this.copycandidateItemListData = [];

    this.candidateItemList?.forEach((n) => {
      this.copycandidateItemListData.push({
        skillOwnerEntityId: n.skillOwnerEntityId,
        skillSeekerEntityId: n.skillSeekerEntityId,
        skillSeekerProjectEntityId: n.skillSeekerProjectEntityId,
        totalHours: n.totalHours,
        amount: n.amount,
      });
    });
    var req = {
      invoiceId: this.invoiceId,
      invoiceDate: this.datePipe.transform(this.invoiceDate, 'yyyy-MM-dd'),
      invoiceUpdateList: this.copycandidateItemListData,
    };

    this.dialogConfig = '';
    this.superAdminService.updateInvoiceDetailsByAdmin(req).subscribe(
      (res) => {
        this.router.navigate(['/superadmin/invoiceList'], { queryParams: { type: 'SS' } }).then(() => {
          this.superAdminService.updateSeekerInvoiceStatus(this.invoiceId, 1, 'NA').subscribe(
            (res) => {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: `Submitted successfully`,
                showConfirmButton: false,
                timer: 1500,
              });
              this.getAllInvoiceDetailAdmin();
            },
            (error) => {
              Swal.fire({
                position: 'center',
                icon: 'warning',
                title: error,
                showConfirmButton: false,
                timer: 1500,
              });
            }
          );
        });
      },
      (error) => {
        this.isLoading = false;
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

  rateEntry(event: Event, n): void {
    n['amount'] = parseFloat((event.target as HTMLInputElement)?.value) || 0;
  }

  hoursEntry(event: Event, n): void {
    n['totalHours'] = parseFloat((event.target as HTMLInputElement)?.value) || 0;
  }

  onlyPrice(event: KeyboardEvent): void {
    const regex = /[0-9\\.\\]/;
    const character = String.fromCharCode(event?.charCode);
    event?.keyCode !== 8 && !regex.test(character) ? event?.preventDefault() : null;
  }
}
