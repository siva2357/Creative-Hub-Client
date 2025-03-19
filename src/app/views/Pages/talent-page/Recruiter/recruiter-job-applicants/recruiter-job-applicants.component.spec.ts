import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterJobApplicantsPageComponent  } from './recruiter-job-applicants.component';

describe('RecruiterJobApplicantsPageComponent', () => {
  let component: RecruiterJobApplicantsPageComponent ;
  let fixture: ComponentFixture<RecruiterJobApplicantsPageComponent >;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecruiterJobApplicantsPageComponent ]
    });
    fixture = TestBed.createComponent(RecruiterJobApplicantsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
