import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InvoiceUpdateData, RegistrationEntity } from 'src/app/api/flexcub-api/models';
import { ownerImgUrl } from 'src/app/core/Constants/constant';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../../authentication/authentication.service';
import { skillseekerdashboardService } from '../../skillseeker-dashboard/skillseeker-dashboard.service';
import { SuperAdminService } from '../../super-admin/super-admin.service';
import { SkillpartnerInvoiceService } from '../skillpartner-invoice.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss'],
  providers: [DatePipe],
})
export class InvoiceListComponent implements OnInit {
  tabledata = [];
  user?: RegistrationEntity;
  isLoading = false;
  partnerId: number;
  invoiceStatusList = [];
  candidateItemList = [];
  dialogConfig = '';
  soImgUrl = ownerImgUrl;
  invoiceId = '';
  invoiceDate = '';
  copycandidateItemList = [];

  copycandidateItemListData: Array<InvoiceUpdateData> = [];

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private readonly skillpartnerInvoiceService: SkillpartnerInvoiceService,
    private readonly skillseekerdashboardService: skillseekerdashboardService,
    private datePipe: DatePipe,
    private readonly superAdminService: SuperAdminService
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }
  ngOnInit(): void {
    this.partnerId = this.user?.id;
    this.getSeekerById(this.partnerId);
    this.getInvoiceStatus();
  }

  getSeekerById(id) {
    this.skillpartnerInvoiceService.getInvoices(id).subscribe((res) => {
      this.tabledata = res;
    });
  }
  viewInvoice() {}

  updateStatus(invoiceid, statusid, status) {
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
        this.skillpartnerInvoiceService.getInvoiceByInvoiceId(invoiceid, true).subscribe(
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
    this.superAdminService.updateInvoiceDetailsByPartner(req).subscribe(
      (res) => {
        this.router.navigate(['/spInvoice']).then(() => {
          this.superAdminService.updateInvoiceStatus(this.invoiceId, 1, 'NA').subscribe(
            (res) => {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: `Submitted successfully`,
                showConfirmButton: false,
                timer: 1500,
              });
              this.getSeekerById(this.partnerId);
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

  getInvoiceStatus() {
    this.superAdminService.getInvoiceStatus().subscribe((res) => {
      this.invoiceStatusList = res;
    });
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
