import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterSeekerProfileComponent } from './recruiter-seeker-profile.component';

describe('RecruiterSeekerProfileComponent', () => {
  let component: RecruiterSeekerProfileComponent;
  let fixture: ComponentFixture<RecruiterSeekerProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecruiterSeekerProfileComponent]
    });
    fixture = TestBed.createComponent(RecruiterSeekerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
