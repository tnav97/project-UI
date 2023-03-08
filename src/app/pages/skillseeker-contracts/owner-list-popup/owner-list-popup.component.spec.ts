import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerListPopupComponent } from './owner-list-popup.component';

describe('OwnerListPopupComponent', () => {
  let component: OwnerListPopupComponent;
  let fixture: ComponentFixture<OwnerListPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OwnerListPopupComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerListPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
