import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { JobPostService } from 'src/app/core/services/jobPost.service';
import { JobPost, JobResponse } from 'src/app/core/models/jobPost.model';


@Component({
  selector: 'app-recruiter-closed-jobs',
  templateUrl: './recruiter-closed-jobs.component.html',
  styleUrls: ['./recruiter-closed-jobs.component.css']
})
export class RecruiterClosedJobsPageComponent implements OnInit {
  recruiterId!: string;
  jobs: JobPost[] = [];
  errorMessage: string | null = null;
  totalJobPosts!: number;
  loading: boolean = false;


  searchTerm: string = ''; // Variable to store search term
  filteredJobs: any[] = []; // Filtered jobs after applying search and checkbox filters
  paginatedJobs: any[] = []; // Jobs for the current page
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  pageNumbers: number[] = [];
  selectedJob:any
  selectedJobs: any[] = []; // Define selectedJobs with 'any' type
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
    this.jobService.getClosedJobsByRecruiter(this.recruiterId).subscribe(
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


  reopenJobpostById(jobPostData: JobPost) {
    if (!jobPostData._id || !this.recruiterId) {
      alert("Job ID or Recruiter ID is missing.");
      return;
    }
    if (!confirm("Are you sure you want to reopen this job post?")) return;

    const originalJobs = [...this.jobs];
    this.jobs = this.jobs.map(job =>
      job._id === jobPostData._id
        ? { ...job, jobPostDetails: { ...job.jobPostDetails, status: "Open" } }
        : job
    );

    this.jobService.reopenJobPostById(this.recruiterId, jobPostData._id, jobPostData).subscribe(
      () => {
        console.log(`Job ${jobPostData._id} reopened successfully.`);
        this.fetchJobs();
      },
      (error) => {
        console.error(`Failed to reopen job ${jobPostData._id}:`, error);
        alert("Failed to reopen the job. Please try again.");
        this.jobs = originalJobs;
      }
    );
    this.paginateJobs()
  }

  deleteJobpostById(jobPostData: JobPost) {
    if (!jobPostData._id || !this.recruiterId) {
      alert("Job ID or Recruiter ID is missing.");
      return;
    }
    if (!confirm("Are you sure you want to delete this job post?")) return;

    const originalJobs = [...this.jobs];
    this.jobs = this.jobs.filter(job => job._id !== jobPostData._id);

    this.jobService.deleteJobPostById(this.recruiterId, jobPostData._id).subscribe(
      () => {
        console.log(`Job ${jobPostData._id} deleted successfully.`);
        this.fetchJobs();
      },
      (error) => {
        console.error(`Failed to delete job ${jobPostData._id}:`, error);
        alert("Failed to delete the job. Please try again.");
        this.jobs = originalJobs;
      }
    );
    this.updatePagination()
  }

  updateSelectedJobs() {
    this.selectedJobs = this.paginatedJobs.filter(job => job.selected);
  }


toggleSelectAll() {
  const shouldSelectAll = !this.isAllSelected();
  this.paginatedJobs.forEach(job => {
    job.selected = shouldSelectAll;
  });

  if (shouldSelectAll) {
    this.selectedJobs = [
      ...this.selectedJobs,
      ...this.paginatedJobs.filter(job => !this.selectedJobs.some(j => j.id === job.id))
    ];
  } else {
    this.selectedJobs = this.selectedJobs.filter(
      job => !this.paginatedJobs.some(pJob => pJob.id === job.id)
    );
  }
}

isAllSelected(): boolean {
  return this.paginatedJobs.length > 0 && this.paginatedJobs.every(job => job.selected);
}

selectJob(job: any) {
  job.selected = !job.selected;
  if (job.selected) {
    this.selectedJobs.push(job);
  } else {
    this.selectedJobs = this.selectedJobs.filter(j => j.id !== job.id);
  }

  this.selectAll = this.isAllSelected();
}



deleteSelectedJobs() {
  this.jobs = this.jobs.filter(job => !this.selectedJobs.includes(job));
  this.filteredJobs = this.filteredJobs.filter(job => !this.selectedJobs.includes(job));

  this.selectedJobs = [];
  this.selectAll = false;

  this.paginateJobs();
}


  filterJobs(): void {
    let jobs = [...this.jobs];

    if (this.searchTerm) {
      jobs = jobs.filter(job =>
        job.jobPostDetails.jobTitle.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        job.jobPostDetails.jobType.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        job.jobPostDetails.status?.toLowerCase().includes(this.searchTerm.toLowerCase())


      );
    }

    this.filteredJobs = jobs;
    this.totalEntries = this.filteredJobs.length;
    this.currentPage = 1;
    this.paginateJobs();
  }





  getStartIndex(): number {
    if (this.totalEntries === 0) return 0;
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalEntries);
  }



  calculatePagination() {
    this.totalPages = Math.ceil(this.filteredJobs.length / this.itemsPerPage);
    this.paginatedJobs = this.filteredJobs.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
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



  resetSearch() {
    this.searchTerm = '';
    this.filterJobs();
  }







}
