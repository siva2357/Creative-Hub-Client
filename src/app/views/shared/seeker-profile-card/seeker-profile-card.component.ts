import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seeker-profile-card',
  templateUrl: './seeker-profile-card.component.html',
  styleUrls: ['./seeker-profile-card.component.css']
})
export class SeekerProfileCardComponent {

    constructor(private router: Router) { }

  seekerProfile(){
    // this.router.navigateByUrl(`talent-page/recruiter/seeker-profile/${seeker._id}`)
    this.router.navigateByUrl(`talent-page/recruiter/seeker-profile/:id`)
  }
}
