import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterClosedJobsPageComponent } from './recruiter-closed-jobs.component';

describe('RecruiterClosedJobsPageComponent', () => {
  let component: RecruiterClosedJobsPageComponent ;
  let fixture: ComponentFixture<RecruiterClosedJobsPageComponent >;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecruiterClosedJobsPageComponent ]
    });
    fixture = TestBed.createComponent(RecruiterClosedJobsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
