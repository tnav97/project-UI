import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListItemsNotificationComponent } from './list-items-notification.component';

describe('ListItemsNotificationComponent', () => {
  let component: ListItemsNotificationComponent;
  let fixture: ComponentFixture<ListItemsNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListItemsNotificationComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListItemsNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
