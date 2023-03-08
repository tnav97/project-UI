import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerJobHistoryComponent } from './owner-job-history.component';

describe('OwnerJobHistoryComponent', () => {
  let component: OwnerJobHistoryComponent;
  let fixture: ComponentFixture<OwnerJobHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OwnerJobHistoryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerJobHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
