import { Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { University, UniversityResponse } from 'src/app/core/models/university.model';
import { AdminService } from 'src/app/core/services/admin.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Folder } from 'src/app/core/enums/folder-name.enum';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';



@Component({
  selector: 'app-university',
  templateUrl: './university.component.html',
  styleUrls: ['./university.component.css']
})
export class UniversityComponent implements OnInit  {
    universities: University[] = [];
    errorMessage: string | null = null;
    totalUniversities!: number;
    loading: boolean = false;


    searchTerm: string = ''; // Variable to store search term
    filteredData: any[] = []; // Filtered jobs after applying search and checkbox filters
    paginatedData: any[] = []; // Jobs for the current page
    currentPage: number = 1;
    itemsPerPage: number = 5;
    totalPages: number = 1;
    pageNumbers: number[] = [];
    selectedUniversity:any
    selectedUniversities: any[] = []; // Define selectedCompanies with 'any' type
    isFullTime = false;
    isPartTime = false;
    isDeleteVisible = false; // To control visibility of the delete button
    selectAll: boolean = false;
    totalEntries = this.filteredData.length;

  isViewMode: boolean = true;
  uploadedFileData: { fileName: string; url: string; filePath: string } | null = null;


  constructor(private router: Router, private adminService: AdminService, private storage: AngularFireStorage,private sanitizer: DomSanitizer
  ){}

  ngOnInit() {
    this.fetchUniversities();
  }



  get hasUniversities(): boolean {
    return this.universities.length > 0;
  }



  fetchUniversities() {
    this.adminService.getAllUniversities().subscribe(
      (response: UniversityResponse) => {
        this.totalUniversities = response.totalUniversities; // Store total count
        this.universities = response.universities;
        this.filteredData = [...this.universities]; // Ensure filteredJobs is updated
        this.totalEntries = this.filteredData.length; // Ensure total count updates
        this.updatePagination();
      },
      (error) => {
        console.error('Error fetching universities:', error);
        this.errorMessage = 'Failed to load universities. Please try again later.';
      }
    );
  }


// Common method to check file extension
private hasValidExtension(url: string, validExtensions: string[]): boolean {
  const ext = url.split('?')[0].toLowerCase();
  const extension = ext.split('.').pop() || '';
  return validExtensions.includes(extension);
}

isImage(url: string): boolean {
  return this.hasValidExtension(url, ['jpg', 'jpeg', 'png', 'gif', 'webp']);
}


getFileExtension(url: string): string {
  const ext = url.split('?')[0].toLowerCase();
  return ext.split('.').pop() || 'unknown';
}

 private handleError(error: any, action: string) {
    console.error(`Error ${action}:`, error);
    alert(`Failed to ${action}. Please try again later.`);
  }


  goToUniversityPost(): void {
    this.router.navigateByUrl('talent-page/admin/university-post-form');
  }

  goToUniversityEdit(university:University): void {
    if (!university || !university._id) {
      console.error('Universtiy ID is missing or invalid');
      return;
    }
    this.router.navigateByUrl(`talent-page/admin/university-edit-form/${university._id}`);
  }

  goToDashboard(){
    this.router.navigateByUrl('talent-page/admin/dashboard');
  }


  updateSelectedUniversities() {
    this.selectedUniversities = this.paginatedData.filter( university => university.selected);
  }


toggleSelectAll() {
  const shouldSelectAll = !this.isAllSelected();
  this.paginatedData.forEach(university => {
    university.selected = shouldSelectAll;
  });

  if (shouldSelectAll) {
    this.selectedUniversities = [
      ...this.selectedUniversities,
      ...this.paginatedData.filter(university => !this.selectedUniversities.some(d => d.id === university.id))
    ];
  } else {
    this.selectedUniversities = this.selectedUniversities.filter(
      university => !this.paginatedData.some(pData => pData.id === university.id)
    );
  }
}

isAllSelected(): boolean {
  return this.paginatedData.length > 0 && this.paginatedData.every(university => university.selected);
}

selectUniversity(university: any) {
  university.selected = !university.selected;
  if (university.selected) {
    this.selectedUniversities.push(university);
  } else {
    this.selectedUniversities= this.selectedUniversities.filter(u => u.id !== university.id);
  }

  this.selectAll = this.isAllSelected();
}



deleteSelected() {
  this.universities= this.universities.filter(university => !this.selectedUniversities.includes(university));
  this.filteredData = this.filteredData.filter(university => !this.selectedUniversities.includes(university));

  this.selectedUniversities = [];
  this.selectAll = false;

  this.paginateJobs();
}


  filterData(): void {
    let universities = [...this.universities];
    if (this.searchTerm) {
      universities = universities.filter(university =>
        university.universityDetails.universityId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        university.universityDetails.universityName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredData = universities;
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


  deleteUniversityById(id: string, filePath: string) {
    if (!id) {
      console.error("University ID is missing or invalid.");
      return;
    }

    const confirmDelete = confirm("Are you sure you want to delete this university?");
    if (!confirmDelete) return;
    const originalUniversities = [...this.universities];
    this.universities = this.universities.filter(university => university._id !== id);
    this.adminService.deleteUniversityById(id).subscribe(
      () => {
        console.log("Company deleted successfully!");
        if (filePath) {
          this.deleteUniversityLogo(filePath);
        }
        this.fetchUniversities()
      },
      (error) => {
        console.error("Error deleting university:", error);
        alert("Failed to delete the university. Please try again.");
        this.universities = originalUniversities;
      }
    );

    this.updatePagination()
  }

  deleteUniversityLogo(filePath: string): void {
    if (!filePath) {
      console.error("No file path provided for deletion.");
      return;
    }
    const correctedFilePath = `${Folder.Main_Folder}/${Folder.Admin_Folder}/${Folder.Admin_Sub_Folder_2}/${filePath}`;
    this.storage.ref(correctedFilePath).delete().subscribe({
      next: () => {
        console.log("University logo deleted successfully from Firebase Storage");
      },
      error: (error) => {
        console.error("Error deleting university logo from Firebase Storage:", error);
        alert("Failed to delete the university logo. Please try again.");
      }
    });
  }




}
