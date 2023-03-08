import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SowLandingComponent } from './sow-landing.component';

describe('SowLandingComponent', () => {
  let component: SowLandingComponent;
  let fixture: ComponentFixture<SowLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SowLandingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SowLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
