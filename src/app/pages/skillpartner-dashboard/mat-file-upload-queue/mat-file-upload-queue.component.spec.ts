import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatFileUploadQueueComponent } from './mat-file-upload-queue.component';

describe('MatFileUploadQueueComponent', () => {
  let component: MatFileUploadQueueComponent;
  let fixture: ComponentFixture<MatFileUploadQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MatFileUploadQueueComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatFileUploadQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
