import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordOtpPageComponent } from './reset-password-otp-page.component';

describe('ResetPasswordOtpPageComponent', () => {
  let component: ResetPasswordOtpPageComponent;
  let fixture: ComponentFixture<ResetPasswordOtpPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResetPasswordOtpPageComponent]
    });
    fixture = TestBed.createComponent(ResetPasswordOtpPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
