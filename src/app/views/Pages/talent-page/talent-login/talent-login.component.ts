import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { Login } from 'src/app/core/models/auth.model';

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

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
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

    // Call the login API
    this.authService.login(this.loginDetails.value).subscribe(
        response => {
            console.log('Login response:', response);
            this.loginSuccess = true;

            if (response.token) {
                // Store the token and user data in localStorage
                localStorage.setItem('Authorization', response.token); // Store token
                localStorage.setItem('userRole', response.role); // Store user role
                localStorage.setItem('userId', response.userId); // Store user ID
                localStorage.setItem('userData', JSON.stringify(response)); // Store complete user data

                // Extract and store user role
                const userType = response.role;
                this.authService.setUserRole(userType);
            }

            setTimeout(() => {
              this.isLoading = true;

              // For both recruiters and seekers, if profileComplete is false, redirect to a common profile completion page.
              if (response.role === 'recruiter') {
                if (response.profileComplete) {
                  this.router.navigate(['talent-page/recruiter']);
                } else {
                  this.router.navigate(['talent-page/recruiter/profile-form']); // Common profile completion page
                }
              } else if (response.role === 'seeker') {
                if (response.profileComplete) {
                  this.router.navigate(['talent-page/seeker']);
                } else {
                  this.router.navigate(['talent-page/seeker/profile-form']); // Same common profile page
                }
              } else if (response.role === 'admin') {
                this.router.navigate(['talent-page/admin']);
              } else {
                console.warn('Unknown user role:', response.role);
              }
            }, 3000);

        },
        error => {
            console.error('Login error:', error);
            this.errorMessage = 'Invalid credentials'; // Show error message to user
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
