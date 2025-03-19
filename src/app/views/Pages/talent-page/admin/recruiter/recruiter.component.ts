import { UserService } from './../../../../../core/services/user-service';
import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { Recruiter, RecruiterResponse } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-recruiter',
  templateUrl: './recruiter.component.html',
  styleUrls: ['./recruiter.component.css'],
})
export class RecruiterComponent {
  public recruiters: Recruiter[] = [];
  public errorMessage: string | null = null;
  public totalRecruiters! :number;

      loading: boolean = false;


      searchTerm: string = ''; // Variable to store search term
      filteredData: any[] = []; // Filtered jobs after applying search and checkbox filters
      paginatedData: any[] = []; // Jobs for the current page
      currentPage: number = 1;
      itemsPerPage: number = 5;
      totalPages: number = 1;
      pageNumbers: number[] = [];
      selectedRecruiter:any
      selectedRecruiters: any[] = []; // Define selectedCompanies with 'any' type
      isFullTime = false;
      isPartTime = false;
      isDeleteVisible = false; // To control visibility of the delete button
      selectAll: boolean = false;
      totalEntries = this.filteredData.length;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.fetchRecruiters();
  }

  goToRecruiterDetails(recruiter: Recruiter) {
    if (!recruiter || !recruiter._id) {
      console.error('Universtiy ID is missing or invalid');
      return;
    }
    this.router.navigateByUrl(
      `talent-page/admin/recruiter-details/${recruiter._id}`
    );
  }

  get hasRecruiters(): boolean {
    return this.recruiters.length > 0;
  }

  fetchRecruiters() {
    this.userService.getAllRecruiters().subscribe(
      (response: RecruiterResponse) => {
          this.totalRecruiters = response.totalRecruiters; // Store total count
          this.recruiters = response.recruiters;
          this.filteredData = [...this.recruiters]; // Ensure filteredJobs is updated
          this.totalEntries = this.filteredData.length; // Ensure total count updates
          this.updatePagination();
      },
      (error) => {
        console.error('Error fetching recruiters:', error);
        this.errorMessage = 'Failed to load recruiters. Please try again later.';
      }
    );
  }


  goToUserData(){
    this.router.navigateByUrl('talent-page/admin/user-data');
  }


  updateSelectedRecruiters() {
    this.selectedRecruiters= this.paginatedData.filter( recruiter  => recruiter .selected);
  }


toggleSelectAll() {
  const shouldSelectAll = !this.isAllSelected();
  this.paginatedData.forEach(recruiter  => {
    recruiter.selected = shouldSelectAll;
  });

  if (shouldSelectAll) {
    this.selectedRecruiters = [
      ...this.selectedRecruiters,
      ...this.paginatedData.filter(recruiter  => !this.selectedRecruiters.some(d => d.id === recruiter.id))
    ];
  } else {
    this.selectedRecruiters = this.selectedRecruiters.filter(
      company => !this.paginatedData.some(pData => pData.id === company.id)
    );
  }
}

isAllSelected(): boolean {
  return this.paginatedData.length > 0 && this.paginatedData.every(recruiter => recruiter.selected);
}

selectRecruiter(recruiter : any) {
  recruiter.selected = !recruiter .selected;
  if (recruiter.selected) {
    this.selectedRecruiters.push(recruiter);
  } else {
    this.selectedRecruiters  = this.selectedRecruiters.filter(r => r.id !== recruiter.id);
  }
  this.selectAll = this.isAllSelected();
}



deleteSelected() {
  this.recruiters= this.recruiters.filter(recruiter => !this.selectedRecruiters.includes(recruiter ));
  this.filteredData = this.filteredData.filter(recruiter => !this.selectedRecruiters.includes(recruiter ));

  this.selectedRecruiters = [];
  this.selectAll = false;

  this.paginateJobs();
}


  filterData(): void {
    let recruiters = [...this.recruiters];
    if (this.searchTerm) {
      recruiters = recruiters.filter(recruiter =>
        recruiter.registrationDetails.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredData = recruiters;
    this.totalEntries = this.filteredData.length;
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
    this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
    this.paginatedData = this.filteredData.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }


  paginateJobs(): void {
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
    this.filterData();
  }
}
