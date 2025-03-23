import { Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/core/services/admin.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Folder } from 'src/app/core/enums/folder-name.enum';
import { Company,CompanyResponse } from 'src/app/core/models/company.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AlertService } from 'src/app/core/services/alerts.service';
@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit{

    companies: Company[] = [];
    errorMessage: string | null = null;
    totalCompanies!: number;
    loading: boolean = false;

    searchTerm: string = ''; // Variable to store search term
    filteredData: any[] = []; // Filtered jobs after applying search and checkbox filters
    paginatedData: any[] = []; // Jobs for the current page
    currentPage: number = 1;
    itemsPerPage: number = 5;
    totalPages: number = 1;
    pageNumbers: number[] = [];
    selectedCompany:any
    selectedCompanies: any[] = []; // Define selectedCompanies with 'any' type
    isFullTime = false;
    isPartTime = false;
    isDeleteVisible = false; // To control visibility of the delete button
    selectAll: boolean = false;
    totalEntries = this.filteredData.length;

  isViewMode: boolean = true;
  uploadedFileData: { fileName: string; url: string; filePath: string } | null = null;


  constructor(private router: Router, private adminService: AdminService, private storage: AngularFireStorage,private sanitizer: DomSanitizer, private alert: AlertService
  ){}

  ngOnInit() {
    this.fetchCompanies();
  }



  get hasCompanies(): boolean {
    return this.companies.length > 0;
  }



  fetchCompanies() {
    this.adminService.getAllCompanies().subscribe(
      (response: CompanyResponse) => {
        this.totalCompanies = response.totalCompanies; // Store total count
        this.companies = response.companies;
        this.filteredData = [...this.companies]; // Ensure filteredJobs is updated
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


  goToCompanyPost(): void {
    this.router.navigateByUrl('talent-page/admin/company-post-form');
  }

  goToCompanyEdit(company:Company): void {
    if (!company || !company._id) {
      console.error('Universtiy ID is missing or invalid');
      return;
    }
    this.router.navigateByUrl(`talent-page/admin/company-edit-form/${company._id}`);
  }

  goToDashboard(){
    this.router.navigateByUrl('talent-page/admin/dashboard');
  }


  updateselectedCompanies() {
    this.selectedCompanies = this.paginatedData.filter( company => company.selected);
  }


toggleSelectAll() {
  const shouldSelectAll = !this.isAllSelected();
  this.paginatedData.forEach(company => {
    company.selected = shouldSelectAll;
  });

  if (shouldSelectAll) {
    this.selectedCompanies = [
      ...this.selectedCompanies,
      ...this.paginatedData.filter(job => !this.selectedCompanies.some(d => d.id === job.id))
    ];
  } else {
    this.selectedCompanies = this.selectedCompanies.filter(
      company => !this.paginatedData.some(pData => pData.id === company.id)
    );
  }
}

isAllSelected(): boolean {
  return this.paginatedData.length > 0 && this.paginatedData.every(company => company.selected);
}

selectCompany(company: any) {
  company.selected = !company.selected;
  if (company.selected) {
    this.selectedCompanies.push(company);
  } else {
    this.selectedCompanies = this.selectedCompanies.filter(c => c.id !== company.id);
  }

  this.selectAll = this.isAllSelected();
}



deleteSelected() {
  this.companies= this.companies.filter(company => !this.selectedCompanies.includes(company));
  this.filteredData = this.filteredData.filter(company => !this.selectedCompanies.includes(company));

  this.selectedCompanies = [];
  this.selectAll = false;

  this.paginateJobs();
}


  filterData(): void {
    let companies = [...this.companies];
    if (this.searchTerm) {
      companies = companies.filter(company =>
        company.companyDetails.companyId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        company.companyDetails.companyName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredData = companies;
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


async deleteCompanyById(id: string, filePath: string) {
  if (!id) {
    console.error("Company ID is missing or invalid.");
    return;
  }

  try {
    const userConfirmed = await this.alert.showCompanyConfirmDelete();
    if (!userConfirmed) return;
    const originalCompanies = [...this.companies];
    this.companies = this.companies.filter(company => company._id !== id);

    this.adminService.deleteCompanyById(id).subscribe(
      () => {
        this.alert.showCompanyDeletedSuccess();
        console.log("Company deleted successfully!");
        if (filePath) {
          this.deleteCompanyLogo(filePath);
        }
        this.fetchCompanies();
        this.updatePagination();
      },
      (error) => {
        console.error("Error deleting company:", error);
        alert("Failed to delete the company. Please try again.");
        this.companies = originalCompanies;
      }
    );
  } catch (error) {
    console.error("Error during deletion process:", error);
  }
}

deleteCompanyLogo(filePath: string): void {
  if (!filePath) {
    console.error("No file path provided for deletion.");
    return;
  }

  const correctedFilePath = `${Folder.Main_Folder}/${Folder.Admin_Folder}/${Folder.Admin_Sub_Folder_3}/${filePath}`;
  this.storage.ref(correctedFilePath).delete().subscribe({
    next: () => {
      console.log("Company logo deleted successfully from Firebase Storage");
    },
    error: (error) => {
      console.error("Error deleting company logo from Firebase Storage:", error);
      alert("Failed to delete the company logo. Please try again.");
    }
  });
}
}
