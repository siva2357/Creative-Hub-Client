import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SeekerProfile } from 'src/app/core/models/profile-details.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProfileService } from 'src/app/core/services/profile-service';

@Component({
  selector: 'app-seeker-profile-page',
  templateUrl: './seeker-profile-page.component.html',
  styleUrls: ['./seeker-profile-page.component.css']
})
export class SeekerProfilePageComponent implements OnInit {

    seekerId!: string;
    profile: SeekerProfile | null = null;
    errorMessage: string = '';

    constructor(private router: Router, private authService: AuthService, private profileService: ProfileService) { }

    ngOnInit() {
        // Get the userId and role from localStorage or AuthService
        this.seekerId = localStorage.getItem('userId') || this.authService.getUserId() || '';
        const role = localStorage.getItem('userRole') || this.authService.getRole() || '';

        if (this.seekerId && role === 'seeker') {
            this.loadSeekerProfile();
        } else {
            this.errorMessage = 'Invalid user role or missing User ID.';
            this.router.navigate(['/login']); // Redirect to login if unauthorized
        }
    }

    loadSeekerProfile() {
        this.profileService.getSeekerProfileById(this.seekerId).subscribe(
            (data: SeekerProfile) => {
                this.profile = data;
            },
            (error) => {
                console.error('Error fetching profile data', error);
                this.errorMessage = 'Error fetching profile details.';
            }
        );
    }
}
