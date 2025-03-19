import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobpostJobApplicantsComponent } from './jobpost-job-applicants.component';

describe('JobpostJobApplicantsComponent', () => {
  let component: JobpostJobApplicantsComponent;
  let fixture: ComponentFixture<JobpostJobApplicantsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobpostJobApplicantsComponent]
    });
    fixture = TestBed.createComponent(JobpostJobApplicantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
