import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterRecruiterComponent } from './register-recruiter.component';

describe('RegisterRecruiterComponent', () => {
  let component: RegisterRecruiterComponent;
  let fixture: ComponentFixture<RegisterRecruiterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterRecruiterComponent]
    });
    fixture = TestBed.createComponent(RegisterRecruiterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
