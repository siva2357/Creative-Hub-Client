import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from 'src/app/core/services/profile-service';
import { SeekerData } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-recruiter-seeker-profile',
  templateUrl: './recruiter-seeker-profile.component.html',
  styleUrls: ['./recruiter-seeker-profile.component.css']
})
export class RecruiterSeekerProfileComponent implements OnInit {
  seekerId!: string;
  recruiterId!: string; // ✅ Declare recruiterId
  seeker: SeekerData | null = null;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.seekerId = params.get('id') || ''; // ✅ Extract seeker ID from the URL
      this.recruiterId = localStorage.getItem('userId') || ''; // ✅ Fetch recruiterId

      if (this.seekerId) {
        this.fetchSeekerProfile(this.seekerId, this.recruiterId); // ✅ Corrected parameter order
      } else {
        console.error("❌ Seeker ID is missing in route. Cannot fetch profile.");
      }
    });
  }

  fetchSeekerProfile(seekerId: string, recruiterId: string) { // Fix parameter order
    this.profileService.getSeekerDataById(recruiterId, seekerId).subscribe(
      (response) => {
        this.seeker = response;
        console.log("✅ Seeker profile fetched successfully:", this.seeker);
      },
      (error) => {
        console.error("❌ Error fetching seeker profile:", error);
        this.errorMessage = "Failed to load profile. Please try again.";
      }
    );
  }

}
