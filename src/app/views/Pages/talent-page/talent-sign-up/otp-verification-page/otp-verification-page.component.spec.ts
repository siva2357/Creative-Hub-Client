import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtpVerificationPageComponent } from './otp-verification-page.component';

describe('OtpVerificationPageComponent', () => {
  let component: OtpVerificationPageComponent;
  let fixture: ComponentFixture<OtpVerificationPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OtpVerificationPageComponent]
    });
    fixture = TestBed.createComponent(OtpVerificationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
