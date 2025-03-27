import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  JobPost,
  JobResponse,
} from 'src/app/core/models/jobPost.model';
import { JobPostService } from 'src/app/core/services/jobPost.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-seeker-jobProfile',
  templateUrl: './seeker-jobProfile.component.html',
  styleUrls: ['./seeker-jobProfile.component.css'],
})
export class SeekerJobProfileComponent implements OnInit {
  jobs: JobPost[] = [];
  appliedJobs: JobPost[] = [];
  selectedJob!: JobPost;

  seekerId: string = ''; // populated from localStorage
  errorMessage: string = '';
  jobId!: string;
  totalJobPosts!: any;

  filteredData: any[] = []; // Filtered jobs after applying search and checkbox filters
  paginatedData: any[] = []; // Jobs for the current page
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  pageNumbers: number[] = [];
  selectAll: boolean = false;
  totalEntries = this.filteredData.length;

  constructor(
    private router: Router,
    private jobService: JobPostService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.seekerId = localStorage.getItem('userId') || '';
    if (this.seekerId) {
      this.fetchJobPosts();
      this.loadAppliedJobs();
    } else {
      this.errorMessage = 'Recruiter ID is missing. Please log in again.';
    }
  }

  fetchJobPosts() {
    this.jobService.getAllJobPosts(this.seekerId).subscribe(
      (response: JobPost[]) => {
        this.jobs = response.map((jobPost: JobPost) => ({
          ...jobPost,
          jobPostDetails: {
            ...jobPost.jobPostDetails,
            sanitizedJobDescription: this.sanitizeHtml(jobPost.jobPostDetails.jobDescription || ''),
            isApplied: jobPost.applicants?.some(app => app.seekerId && app.seekerId.toString() === this.seekerId) || false
          },
          recruiterId: jobPost.recruiterProfile ? { ...jobPost.recruiterProfile } : undefined,
          companyId: jobPost.companyId ? {
            ...jobPost.companyId
          } : undefined,
        }));
        this.filteredData = [...this.jobs]; // Ensure filteredData is updated
        this.totalEntries = this.filteredData.length; // Ensure total count updates
        this.updatePagination();
      },
      (error) => {
        console.log('Error fetching job posts:', error);
        this.errorMessage = 'Failed to load job posts. Please try again later.';
      }
    );
  }


  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  loadAppliedJobs(): void {
    this.jobService.getAppliedJobPosts(this.seekerId).subscribe({
      next: (applied: JobPost[]) => {
        this.appliedJobs = applied;
        this.jobs.forEach(job => {
          job.jobPostDetails.isApplied = job.applicants?.some(app => app.seekerId.toString() === this.seekerId) || false;
        });

      },
      error: (err) => {
        console.log('Error loading applied jobs:', err);
      }
    });
  }




  selectJob(job: JobPost): void {
    this.selectedJob = { ...job, };
  }


  applyJob(job: JobPost): void {
    if (!job._id) {
      console.log('Job ID is missing');
      return;
    }
    const jobId: string = job._id;
    const jobData = {
      ...job,
      jobPostDetails: { ...job.jobPostDetails, isApplied: true },
    };

    this.jobService.applyJobPostById(this.seekerId, jobId, jobData).subscribe({
      next: (updatedJob: JobPost) => {
        // Update applied flag on the job
        job.jobPostDetails.isApplied = true;
        if (this.selectedJob && this.selectedJob._id === jobId) {
          this.selectedJob.jobPostDetails.isApplied = true;
        }
      },
      error: (err) => {
        console.error('Error applying for job:', err);
      },
    });
  }

  withdrawJob(job: JobPost): void {
    if (!job._id) {
      console.error('Job ID is missing');
      return;
    }

    const jobId: string = job._id;
    const jobData = {
      ...job,
      jobPostDetails: { ...job.jobPostDetails, isApplied: false },
    };

    this.jobService
      .withdrawJobPostById(this.seekerId, jobId, jobData)
      .subscribe({
        next: (updatedJob: JobPost) => {
          job.jobPostDetails.isApplied = false;
          if (
            this.selectedJob &&
            this.selectedJob._id === jobId
          ) {
            this.selectedJob.jobPostDetails.isApplied = false;
          }
          console.log('Job withdrawn:', job);
        },
        error: (err) => {
          console.error('Error withdrawing job application:', err);
        },
      });
  }

  goBack() {
    this.router.navigate(['talent-page/seeker/mainpage']);
  }

  goToStudentProfile() {
    this.router.navigate(['talent-page/seeker/mainpage']);
  }
  goToEditProfile() {
    this.router.navigate(['talent-page/seeker/edit-profile']);
  }

  goToUploadPage() {
    this.router.navigate(['talent-page/seeker/upload-section']);
  }





  // filterData(): void {
  //   let projects = [...this.jobs];

  //   if (this.searchTerm) {
  //     projects= projects.filter(project =>
  //       project.projectDetails.projectTitle.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
  //       project.projectDetails.projectType.toLowerCase().includes(this.searchTerm.toLowerCase())
  //     );
  //   }

  //   this.filteredData = projects;
  //   this.totalEntries = this.filteredData.length;
  //   this.currentPage = 1;
  //   this.paginateData();
  // }




  getStartIndex(): number {
    if (this.totalEntries === 0) return 0;
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalEntries);
  }



  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
    this.paginatedData = this.filteredData.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }





  paginateData(): void {
    this.totalEntries = this.filteredData.length;
    this.totalPages = Math.max(Math.ceil(this.totalEntries / this.itemsPerPage), 1); // Ensure at least 1 page

    // ✅ Ensure current page is within valid bounds
    this.currentPage = Math.max(1, Math.min(this.currentPage, this.totalPages));

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedData = this.filteredData.slice(startIndex, startIndex + this.itemsPerPage);

    this.pageNumbers = this.totalPages > 0 ? Array.from({ length: this.totalPages }, (_, i) => i + 1) : [1];
  }


  updatePagination(): void {
    this.totalEntries = this.filteredData.length;
    this.totalPages = Math.max(Math.ceil(this.totalEntries / this.itemsPerPage), 1); // Ensure at least 1 page
    this.paginateData();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.paginateData();
    }
  }

}
