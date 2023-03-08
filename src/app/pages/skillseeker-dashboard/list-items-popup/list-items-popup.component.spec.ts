import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListItemsPopupComponent } from './list-items-popup.component';

describe('ListItemsPopupComponent', () => {
  let component: ListItemsPopupComponent;
  let fixture: ComponentFixture<ListItemsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListItemsPopupComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListItemsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
