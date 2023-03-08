import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListItemsEditComponent } from './list-items-edit.component';

describe('ListItemsEditComponent', () => {
  let component: ListItemsEditComponent;
  let fixture: ComponentFixture<ListItemsEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListItemsEditComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListItemsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
