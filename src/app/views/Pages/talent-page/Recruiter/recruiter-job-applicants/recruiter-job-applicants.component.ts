import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobPost, JobResponse } from 'src/app/core/models/jobPost.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { JobPostService } from 'src/app/core/services/jobPost.service';

@Component({
  selector: 'app-recruiter-job-applicants',
  templateUrl: './recruiter-job-applicants.component.html',
  styleUrls: ['./recruiter-job-applicants.component.css']
})
export class RecruiterJobApplicantsPageComponent implements OnInit {
  public jobs: JobPost[] = [];
  public errorMessage: string | null = null;
  public totalJobs!: number;

  recruiterId!: string;




    totalJobPosts!: number;
    loading: boolean = false;


    searchTerm: string = ''; // Variable to store search term
    filteredJobs: any[] = []; // Filtered jobs after applying search and checkbox filters
    paginatedJobs: any[] = []; // Jobs for the current page
    currentPage: number = 1;
    itemsPerPage: number = 5;
    totalPages: number = 1;
    pageNumbers: number[] = [];

    isFullTime = false;
    isPartTime = false;
    isDeleteVisible = false; // To control visibility of the delete button
    selectAll: boolean = false;
    totalEntries = this.filteredJobs.length;


    constructor(
      private jobService: JobPostService,
      private router: Router,
      private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
      this.recruiterId = localStorage.getItem('userId') || '';
      if (this.recruiterId) {
        this.fetchJobs();
      } else {
        this.errorMessage = 'Recruiter ID is missing. Please log in again.';
      }

    }

    fetchJobs() {
      this.jobService.getRecruiterJobApplicants(this.recruiterId).subscribe(
        (response: JobResponse) => {
          this.totalJobPosts = response.totalJobPosts;
          this.jobs = response.jobPosts;
          this.filteredJobs = [...this.jobs]; // Ensure filteredJobs is updated
          this.totalEntries = this.filteredJobs.length; // Ensure total count updates

          this.updatePagination();

        },
        (error) => {
          console.error('Error fetching job posts:', error);
          this.errorMessage = error.message || 'Failed to load job posts. Please try again later.';
        }
      );
    }



    get hasJobPosts(): boolean {
      return this.jobs.length > 0;
    }



    filterJobs(): void {
      let jobs = [...this.jobs];

      if (this.searchTerm) {
        jobs = jobs.filter(job =>
          job.jobPostDetails.jobTitle.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          job.jobPostDetails.jobType.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          job.jobPostDetails.jobId.toLowerCase().includes(this.searchTerm.toLowerCase())


        );
      }

      this.filteredJobs = jobs;
      this.totalEntries = this.filteredJobs.length;
      this.currentPage = 1;
      this.paginateJobs();
    }


    paginateJobs(): void {
      this.totalEntries = this.filteredJobs.length;
      this.totalPages = Math.max(Math.ceil(this.totalEntries / this.itemsPerPage), 1); // Ensure at least 1 page

      // ✅ Ensure current page is within valid bounds
      this.currentPage = Math.max(1, Math.min(this.currentPage, this.totalPages));

      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      this.paginatedJobs = this.filteredJobs.slice(startIndex, startIndex + this.itemsPerPage);

      this.pageNumbers = this.totalPages > 0 ? Array.from({ length: this.totalPages }, (_, i) => i + 1) : [1];
    }

    updatePagination(): void {
      this.totalEntries = this.filteredJobs.length;
      this.totalPages = Math.max(Math.ceil(this.totalEntries / this.itemsPerPage), 1); // Ensure at least 1 page
      this.paginateJobs();
    }

    onPageChange(page: number): void {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.paginateJobs();
      }
    }


    getStartIndex(): number {
      return this.totalEntries === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
    }

    getEndIndex(): number {
      return Math.min(this.currentPage * this.itemsPerPage, this.totalEntries);
    }

    resetSearch() {
      this.searchTerm = '';
      this.filterJobs();
    }

      // Navigate to view applicants for a specific job post
  viewApplicants(jobPost: JobPost): void {
    if (!jobPost || !jobPost._id) {
      console.error('Job post ID is missing or invalid');
      return;
    }
    this.router.navigate([`/talent-page/recruiter/jobpost/${jobPost._id}/applicants`]);
  }

}
