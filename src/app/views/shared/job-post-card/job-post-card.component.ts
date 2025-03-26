import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Input } from '@angular/core';
import { JobPost } from 'src/app/core/models/jobPost.model';

@Component({
  selector: 'app-job-post-card',
  templateUrl: './job-post-card.component.html',
  styleUrls: ['./job-post-card.component.css']
})
export class JobPostCardComponent {

  @Input() job!:JobPost

      constructor(private router: Router) { }

    jobProfile(){
      // this.router.navigateByUrl(`talent-page/recruiter/seeker-profile/${seeker._id}`)
      this.router.navigateByUrl(`talent-page/seeker/job-details/:id`)
    }

}
