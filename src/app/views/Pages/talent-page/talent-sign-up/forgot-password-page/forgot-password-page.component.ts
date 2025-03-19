import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResetPasswordService } from 'src/app/core/services/reset-password.service';

@Component({
  selector: 'app-forgot-password-page',
  templateUrl: './forgot-password-page.component.html',
  styleUrls: ['./forgot-password-page.component.css']
})
export class ForgotPasswordPageComponent implements OnInit {
  errorMessage: string | undefined;
  successMessage: string | undefined;
  forgotPasswordForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private resetPasswordService: ResetPasswordService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)]],
    });
  }

  get f() { return this.forgotPasswordForm.controls; }

  sendForgotPasswordCode() {
    this.errorMessage = '';
    this.successMessage = '';

    // Ensure the form is valid before proceeding
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    const email = this.forgotPasswordForm.value.email;  // Get the email from the form

    // Send email directly to backend to verify existence
    this.resetPasswordService.sendForgotPasswordCode(email).subscribe(
      (response) => {
        this.successMessage = 'OTP sent successfully. Please check your email.';
        setTimeout(() => {
          this.router.navigate(['talent-page/forgotPassword-otp-verification'], { queryParams: { email } });
        }, 2000);
      },
      (error) => {
        this.errorMessage = error.error.message || 'Error sending OTP. Please try again.';
      }
    );
  }
}
