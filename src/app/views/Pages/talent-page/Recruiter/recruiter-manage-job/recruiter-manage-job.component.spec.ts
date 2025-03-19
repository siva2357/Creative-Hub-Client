import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterManageJobPageComponent  } from './recruiter-manage-job.component';

describe('RecruiterMainPageComponent', () => {
  let component: RecruiterManageJobPageComponent ;
  let fixture: ComponentFixture<RecruiterManageJobPageComponent >;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecruiterManageJobPageComponent ]
    });
    fixture = TestBed.createComponent(RecruiterManageJobPageComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
