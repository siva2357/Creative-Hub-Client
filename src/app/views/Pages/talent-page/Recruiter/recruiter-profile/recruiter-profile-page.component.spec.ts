import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterProfilePageComponent  } from './recruiter-profile-page.component';

describe('RecruiterMainPageComponent', () => {
  let component:  RecruiterProfilePageComponent ;
  let fixture: ComponentFixture< RecruiterProfilePageComponent >;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruiterProfilePageComponent ]
    });
    fixture = TestBed.createComponent( RecruiterProfilePageComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
