import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectResponse, ProjectUpload } from 'src/app/core/models/project-upload.model';
import { ProjectUploadService } from 'src/app/core/services/projectUpload.service';

@Component({
  selector: 'app-seeker-portfolio',
  templateUrl: './seeker-portfolio.component.html',
  styleUrls: ['./seeker-portfolio.component.css']
})
export class SeekerPortfolioComponent {
  isPortfolio =false;
  public seekerId!:string;
  projects: ProjectUpload[] = [];
  projectPDF! : ProjectUpload
  categories: string[] = ['All', 'Art Concepts', '3D Environment', '3D Animations', 'Game Development', 'AR/VR'];
  selectedCategory: string = 'All';
  public errorMessage: string | null = null;
  public totalProjects!:any

  projectsByCategory: { [key: string]: ProjectUpload[] } = {};


  constructor(private projectService: ProjectUploadService,private router:Router) { }


  ngOnInit() {
    this.seekerId = localStorage.getItem('userId') || '';

    console.log("User ID:", this.seekerId);

    if (this.seekerId) {
      this.fetchProjects('All');
    } else {
      this.errorMessage = 'Recruiter ID is missing. Please log in again.';
    }
  }

  get hasProjects(): boolean {
    return this.projects.length > 0;
  }


  fetchProjects(category: string) {
    this.projectService.getProjects(this.seekerId).subscribe(
        (response: ProjectResponse) => {
          // Handle successful response
          this.totalProjects = response.totalProjects; // Store total count
          this.projects = response.projects; // Directly assign the jobPosts array
          if (category === 'All') {
            this.projects = this.projects;
            this.projectsByCategory = this.groupProjectsByCategory(this.projects);
          } else {
            this.projectsByCategory = this.groupProjectsByCategory(this.projects);
          }
        },
        (error) => {
          // Handle error response
          console.error('Error fetching job posts:', error);
          this.errorMessage = error.message || 'Failed to load job posts. Please try again later.';
        }
      );
    }


  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.fetchProjects(category);
  }

  private groupProjectsByCategory(projects: ProjectUpload[]): { [key: string]: ProjectUpload[] } {
    const grouped: { [key: string]: ProjectUpload[] } = {
      'Art Concepts': [],
      '3D Environment': [],
      '3D Animations': [],
      'Game Development': [],
      'AR/VR': []
    };
    projects.forEach(project => {
      if (grouped[project.projectDetails.projectType]) {
        grouped[project.projectDetails.projectType].push(project);
      }
    });
    return grouped;
  }

  get filteredCategories(): string[] {
    // Always include "All"
    const result = ['All'];
    // Loop over the hardcoded categories (skipping "All")
    this.categories.slice(1).forEach(category => {
      if (this.projectsByCategory[category] && this.projectsByCategory[category].length > 0) {
        result.push(category);
      }
    });
    return result;
  }



  viewDetails(project: ProjectUpload): void {
    if (!project || !project._id) {
      console.error('Project ID is missing or invalid');
      return;
    }
    this.router.navigateByUrl(`talent-page/seeker/project-details/${project._id}`);
  }



  goToManageProjectPage(){
    this.router.navigate(['manage-project']);
  }


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





  getFileExtension(url: string): string {
    const ext = url.split('?')[0].toLowerCase();
    return ext.split('.').pop() || 'unknown';
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



}
