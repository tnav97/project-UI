import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobsCandidateSuggestionsComponent } from './jobs-candidate-suggestions.component';

describe('JobsCandidateSuggestionsComponent', () => {
  let component: JobsCandidateSuggestionsComponent;
  let fixture: ComponentFixture<JobsCandidateSuggestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobsCandidateSuggestionsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsCandidateSuggestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
