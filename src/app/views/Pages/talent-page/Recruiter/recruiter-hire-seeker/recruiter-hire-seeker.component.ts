import { Languages } from './../../../../../core/models/profile-details.model';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SeekerProfile } from 'src/app/core/models/profile-details.model';
import { Seeker, SeekerData } from 'src/app/core/models/user.model';
import { ProfileService } from 'src/app/core/services/profile-service';
import { UserService } from 'src/app/core/services/user-service';
import { QUALIFICATION } from 'src/app/core/enums/qualification.enum';
import { LANGUAGE } from 'src/app/core/enums/language.enum';

@Component({
  selector: 'app-recruiter-hire-seeker',
  templateUrl: './recruiter-hire-seeker.component.html',
  styleUrls: ['./recruiter-hire-seeker.component.css']
})
export class RecruiterHireSeekerPageComponent {
  seekers: SeekerData[] = [];
  recruiterId!:string

 errorMessage: string = '';


     public qualifications = Object.values(QUALIFICATION); // Convert Enum to an array
     public languages = Object.values(LANGUAGE); // Convert Enum to an array



 public selectedFilters: any = {
   searchQuery: '',
   selectedQualification: '',
   selectedLanguage: '',
   selectedJobType: ''
 };

 public appliedFilters: any = {};


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
     private profileService: ProfileService,
   ) {}


     ngOnInit() {
         this.fetchSeekers();
     }
     fetchSeekers() {
      this.recruiterId = localStorage.getItem('userId') || '';
      if (!this.recruiterId) {
        this.errorMessage = 'Recruiter ID is missing. Please log in again.';
        return;
      }

      this.profileService.getSeekerData(this.recruiterId).subscribe(
        (response) => {
          this.seekers = response.seekers.map((seeker: SeekerData) => ({
            _id: seeker._id,
            profile: seeker.profile || {}, // ✅ Avoids undefined error
            seekerProjectUpload: seeker.seekerProjectUpload || [], // ✅ Ensures it's always an array
            role: seeker.role,
            status: seeker.status,
            lastLoginAt: seeker.lastLoginAt,
            createdAt: seeker.createdAt
          }));
          this.filteredData = [...this.seekers]; // Ensure filteredData is updated
          this.totalEntries = this.filteredData.length; // Ensure total count updates
          this.updatePagination();
        },
        (error) => {
          console.error('❌ Error fetching seekers:', error);
          this.errorMessage = 'Failed to load seekers. Please try again later.';
        }
      );
    }


// Method to store selected filter values
onFilterSelect(event: Event, filterType: string) {
  const target = event.target as HTMLSelectElement;
  this.selectedFilters[filterType] = target.value;
}

// Apply filters only when clicking the button
applyFilter() {
  // Apply filters based on selected values
  this.filteredData = this.seekers.filter(seeker => {
    return (
      (this.selectedFilters. selectedQualification ? seeker.profile.profileDetails.universityDegree.toLowerCase().includes(this.selectedFilters.selectedQualification.toLowerCase()) : true) &&
      (this.selectedFilters.searchQuery ? seeker.profile.profileDetails.city.toLowerCase().includes(this.selectedFilters.searchQuery.toLowerCase()) : true) &&
      (this.selectedFilters.selectedLanguage ? seeker.profile.profileDetails.city.toLowerCase().includes(this.selectedFilters.selectedLanguage.toLowerCase()) : true)

    );
  });

  // Update the total entries after filtering
  this.totalEntries = this.filteredData.length;

  // Call a function to update pagination if needed
  this.updatePagination();
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





    paginateData(): void {
      this.totalEntries = this.filteredData.length;
      this.totalPages = Math.max(Math.ceil(this.totalEntries / this.itemsPerPage), 1); // Ensure at least 1 page

      // ✅ Ensure current page is within valid bounds
      this.currentPage = Math.max(1, Math.min(this.currentPage, this.totalPages));

      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      this.paginatedData = this.filteredData.slice(startIndex, startIndex + this.itemsPerPage);

      this.pageNumbers = this.totalPages > 0 ? Array.from({ length: this.totalPages }, (_, i) => i + 1) : [1];
    }


    // updatePagination(): void {
    //   this.totalEntries = this.filteredData.length;
    //   this.totalPages = Math.max(Math.ceil(this.totalEntries / this.itemsPerPage), 1); // Ensure at least 1 page
    //   this.paginateData();
    // }

    updatePagination() {
      this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
      this.pageNumbers = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      this.paginateData();  }

    onPageChange(page: number): void {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.paginateData();
      }
    }




}
