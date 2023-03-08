import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsaLandingComponent } from './msa-landing.component';

describe('MsaLandingComponent', () => {
  let component: MsaLandingComponent;
  let fixture: ComponentFixture<MsaLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MsaLandingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsaLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
