import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { UserService } from 'src/app/core/services/user-service';

@Component({
  selector: 'app-recruiter-account-settings-page',
  templateUrl: './recruiter-account-settings-page.component.html',
  styleUrls: ['./recruiter-account-settings-page.component.css']
})
export class RecruiterAccountSettingsPageComponent {

      recruiterId!: string;
      public errorMessage: string | null = null;
      loading: boolean = true;  // For managing loading state
      public userDetails: any;

      constructor(
        private userService: UserService,
        private router: Router,
        private authService: AuthService
      ) {}

      ngOnInit(): void {
        // Get the recruiter ID from localStorage
        this.recruiterId = localStorage.getItem('userId') || '';

        console.log("Recruiter ID:", this.recruiterId);

        if (this.recruiterId) {
            this.getRecruiterDetails();
        } else {
          this.errorMessage = 'Recruiter ID is not available.';
        }
      }

      getRecruiterDetails() {
        this.userService.getRecruiterById(this.recruiterId).subscribe(
          (data: any) => {
            console.log('Recruiter Details:', data);
            this.userDetails = data;
            this.loading = false;
          },
          (error) => {
            this.handleError(error);
          }
        );
      }

      deleteAccount() {
        const confirmation = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");

        if (confirmation) {
          // Ensure only recruiters can delete their own account
          if (!this.userDetails || this.userDetails.role !== 'recruiter') {
            alert("Invalid user role. Only recruiters can delete their accounts.");
            return;
          }

          this.userService.deleteRecruiterById(this.recruiterId).subscribe(
            () => {
              alert("Account deleted successfully.");

              // **Clear user session & stored data**
              localStorage.clear();
              sessionStorage.clear();

              // **Redirect to login page**
              this.router.navigate(['talent-page/login']);
            },
            (error) => {
              console.error("Error deleting account:", error);
              alert("Failed to delete account. Please try again.");
            }
          );
        }
      }

      handleError(error: any) {
        console.error('Error fetching recruiter details:', error);
        if (error.status === 401) {
          this.errorMessage = 'Unauthorized access. Please log in again.';
        } else {
          this.errorMessage = 'An error occurred while fetching recruiter details.';
        }
        this.loading = false;
      }

}
