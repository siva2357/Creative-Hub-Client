import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobPost, JobResponse } from 'src/app/core/models/jobPost.model';
import { JobPostService } from 'src/app/core/services/jobPost.service';
@Component({
  selector: 'app-recruiter-manage-job',
  templateUrl: './recruiter-manage-job.component.html',
  styleUrls: ['./recruiter-manage-job.component.css']
})
export class RecruiterManageJobPageComponent implements OnInit {
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
    this.jobService.getJobsByRecruiter(this.recruiterId).subscribe(
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


    goToJobpostEdit(jobPost:JobPost): void {
      if (!jobPost || !jobPost._id) {
        console.error('Jobpost ID is missing or invalid');
        return;
      }
      this.router.navigateByUrl(`talent-page/recruiter/view-jobPost/${jobPost._id}`);
    }


    closeJobpostById(jobPostData: JobPost) {
      if (!jobPostData._id || !this.recruiterId) {
        console.error("Job ID or Recruiter ID is missing or invalid.");
        return;
      }

      const confirmClose = confirm("Are you sure you want to close this job post?");
      if (!confirmClose) return;
      const previousPage = this.currentPage; // ✅ Store the current page before update
      this.jobService.closeJobPostById(this.recruiterId, jobPostData._id, jobPostData).subscribe(
        () => {
          console.log("Job closed successfully!");

          // ✅ Fetch updated jobs and maintain pagination correctly
          this.fetchJobs();
        },
        (error) => {
          console.error("Error closing job:", error);
          alert("Failed to close the job. Please try again.");
        }
      );
    }




}
