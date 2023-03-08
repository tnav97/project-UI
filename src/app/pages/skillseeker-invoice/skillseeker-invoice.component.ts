import { Component, OnInit } from '@angular/core';
import { Registration } from 'src/app/api/flexcub-api/models';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../authentication/authentication.service';
import { SuperAdminService } from '../super-admin/super-admin.service';
import { SkillseekerInvoiceService } from './skillseeker-invoice.service';

@Component({
  selector: 'app-skillseeker-invoice',
  templateUrl: './skillseeker-invoice.component.html',
  styleUrls: ['./skillseeker-invoice.component.scss'],
})
export class SkillseekerInvoiceComponent implements OnInit {
  user?: Registration;
  seekerId: Number;
  toggleSideBar: boolean = false;
  togglebutton: boolean = false;
  tabledata = [];
  invoiceStatusList = [];

  constructor(
    private readonly skillseekerInvoiceService: SkillseekerInvoiceService,
    private readonly superAdminService: SuperAdminService,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.user.subscribe((x) => (this.user = x));
  }
  ngOnInit(): void {
    this.seekerId = this.user?.id;
    this.getAllInvoiceDetails(this.seekerId);
    this.getInvoiceStatus();
  }

  closeBar(): void {
    this.toggleSideBar = false;
  }

  onToggle() {
    this.togglebutton = true;
  }

  getAllInvoiceDetails(id) {
    this.skillseekerInvoiceService.getAdminInvoiceBySeeker(id).subscribe((res) => {
      this.tabledata = res;
    });
  }

  updateStatus(invoiceid, statusid, status, comment) {
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
        if (status === 'Rejected') {
          const { value: text } = await Swal.fire({
            input: 'textarea',
            inputLabel: 'Comments',
            inputPlaceholder: 'Type your Comments here...',
            inputValue: comment,
            inputAttributes: {
              'aria-label': 'Type your Comments here',
            },
            showCancelButton: true,
            inputValidator: (value) => {
              if (!value) {
                return 'You need to write something!';
              }
            },
          });

          if (text) {
            this.superAdminService.updateSeekerInvoiceStatus(invoiceid, statusid, text).subscribe(
              (res) => {
                Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: `${status} successfully`,
                  showConfirmButton: false,
                  timer: 1500,
                });
                this.getAllInvoiceDetails(this.seekerId);
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
        } else {
          this.superAdminService.updateSeekerInvoiceStatus(invoiceid, statusid, 'NA').subscribe(
            (res) => {
              Swal.fire({
                position: 'center',
                icon: 'success',
                title: `${status} successfully`,
                showConfirmButton: false,
                timer: 1500,
              });
              this.getAllInvoiceDetails(this.seekerId);
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
      }
    });
  }

  getInvoiceStatus() {
    this.superAdminService.getInvoiceStatus().subscribe((res) => {
      this.invoiceStatusList = res;
    });
  }
}
