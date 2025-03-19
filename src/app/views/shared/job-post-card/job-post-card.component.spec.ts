import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPostCardComponent } from './job-post-card.component';

describe('JobPostCardComponent', () => {
  let component: JobPostCardComponent;
  let fixture: ComponentFixture<JobPostCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JobPostCardComponent]
    });
    fixture = TestBed.createComponent(JobPostCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
