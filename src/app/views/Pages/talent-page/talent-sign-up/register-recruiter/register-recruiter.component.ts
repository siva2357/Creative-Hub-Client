import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Recruiter } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-register-recruiter',
  templateUrl: './register-recruiter.component.html',
  styleUrls: ['./register-recruiter.component.css']
})
export class RegisterRecruiterComponent implements OnInit {
  registrationForm!: FormGroup;
  isLoading: boolean = false;
  isSubmitting = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  errorMessage = '';
  registrationSuccess: boolean = false;
  recruiter!:Recruiter
  constructor(private formBuilder: FormBuilder, private router: Router, private authService : AuthService) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.registrationForm = this.formBuilder.group({
      _id: [null], // ✅ For fetching and updating user details
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['recruiter'],
    }, { validators: this.passwordMatchValidator });
  }

  get controls() {
    return this.registrationForm.controls;
  }

  passwordMatchValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword ? { mismatch: true } : null;
  }

  submit(): void {
    if (this.registrationForm.valid) {
      const recruiterData: Recruiter = {
        registrationDetails: {
          email: this.registrationForm.value.email,
          password: this.registrationForm.value.password, // Will be optional on the backend
        },
        role: 'recruiter',
      };

      this.isLoading = true;

      this.authService.registerRecruiter(recruiterData).subscribe(
        (response: any) => {
          console.log('Registration successful', response);
          this.registrationSuccess = true;
            this.isLoading = false;
            this.router.navigate(['talent-page/register/otp-verification'], {
              queryParams: { email: recruiterData.registrationDetails.email }
            });
        },
        (error: any) => {
          this.isLoading = false;
          console.error('Registration failed', error);
        }
      );
    }
  }


  goBack(): void {
    this.router.navigate(['talent-page/signup']);
  }
}
