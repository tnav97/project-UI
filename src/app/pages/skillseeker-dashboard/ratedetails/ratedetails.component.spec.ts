import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatedetailsComponent } from './ratedetails.component';

describe('RatedetailsComponent', () => {
  let component: RatedetailsComponent;
  let fixture: ComponentFixture<RatedetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RatedetailsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RatedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
