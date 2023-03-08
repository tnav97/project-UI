import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.scss'],
})
export class SuperAdminComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  clients(): void {
    this.router.navigate(['/superadmin/clients']);
  }

  contracts(): void {
    this.router.navigate(['/superadmin/contracts']);
  }

  createInvoice(): void {
    this.router.navigate(['/superadmin/invoiceList']);
  }

  addClient(): void {
    this.router.navigate(['/superadmin/addnew-ss'], { queryParams: { type: 'Basic' } });
  }

  addProject(): void {
    this.router.navigate(['/superadmin/addnew-ss'], { queryParams: { type: 'Project' } });
  }

  addRequirement(): void {
    this.router.navigate(['/superadmin/addnew-ss'], { queryParams: { type: 'Requirement' } });
  }
}
