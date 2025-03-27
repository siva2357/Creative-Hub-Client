import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectUpload } from 'src/app/core/models/project-upload.model';
import { ProjectUploadService } from 'src/app/core/services/projectUpload.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent {
  public project!:ProjectUpload
  projectId!: string;
  seekerId!: string;
  errorMessage: string = '';
  fetchedURL: string | null = null;
  fileType: string | null = null;
  ifFetched: boolean = false;
    constructor(
      private projectService: ProjectUploadService,
      private activatedRouter: ActivatedRoute,
      private router: Router,
      private domSanitizer: DomSanitizer
    ) {}


  ngOnInit(): void {
    this.seekerId = localStorage.getItem('userId') || '';
    console.log('User ID:', this.seekerId);
    this.activatedRouter.paramMap.subscribe((param) => {
      this.projectId = param.get('projectId')!;
      console.log('Company ID:', this. projectId);

      if (this.projectId) {
        this.fetchProjectData(); // Call API only after ID is fetched
      }
    });
  }

  fetchProjectData() {
    this.projectService.getProjectById(this.seekerId,this.projectId).subscribe(
      (projectData: ProjectUpload) => {
        if (projectData) {
          this.project = projectData;
          if (this.project.projectDetails.file.url) {
            this.fetchedURL = this.project.projectDetails.file.url;
            this.ifFetched = true;
              // Determine the file type based on the fileName extension
          const fileName = this.project.projectDetails.file.fileName.toLowerCase();
          if (fileName.endsWith('.mp4') || fileName.endsWith('.webm') || fileName.endsWith('.ogg')) {
            this.fileType = 'video';
          } else if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || fileName.endsWith('.png') || fileName.endsWith('.gif') || fileName.endsWith('.webp')) {
            this.fileType = 'image';
          } else if (fileName.endsWith('.pdf')) {
            this.fileType = 'pdf';
          } else if (fileName.endsWith('.mp3') || fileName.endsWith('.wav')) {
            this.fileType = 'audio';
          } else {
            this.fileType = 'unknown';
          }

          }
        } else {
          this.errorMessage = 'project data not found';
        }
      },
      (error) => {
        this.errorMessage = 'Failed to load university data';
      }
    );
  }

  getFileType(file: File): string {
    const mimeType = file.type;

    if (mimeType.startsWith('image/')) {
      return 'image';
    } else if (mimeType.startsWith('video/')) {
      return 'video';
    } else if (mimeType === 'application/pdf') {
      return 'pdf';
    } else if (mimeType.startsWith('audio/')) {
      return 'audio';
    } else {
      return 'unknown';
    }
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

}
