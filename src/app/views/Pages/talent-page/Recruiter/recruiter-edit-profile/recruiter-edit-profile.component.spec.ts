import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterEditProfileComponent } from './recruiter-edit-profile.component';

describe('RecruiterEditProfileComponent', () => {
  let component: RecruiterEditProfileComponent;
  let fixture: ComponentFixture<RecruiterEditProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecruiterEditProfileComponent]
    });
    fixture = TestBed.createComponent(RecruiterEditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
