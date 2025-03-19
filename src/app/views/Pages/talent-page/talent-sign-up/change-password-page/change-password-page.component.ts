import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordService } from 'src/app/core/services/password.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ChangePassword } from 'src/app/core/models/password.model';

@Component({
  selector: 'app-change-password-page',
  templateUrl: './change-password-page.component.html',
  styleUrls: ['./change-password-page.component.css']
})
export class ChangePasswordPageComponent implements OnInit {
  changePasswordForm!: FormGroup;
  userId!: string;
  isLoading: boolean = false;
  passwordUpdateSuccess: boolean = false;
  submitted = false;
  errorMessage = '';
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;
  constructor(
    private fb: FormBuilder,
    private passwordService: PasswordService,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId') || this.authService.getUserId() || '';

    if (!this.userId) {
      this.errorMessage = 'User ID is missing.';
      return;
    }

    this.initializeForm();
  }

  initializeForm(): void {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['',[Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],

    },{ validators: this.passwordMatchValidator });
  }

  get controls() {
    return this.changePasswordForm.controls;
  }

  passwordMatchValidator(formGroup: FormGroup): { [key: string]: boolean } | null {
    const newPassword = formGroup.get('newPassword')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
    return newPassword && confirmPassword && newPassword !== confirmPassword ? { mismatch: true } : null;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.changePasswordForm.valid) {
      this.isLoading = true;
      const { oldPassword, newPassword } = this.changePasswordForm.value;
      const passwordModel: ChangePassword = { oldPassword, newPassword };
      const role = localStorage.getItem('userRole');
      if (role === 'seeker') {
        this.passwordService.changeSeekerPassword(this.userId, passwordModel).subscribe(
          (response) => {
            this.isLoading = false;
            this.passwordUpdateSuccess = true;
            alert('Password changed successfully');
            this.router.navigate(['talent-page/login']);
          },
          (error) => {
            this.isLoading = false;
            this.errorMessage = 'Error: ' + error.message;
          }
        );
      } else if (role === 'recruiter') {
        this.passwordService.changeRecruiterPassword(this.userId, passwordModel).subscribe(
          (response) => {
            this.isLoading = false;
            this.passwordUpdateSuccess = true;
            alert('Password changed successfully');
            this.router.navigate(['talent-page/login']);
          },
          (error) => {
            this.isLoading = false;
            this.errorMessage = 'Error: ' + error.message;
          }
        );
      } else {
        this.errorMessage = 'Invalid user role';
      }
    } else {
      this.isLoading = false;
      this.errorMessage = 'Please fill out all required fields correctly.';
    }
  }

  goBack(): void {
    this.router.navigate(['talent-page/login']);
  }

}
