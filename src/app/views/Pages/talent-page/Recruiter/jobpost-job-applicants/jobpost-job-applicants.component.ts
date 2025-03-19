import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JobPostService } from 'src/app/core/services/jobPost.service';


@Component({
  selector: 'app-jobpost-job-applicants',
  templateUrl: './jobpost-job-applicants.component.html',
  styleUrls: ['./jobpost-job-applicants.component.css']
})
export class JobpostJobApplicantsComponent implements OnInit {
  recruiterId!: string;
  jobPostId!: string;
  applicants: any[] = [];

  constructor(private route: ActivatedRoute, private jobService: JobPostService) {}

  ngOnInit(): void {
    // Get parameters from the route
    this.jobPostId = this.route.snapshot.paramMap.get('jobPostId')!;
    this.recruiterId = localStorage.getItem('userId') || '';

    console.log("User ID:", this.recruiterId);

    // Fetch job applicants
    this.getJobApplicants();
  }

  getJobApplicants() {
    this.jobService.getJobApplicants(this.recruiterId, this.jobPostId).subscribe({
      next: (response) => {
        this.applicants = response.applicants;
      },
      error: (error) => {
        console.error('Error fetching applicants:', error);
      }
    });
  }
}
