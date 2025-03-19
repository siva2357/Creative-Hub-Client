import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekerProfilePageComponent  } from './seeker-profile-page.component';

describe('RecruiterMainPageComponent', () => {
  let component:  SeekerProfilePageComponent ;
  let fixture: ComponentFixture< SeekerProfilePageComponent >;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SeekerProfilePageComponent ]
    });
    fixture = TestBed.createComponent( SeekerProfilePageComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
