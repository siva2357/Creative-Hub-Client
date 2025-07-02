import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { Login } from 'src/app/core/models/auth.model';
import { AlertService } from 'src/app/core/services/alerts.service';
@Component({
  selector: 'app-talent-login',
  templateUrl: './talent-login.component.html',
  styleUrls: ['./talent-login.component.css']
})
export class TalentLoginComponent {
  loginDetails!: FormGroup;

  isLoading: boolean = false;
  loginSuccess: boolean = false;
  showPassword: boolean = false;
  submitted = false;
  errorMessage = '';

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router, private alert:AlertService) {
    this.loginDetails = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]],
    });
  }

  // Get form controls
  get f() { return this.loginDetails.controls; }


  onSubmit() {
    this.submitted = true;

    console.log('Form Submitted:', this.loginDetails.value);
    if (this.loginDetails.invalid) {
        console.log('Form is invalid');
        Object.keys(this.loginDetails.controls).forEach(controlName => {
            this.loginDetails.get(controlName)?.markAsTouched();
        });
        return;
    }

    this.isLoading = true;

    this.authService.login(this.loginDetails.value).subscribe(
        response => {
            console.log('Login response:', response);
            this.loginSuccess = true;

            if (response.token) {
                localStorage.setItem('Authorization', response.token);
                localStorage.setItem('userRole', response.role);
                localStorage.setItem('userId', response.userId);
                localStorage.setItem('userData', JSON.stringify(response));
                const userType = response.role;
                this.authService.setUserRole(userType);
            }

            this.alert.showLoginSuccess();
            setTimeout(() => {
              this.isLoading = false;

              if (response.role === 'recruiter') {
                this.router.navigate(response.profileComplete ?
                  ['talent-page/recruiter'] :
                  ['talent-page/recruiter/profile-form']);
              } else if (response.role === 'seeker') {
                this.router.navigate(response.profileComplete ?
                  ['talent-page/seeker'] :
                  ['talent-page/seeker/profile-form']);
              } else if (response.role === 'admin') {
                this.router.navigate(['talent-page/admin']);
              } else {
                console.warn('Unknown user role:', response.role);
              }
            }, 2000);
        },
        error => {
            console.error('Login error:', error);
            this.errorMessage = 'Invalid credentials';
            this.isLoading = false;
            this.loginSuccess = false;
        }
    );
}

  login() {
    this.router.navigate(['talent-page/login']); // Corrected navigation
  }

  // Navigate to register page
  register() {
    this.router.navigate(['talent-page/signup']); // Corrected navigation
  }

  goToForgotPassword(){
    this.router.navigate(['talent-page/forgot-password']); // Corrected navigation

  }


}
