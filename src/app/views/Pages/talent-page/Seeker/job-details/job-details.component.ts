import { Component, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobPost } from 'src/app/core/models/jobPost.model';
import { JobPostService } from 'src/app/core/services/jobPost.service';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.css']
})
export class JobDetailsComponent {

  job!: JobPost;
  seekerId: string = '';
  errorMessage: string = '';
  jobPostId!: string;
  isApplied: boolean = false;

  @Output() jobApplied = new EventEmitter<string>();

  constructor(
    private jobService: JobPostService,
    private activatedRoute: ActivatedRoute, // Fixed variable name
    private router: Router
  ) {}

  ngOnInit(): void {
    this.seekerId = localStorage.getItem('userId') || '';

    this.activatedRoute.paramMap.subscribe((params) => {
      this.jobPostId = params.get('id') || '';

      if (!this.jobPostId) {
        this.errorMessage = 'Invalid Job ID';
        return;
      }

      this.fetchJobDetails();
    });
  }

  fetchJobDetails(): void {
    this.jobService.getJobPostById(this.jobPostId).subscribe({
      next: (jobData: JobPost) => {
        this.job = jobData;
        this.checkIfApplied(); // ✅ Call after fetching job details
      },
      error: (error) => {
        console.error('Failed to fetch job post:', error);
        this.errorMessage = 'Failed to load job post data';
      }
    });
  }

  checkIfApplied(): void {
    this.jobService.getAppliedJobPost(this.seekerId, this.jobPostId).subscribe({
      next: (response) => {
        this.job.jobPostDetails.isApplied = response.isApplied;
      },
      error: (err) => {
        console.error('Error checking applied job:', err);
      }
    });
  }




  goBack(): void {
    this.router.navigateByUrl(`talent-page/seeker/jobProfile`);
  }

  applyJob(job: JobPost): void {  // Ensure it accepts a parameter
    if (!job._id) {
      console.error('Job ID is missing');
      return;
    }
    const jobId: string = job._id;
    const jobData = {
      ...job,
      jobPostDetails: { ...job.jobPostDetails, isApplied: true },
    };

    this.jobService.applyJobPostById(this.seekerId, jobId, jobData).subscribe({
      next: (updatedJob: JobPost) => {
        job.jobPostDetails.isApplied = true;
      },
      error: (err) => {
        console.error('Error applying for job:', err);
      },
    });
  }

  withdrawJob(job: JobPost): void {  // Ensure it accepts a parameter
    if (!job._id) {
      console.error('Job ID is missing');
      return;
    }

    const jobId: string = job._id;
    const jobData = {
      ...job,
      jobPostDetails: { ...job.jobPostDetails, isApplied: false },
    };

    this.jobService.withdrawJobPostById(this.seekerId, jobId, jobData).subscribe({
      next: (updatedJob: JobPost) => {
        job.jobPostDetails.isApplied = false;
        console.log('Job withdrawn:', job);
      },
      error: (err) => {
        console.error('Error withdrawing job application:', err);
      },
    });
  }


  private handleError(error: any, action: string): void {
    console.error(`Error ${action}:`, error);
    alert(`Failed to ${action}. Please try again later.`);
  }
}
