import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperAdminClientsComponent } from './super-admin-clients.component';

describe('SuperAdminClientsComponent', () => {
  let component: SuperAdminClientsComponent;
  let fixture: ComponentFixture<SuperAdminClientsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuperAdminClientsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperAdminClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
