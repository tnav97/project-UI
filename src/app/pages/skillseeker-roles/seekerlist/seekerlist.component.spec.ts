import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekerlistComponent } from './seekerlist.component';

describe('SeekerlistComponent', () => {
  let component: SeekerlistComponent;
  let fixture: ComponentFixture<SeekerlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SeekerlistComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeekerlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
