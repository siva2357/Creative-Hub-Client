import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordService } from 'src/app/core/services/reset-password.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-reset-password-otp-page',
  templateUrl: './reset-password-otp-page.component.html',
  styleUrls: ['./reset-password-otp-page.component.css']
})
export class ResetPasswordOtpPageComponent implements OnInit {
sendForgotPasswordCode() {
throw new Error('Method not implemented.');
}
  email: string = '';  // User's email (extracted from query params)
  otpForm!: FormGroup;
  timer: number = 30;
  timerExpired: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private resetPasswordService: ResetPasswordService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params['email']) {
        this.email = params['email'];
      }
    });

    this.otpForm = this.fb.group({
      otp1: ['', Validators.required],
      otp2: ['', Validators.required],
      otp3: ['', Validators.required],
      otp4: ['', Validators.required],
      otp5: ['', Validators.required],
      otp6: ['', Validators.required]
    });

    this.startTimer();
  }


  // Start the OTP timer
  startTimer(): void {
    const interval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
      } else {
        this.timerExpired = true;
        clearInterval(interval);
      }
    }, 1000);
  }

  verifyOtp(): void {
    const otp = [
      this.otpForm.value.otp1,
      this.otpForm.value.otp2,
      this.otpForm.value.otp3,
      this.otpForm.value.otp4,
      this.otpForm.value.otp5,
      this.otpForm.value.otp6
    ].join('');

    if (otp.length !== 6) {
      this.errorMessage = 'Please enter a valid 6-digit OTP.';
      return;
    }

    this.isLoading = true;

    // Log OTP for debugging
    console.log('Verifying OTP for Email:', this.email);

    this.resetPasswordService.verifyForgotPasswordCode(otp, this.email).subscribe(
      (response: any) => {
        if (response.success) {
          this.isLoading = false;
          console.log('OTP verified successfully', response);
          this.router.navigate(['talent-page/reset-password'], {
            queryParams: { email: this.email }
          });
        } else {
          this.isLoading = false;
          this.errorMessage = 'OTP verification failed or invalid.';
        }
      },
      (error: any) => {
        this.isLoading = false;
        console.error('OTP verification failed', error);
        this.errorMessage = 'Invalid or expired OTP';
      }
    );
  }

  resendOtp(): void {
    this.isLoading = true;
    this.errorMessage = '';  // Clear previous error messages
    this.otpForm.reset(); // Reset the form before sending a new OTP

    this.resetPasswordService.resendOtp(this.email).subscribe(
      (response: any) => {
        console.log('OTP resent', response);
        this.timer = 60;
        this.timerExpired = false;
        this.startTimer();
        this.isLoading = false;
      },
      (error: any) => {
        this.isLoading = false;
        console.error('Error resending OTP', error);
      }
    );
  }


  // Move to next OTP field after input

  moveFocus(index: number, event: any): void {
    const inputLength = event.target.value.length;

    if (inputLength === 1 && index < 5) {
      // Move forward if a digit is entered
      const nextInput = document.getElementsByClassName('otp-input').item(index + 1) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }

    else if (inputLength === 0 && index > 0 && event.inputType === "deleteContentBackward") {
      // Move backward if backspace is pressed
      const prevInput = document.getElementsByClassName('otp-input').item(index - 1) as HTMLInputElement;
      if (prevInput) {
        prevInput.focus();
      }
    }
  }


}
