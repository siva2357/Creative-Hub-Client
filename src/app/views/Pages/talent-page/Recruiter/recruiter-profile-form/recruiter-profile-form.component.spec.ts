import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterProfileFormComponent } from './recruiter-profile-form.component';

describe('RecruiterProfileFormComponent', () => {
  let component: RecruiterProfileFormComponent;
  let fixture: ComponentFixture<RecruiterProfileFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecruiterProfileFormComponent]
    });
    fixture = TestBed.createComponent(RecruiterProfileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
