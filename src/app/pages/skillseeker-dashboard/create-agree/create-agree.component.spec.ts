import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAgreeComponent } from './create-agree.component';

describe('CreateAgreeComponent', () => {
  let component: CreateAgreeComponent;
  let fixture: ComponentFixture<CreateAgreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateAgreeComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAgreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
