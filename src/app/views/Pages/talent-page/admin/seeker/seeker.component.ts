import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { Seeker, SeekerResponse } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/user-service';

@Component({
  selector: 'app-seeker',
  templateUrl: './seeker.component.html',
  styleUrls: ['./seeker.component.css'],
})
export class SeekerComponent {
  public seekers: Seeker[] = [];
  public errorMessage: string | null = null;
  public totalSeekers!: number;
        loading: boolean = false;

        searchTerm: string = ''; // Variable to store search term
        filteredData: any[] = []; // Filtered jobs after applying search and checkbox filters
        paginatedData: any[] = []; // Jobs for the current page
        currentPage: number = 1;
        itemsPerPage: number = 5;
        totalPages: number = 1;
        pageNumbers: number[] = [];
        selectedSeeker:any
        selectedSeekers: any[] = []; // Define selectedCompanies with 'any' type
        isFullTime = false;
        isPartTime = false;
        isDeleteVisible = false; // To control visibility of the delete button
        selectAll: boolean = false;
        totalEntries = this.filteredData.length;


  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.fetchSeekers();
  }

  goToSeekerDetails(seeker: Seeker) {
    if (!seeker || !seeker._id) {
      console.error('Universtiy ID is missing or invalid');
      return;
    }
    this.router.navigateByUrl(`talent-page/admin/seeker-details/${seeker._id}`);
  }

  get hasSeekers(): boolean {
    return this.seekers.length > 0;
  }



  fetchSeekers() {
    this.userService.getAllSeekers().subscribe(
      (response: SeekerResponse) => {
          this.totalSeekers = response.totalSeekers; // Store total count
          this.seekers = response.seekers;
          this.filteredData = [...this.seekers]; // Ensure filteredJobs is updated
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


  updateSelectedSeekers() {
    this.selectedSeekers= this.paginatedData.filter( seeker => seeker.selected);
  }


toggleSelectAll() {
  const shouldSelectAll = !this.isAllSelected();
  this.paginatedData.forEach(seeker  => {
    seeker.selected = shouldSelectAll;
  });

  if (shouldSelectAll) {
    this.selectedSeekers = [
      ...this.selectedSeekers,
      ...this.paginatedData.filter(seeker => !this.selectedSeekers.some(d => d.id === seeker.id))
    ];
  } else {
    this.selectedSeekers = this.selectedSeekers.filter(
      seeker => !this.paginatedData.some(pData => pData.id === seeker.id)
    );
  }
}

isAllSelected(): boolean {
  return this.paginatedData.length > 0 && this.paginatedData.every(seeker  => seeker.selected);
}

selectSeeker(seeker: any) {
  seeker.selected = !seeker.selected;
  if (seeker .selected) {
    this.selectedSeekers.push(seeker);
  } else {
    this.selectedSeekers  = this.selectedSeekers.filter(s => s.id !== seeker.id);
  }
  this.selectAll = this.isAllSelected();
}



deleteSelected() {
  this.seekers = this.seekers.filter(seeker  => !this.selectedSeekers.includes(seeker ));
  this.filteredData = this.filteredData.filter(seeker  => !this.selectedSeekers.includes(seeker));

  this.selectedSeekers = [];
  this.selectAll = false;

  this.paginateJobs();
}


  filterData(): void {
    let seekers = [...this.seekers];
    if (this.searchTerm) {
      seekers  = seekers.filter(seeker =>
        seeker.registrationDetails.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredData = seekers;
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
