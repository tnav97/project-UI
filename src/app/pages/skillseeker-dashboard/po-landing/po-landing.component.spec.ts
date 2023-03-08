import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoLandingComponent } from './po-landing.component';

describe('PoLandingComponent', () => {
  let component: PoLandingComponent;
  let fixture: ComponentFixture<PoLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PoLandingComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
