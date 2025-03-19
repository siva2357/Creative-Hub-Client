import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Folder } from 'src/app/core/enums/folder-name.enum';
import { ProjectResponse, ProjectUpload } from 'src/app/core/models/project-upload.model';
import { ProjectUploadService } from 'src/app/core/services/projectUpload.service';
import { Router} from '@angular/router';
@Component({
  selector: 'app-seeker-manage-project',
  templateUrl: './seeker-manage-project.component.html',
  styleUrls: ['./seeker-manage-project.component.css']
})

export class SeekerManageProjectPageComponent implements OnInit{
 public seekerId!:string;
  public projects: ProjectUpload[] = [];
  public totalProjects!:any
  isViewMode: boolean = true;
  public errorMessage: string | null = null;
  uploadedFileData: { fileName: string; url: string; filePath: string } | null = null;
    loading: boolean = false;


    searchTerm: string = ''; // Variable to store search term
    filteredData: any[] = []; // Filtered jobs after applying search and checkbox filters
    paginatedData: any[] = []; // Jobs for the current page
    currentPage: number = 1;
    itemsPerPage: number = 5;
    totalPages: number = 1;
    pageNumbers: number[] = [];
    selectedProject:any
    selectedProjects: any[] = []; // Define selectedJobs with 'any' type
    selectAll: boolean = false;
    totalEntries = this.filteredData.length;


  constructor(private router: Router, private projectService: ProjectUploadService, private storage: AngularFireStorage,private sanitizer: DomSanitizer
  ){}



    ngOnInit() {
      this.seekerId = localStorage.getItem('userId') || '';

      console.log("User ID:", this.seekerId);

      if (this.seekerId) {
        this.fetchProjects();
      } else {
        this.errorMessage = 'Recruiter ID is missing. Please log in again.';
      }
    }

    get hasJobPosts(): boolean {
      return this.projects.length > 0;
    }




  goToProjectEdit(project:ProjectUpload) {
    if (!project || !project._id) {
      console.error('Universtiy ID is missing or invalid');
      return;
    }
      this.router.navigateByUrl(`talent-page/seeker/edit-project/${project._id}`)
  }





  deleteProjectById(projectId: string, filePath: string) {
    if (!projectId) {
      console.error("University ID is missing or invalid.");
      return;
    }

    const confirmDelete = confirm("Are you sure you want to delete this university?");
    if (!confirmDelete) return;
    const originalProjects = [...this.projects];
    this.projects = this.projects.filter(project => project._id !== projectId);


    this.projectService.deleteProjectById(this.seekerId,projectId).subscribe(
      () => {
        console.log("Company deleted successfully!");
        if (filePath) {
          this.deleteProjectFile(filePath);
        }
        this.fetchProjects()
      },
      (error) => {
        console.error("Error deleting university:", error);
        alert("Failed to delete the university. Please try again.");
        this.projects = originalProjects;
      }
    );
    this.updatePagination()
  }

  deleteProjectFile(filePath: string): void {
    if (!filePath) {
      console.error("No file path provided for deletion.");
      return;
    }
    const correctedFilePath = `${Folder.Main_Folder}/${Folder.Seeker_Folder}/${Folder.Seeker_Sub_Folder_2}/${filePath}`;
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


  get hasProjects(): boolean {
    return this.projects.length > 0;
  }


  fetchProjects() {
    this.projectService.getProjects(this.seekerId).subscribe(
      (response: ProjectResponse) => {
        this.totalProjects = response.totalProjects; // Store total count
        this.projects = response.projects.map((project: ProjectUpload) => ({
          ...project,
          projectDetails: {
            ...project.projectDetails,
            sanitizedProjectDescription: this.sanitizeHtml(project.projectDetails.projectDescription) // Assign inside universityDetails
          }
        }));
        this.filteredData = [...this.projects]; // Ensure filteredData is updated
        this.totalEntries = this.filteredData.length; // Ensure total count updates
        this.updatePagination();
      },
      (error) => {
        console.error('Error fetching job posts:', error);
        this.errorMessage = error.message || 'Failed to load job posts. Please try again later.';
      }
    );
  }


  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
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

isVideo(url: string): boolean {
  return this.hasValidExtension(url, ['mp4', 'webm', 'ogg']);
}

isAudio(url: string): boolean {
  return this.hasValidExtension(url, ['mp3']);
}

isPDF(url: string): boolean {
  return this.hasValidExtension(url, ['pdf']);
}

getFileExtension(url: string): string {
  const ext = url.split('?')[0].toLowerCase();
  return ext.split('.').pop() || 'unknown';
}

 private handleError(error: any, action: string) {
    console.error(`Error ${action}:`, error);
    alert(`Failed to ${action}. Please try again later.`);
  }


  updateSelectedData() {
    this.selectedProjects = this.paginatedData.filter(project => project.selected);
  }

  toggleSelectAll() {
    const shouldSelectAll = !this.isAllSelected();
    this.paginatedData.forEach(project => {
      project.selected = shouldSelectAll;
    });

    if (shouldSelectAll) {
      this.selectedProjects = [
        ...this.selectedProjects,
        ...this.paginatedData.filter(project => !this.selectedProjects.some(p => p.id === project.id))
      ];
    } else {
      this.selectedProjects = this.selectedProjects.filter(
        project => !this.paginatedData.some(pData=> pData.id === project.id)
      );
    }
  }

  isAllSelected(): boolean {
    return this.paginateData.length > 0 && this.paginatedData.every(project=> project.selected);
  }

  selectProject(project: any) {
    project.selected = !project.selected;
    if (project.selected) {
      this.selectedProjects.push(project);
    } else {
      this.selectedProjects = this.selectedProjects.filter(p => p.id !== project.id);
    }

    this.selectAll = this.isAllSelected();
  }



  deleteSelectedProjects() {
    this.projects = this.projects.filter(item => !this.selectedProjects.includes(this.projects.includes(item)));

    this.selectedProjects = [];
    this.selectAll = false;

    this.paginateData();
  }


  filterData(): void {
    let projects = [...this.projects];

    if (this.searchTerm) {
      projects= projects.filter(project =>
        project.projectDetails.projectTitle.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        project.projectDetails.projectType.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredData = projects;
    this.totalEntries = this.filteredData.length;
    this.currentPage = 1;
    this.paginateData();
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



  resetSearch() {
    this.searchTerm = '';
    this.filterData();
  }


}
