import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterPostJobPageComponent  } from './recruiter-post-job.component';

describe('RecruiterPostJobPageComponent', () => {
  let component: RecruiterPostJobPageComponent ;
  let fixture: ComponentFixture<RecruiterPostJobPageComponent >;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecruiterPostJobPageComponent ]
    });
    fixture = TestBed.createComponent(RecruiterPostJobPageComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
