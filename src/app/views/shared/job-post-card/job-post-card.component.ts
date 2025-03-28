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

     jobProfile() {
      if (this.job && this.job._id) {
        console.log('Navigating to Seeker Profile:', this.job._id);
        this.router.navigateByUrl(`talent-page/seeker/job-details/${this.job._id}`);
      } else {
        console.error(' Job ID is missing.');
      }
    }



}
