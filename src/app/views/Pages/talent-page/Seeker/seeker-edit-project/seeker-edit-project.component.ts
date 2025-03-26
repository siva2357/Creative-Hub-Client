import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ProjectUpload } from 'src/app/core/models/project-upload.model';
import { ProjectUploadService } from 'src/app/core/services/projectUpload.service';
import { DEFAULT_TOOLBAR, Editor, Toolbar } from 'ngx-editor';
import { Folder } from 'src/app/core/enums/folder-name.enum';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-seeker-edit-project',
  templateUrl: './seeker-edit-project.component.html',
  styleUrls: ['./seeker-edit-project.component.css'],
})
export class SeekerEditProjectComponent implements OnInit, OnDestroy {
  @Input() project!: ProjectUpload;
  isLoading: boolean = false;
  updateProjectForm!: FormGroup;
  editor!: Editor;
  toolbar: Toolbar = DEFAULT_TOOLBAR;
  isEditMode: boolean = false;
  errorMessage: string = '';
  projectActive: boolean = true;
  projectId!: string;
  seekerId!: string;
  ifPreview: boolean = false;
  ifFetched: boolean = false;
  uploadedFileData: { fileName: string; url: string; filePath: string } | null = null;
  fetchedURL: string | null = null;
  previewURL: SafeResourceUrl | null = null;
  fileType: string | null = null;

  isUpdating = false;

  fileUploadProgress: Observable<number | undefined> | undefined;
  uploadComplete = false;

  constructor(
    private projectService: ProjectUploadService,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private storage: AngularFireStorage,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.seekerId = localStorage.getItem('userId') || '';

    console.log('User ID:', this.seekerId);

    this.editor = new Editor();
    this.initializeForm()

    this.activatedRouter.paramMap.subscribe((param) => {
      this.projectId = param.get('projectId')!;
      console.log('Company ID:', this. projectId);

      if (this.projectId) {
        this.fetchProjectData(); // Call API only after ID is fetched
      }
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

    fetchProjectData() {
      this.projectService.getProjectById(this.seekerId,this.projectId).subscribe(
        (projectData: ProjectUpload) => {
          if (projectData) {
            this.project = projectData;
            this.initializeForm(); // Initialize form after data is fetched
          } else {
            this.errorMessage = 'University data not found';
          }
        },
        (error) => {
          this.errorMessage = 'Failed to load university data';
        }
      );
    }

  initializeForm() {
    this.updateProjectForm = this.fb.group({
      file: [null, Validators.required],
      projectTitle: ['', [Validators.required]],
      projectType: ['', [Validators.required]],
      softwares: ['', [Validators.required]],
      tags: ['', [Validators.required]],
      projectDescription: ['', [Validators.required]],
    });

    if (this.project && this.project.projectDetails) {
      this.updateProjectForm.patchValue({
        file: this.project.projectDetails.file.url || null,
        projectTitle: this.project.projectDetails.projectTitle,
        projectType: this.project.projectDetails.projectType,
        softwares: this.project.projectDetails.softwares,
        tags: this.project.projectDetails.tags,
        projectDescription: this.project.projectDetails.projectDescription,
      });

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
    }

    if (!this.isEditMode) {
      this.updateProjectForm.disable();
    }
  }



        // Custom Validator to ensure at least one tag is present
        softwaresValidator(control: AbstractControl): ValidationErrors | null {
          const softwares = control.value;
          return softwares && softwares.length > 0 ? null : { required: true };
        }

        onSoftwaresBlur() {
          const tags = this.updateProjectForm.get('softwares')?.value || [];

          // ✅ If user left input field empty & no tags exist, trigger validation
          if (tags.length === 0) {
            this.updateProjectForm.get('softwares')?.setErrors({ required: true });
          }

          this.updateProjectForm.get('softwares')?.markAsTouched();
          this.updateProjectForm.get('softwares')?.updateValueAndValidity();
        }

        addSoftware(value: string) {
        const chipValue = value.trim();
        const softwares = this.updateProjectForm.get('softwares')?.value || [];
        if (!softwares.includes(chipValue)) {
          softwares.push(chipValue);
          this.updateProjectForm.get('softwares')?.setValue([...softwares]); // ✅ Spread operator to ensure Angular detects changes
        }

        this.updateProjectForm.get('softwares')?.markAsTouched();
        this.updateProjectForm.get('softwares')?.updateValueAndValidity();
      }

      removeSoftware(index: number) {
        const softwares = [...(this.updateProjectForm.get('softwares')?.value || [])];
        softwares.splice(index, 1);
        this.updateProjectForm.get('softwares')?.setValue([...softwares]); // ✅ Spread to force update
        if (softwares.length === 0) {
          this.updateProjectForm.get('softwares')?.setErrors({ required: true });
        }
        this.updateProjectForm.get('softwares')?.markAsTouched();
        this.updateProjectForm.get('softwares')?.updateValueAndValidity();
      }




      // Custom Validator to ensure at least one tag is present
      tagsValidator(control: AbstractControl): ValidationErrors | null {
        const tags = control.value;
        return tags && tags.length > 0 ? null : { required: true };
      }

      onTagsBlur() {
        const tags = this.updateProjectForm.get('tags')?.value || [];

        // ✅ If user left input field empty & no tags exist, trigger validation
        if (tags.length === 0) {
          this.updateProjectForm.get('tags')?.setErrors({ required: true });
        }

        this.updateProjectForm.get('tags')?.markAsTouched();
        this.updateProjectForm.get('tags')?.updateValueAndValidity();
      }

    addTag(value: string) {
      const chipValue = value.trim();
      const tags = this.updateProjectForm.get('tags')?.value || [];
      if (!tags.includes(chipValue)) {
        tags.push(chipValue);
        this.updateProjectForm.get('tags')?.setValue([...tags]); // ✅ Spread operator to ensure Angular detects changes
      }

      this.updateProjectForm.get('tags')?.markAsTouched();
      this.updateProjectForm.get('tags')?.updateValueAndValidity();
    }

    removeTag(index: number) {
      const tags = [...(this.updateProjectForm.get('tags')?.value || [])];
      tags.splice(index, 1);

      this.updateProjectForm.get('tags')?.setValue([...tags]); // ✅ Spread to force update

      if (tags.length === 0) {
        this.updateProjectForm.get('tags')?.setErrors({ required: true });
      }

      this.updateProjectForm.get('tags')?.markAsTouched();
      this.updateProjectForm.get('tags')?.updateValueAndValidity();
    }


  get projectDescriptionControl(): FormControl {
    return this.updateProjectForm.get('projectDescription') as FormControl;
  }

  goBack(): void {
    this.router.navigateByUrl('talent-page/seeker/manage-project');
  }

  openEditMode(): void {
    if (this.projectActive) {
      this.isEditMode = true;
      this.updateProjectForm.enable();
    } else {
      this.errorMessage = 'Project is closed, unable to edit.';
      this.updateProjectForm.disable();
    }
  }

  discardChanges(): void {
    this.updateProjectForm.patchValue({
      file: this.project?.projectDetails?.file?.url || null,
      projectTitle: this.project?.projectDetails?.projectTitle,
      projectType: this.project?.projectDetails?.projectType,
      softwares: this.project?.projectDetails?.softwares,
      tags: this.project?.projectDetails?.tags,
      projectDescription: this.project?.projectDetails?.projectDescription,
    });

    this.updateProjectForm.disable();
    this.isEditMode = false;
    this.previewURL = null;
    this.fileType = null;
    this.ifFetched = true;
  }

  resetForm() {
    this.updateProjectForm.patchValue({
      file: this.project?.projectDetails?.file?.url || null,
      projectTitle:this.project?.projectDetails?.projectTitle,
      projectType: this.project?.projectDetails?.projectType,
      softwares: this.project?.projectDetails?.softwares,
      tags: this.project?.projectDetails?.tags,
      projectDescription: this.project?.projectDetails?.projectDescription,
    });

    this.updateProjectForm.disable();
    this.isEditMode = false;
    this.previewURL = null;
    this.fileType = null;
    this.ifFetched = true;
  }

  updateProject() {
    if (this.updateProjectForm.valid) {
      // Ensure file is uploaded
      console.log('Form Data:', this.updateProjectForm.value); // Debugging
      const projectUploadData: ProjectUpload = {
        projectDetails: {
          ...this.updateProjectForm.value,
          file: this.uploadedFileData
            ? this.uploadedFileData
            : this.project.projectDetails.file, // ✅ Keep old logo if no new upload
        },
      };

      this.isUpdating = true;
      this.projectService
        .updateProjectById(this.seekerId, this.projectId, projectUploadData)
        .subscribe({
          next: () => {
            this.resetState(), console.log('Project updated successfully!');
            this.updateProjectForm.reset();
            this.uploadedFileData = null;
            this.isUpdating = false;
            this.previewURL = null;
            this.ifPreview = false;
            this.uploadComplete = false;
            this.fileUploadProgress = undefined;
            this.router.navigateByUrl('talent-page/seeker/manage-project');

          },
          error: (err) => {
            console.error('Error submitting company:', err);
            this.errorMessage = 'Submission failed. Please try again.';
            this.isUpdating = false;
          },
        });
    } else {
      console.error('Form is invalid:', this.updateProjectForm.errors);
      this.errorMessage = 'Please fill all required fields correctly.';
    }
  }

  resetState(): void {
    this.previewURL = null;
    this.ifPreview = false;
    this.isEditMode = false;
    this.uploadedFileData = null;
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


  onFileChange(event: any, filePath: string): void {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const newFilePath = `${Folder.Main_Folder}/${Folder.Seeker_Folder}/${Folder.Seeker_Sub_Folder_2}/${file.name}`;
    const newFileRef = this.storage.ref(newFilePath);

    if (filePath) {
      console.log("Deleting old file:", filePath);

      this.deleteprojectFile(filePath).subscribe({
        next: () => {
          console.log("Old file deleted successfully. Proceeding with new file upload.");
          this.uploadNewFile(newFilePath, newFileRef, file);
        },
        error: (error) => {
          console.error("Error deleting old file. New file upload aborted.", error);
          return;
        }
      });
    } else {
      // If no old file, directly upload the new file
      this.uploadNewFile(newFilePath, newFileRef, file);
    }
  }

    uploadNewFile(filePath: string, fileRef: any, file: File) {
      const task = this.storage.upload(filePath, file);
      this.fileUploadProgress = task.percentageChanges();
      this.ifPreview = true;

      // Show file preview
      this.previewURL = this.domSanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));
      this.fileType = this.getFileType(file);

      task.snapshotChanges().subscribe({
        next: (snapshot) => {
          if (snapshot?.state === 'success') {
            fileRef.getDownloadURL().subscribe((url: string) => {
              console.log('New file uploaded successfully. URL:', url);
              this.uploadedFileData = { fileName: file.name, url: `${url}?t=${new Date().getTime()}`, filePath: filePath };
              this.uploadComplete = true;
            });
          }
        },
        error: (error) => {
          console.error('Upload error:', error);
          this.errorMessage = 'File upload failed. Please try again.';
        }
      });
    }

    deleteprojectFile(filePath: string): Observable<void> {
      if (!filePath) {
        console.error("No file path provided for deletion.");
        return throwError(() => new Error("No file path provided for deletion."));
      }
      const correctedFilePath = `${Folder.Main_Folder}/${Folder.Seeker_Folder}/${Folder.Seeker_Sub_Folder_2}/${filePath}`;
      return this.storage.ref(correctedFilePath).delete();
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
