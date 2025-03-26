import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SeekerData } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-seeker-profile-card',
  templateUrl: './seeker-profile-card.component.html',
  styleUrls: ['./seeker-profile-card.component.css']
})
export class SeekerProfileCardComponent {
  @Input() seeker: SeekerData | null = null; // ✅ Get seeker data as input

  constructor(private router: Router) {}

  seekerProfile() {
    if (this.seeker && this.seeker._id) {
      console.log('✅ Navigating to Seeker Profile:', this.seeker._id);
      this.router.navigateByUrl(`talent-page/recruiter/seeker-profile/${this.seeker._id}`);
    } else {
      console.error('❌ Seeker ID is missing. Cannot navigate.');
    }
  }
}
