import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SeekerProfile } from 'src/app/core/models/profile-details.model';
import { Seeker, SeekerData } from 'src/app/core/models/user.model';
import { ProfileService } from 'src/app/core/services/profile-service';
import { UserService } from 'src/app/core/services/user-service';

@Component({
  selector: 'app-recruiter-hire-seeker',
  templateUrl: './recruiter-hire-seeker.component.html',
  styleUrls: ['./recruiter-hire-seeker.component.css']
})
export class RecruiterHireSeekerPageComponent {
  seekers: SeekerData[] = [];
  recruiterId!:string

 errorMessage: string = '';

   constructor(
     private router: Router,
     private profileService: ProfileService,
   ) {}


     ngOnInit() {
         this.fetchSeekers();
     }
     fetchSeekers() {
      this.recruiterId = localStorage.getItem('userId') || '';
      if (!this.recruiterId) {
        this.errorMessage = 'Recruiter ID is missing. Please log in again.';
        return;
      }

      this.profileService.getSeekerData(this.recruiterId).subscribe(
        (response) => {
          this.seekers = response.seekers.map((seeker: SeekerData) => ({
            _id: seeker._id,
            profile: seeker.profile || {}, // ✅ Avoids undefined error
            seekerProjectUpload: seeker.seekerProjectUpload || [], // ✅ Ensures it's always an array
            role: seeker.role,
            status: seeker.status,
            lastLoginAt: seeker.lastLoginAt,
            createdAt: seeker.createdAt
          }));
        },
        (error) => {
          console.error('❌ Error fetching seekers:', error);
          this.errorMessage = 'Failed to load seekers. Please try again later.';
        }
      );
    }






}
