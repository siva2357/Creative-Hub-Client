import { Component, Input} from '@angular/core';
import { Router } from '@angular/router';
import { RecruiterProfile, SeekerProfile } from 'src/app/core/models/profile-details.model';
import { ProfileBar } from 'src/app/core/models/sidebar-menu.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProfileService } from 'src/app/core/services/profile-service';


@Component({
  selector: 'app-seeker-profile-page',
  templateUrl: './seeker-profile-page.component.html',
  styleUrls: ['./seeker-profile-page.component.css']
})
export class SeekerProfilePageComponent {

    seekerId!: string;

    public profileDetails! :SeekerProfile;
    errorMessage: string = '';

      constructor(private router: Router,private authService: AuthService,
          private profileService:ProfileService) { }
      ngOnInit() {
        // Get the userId and role from localStorage or AuthService
        this.seekerId = localStorage.getItem('userId') || this.authService.getUserId() || '';
        const role = localStorage.getItem('userRole') || this.authService.getRole() || '';

        console.log("User ID:", this.seekerId);
        console.log("User Role:", role); // Log the user role for debugging

        if (this.seekerId && role) {
            this.loadSeekerProfile();
          }else {
            this.errorMessage = 'User ID or Role is not available.';
          }

        }

          loadSeekerProfile() {
            this.profileService.getSeekerProfileById(this.seekerId).subscribe(
              (data:SeekerProfile) => {
                console.log('Seeker profile details:', data);
                if (data) {
                  this.profileDetails = data;
                } else {
                  this.errorMessage = 'No profile data found';
                }
              },
              (error) => {
                console.error('Error fetching profile data', error);
                this.errorMessage = 'Error fetching profile details.';
              }
            );
          }

}
