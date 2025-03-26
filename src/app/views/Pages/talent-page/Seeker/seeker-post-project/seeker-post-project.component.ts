import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ProjectUpload } from 'src/app/core/models/project-upload.model';
import { ProjectUploadService } from 'src/app/core/services/projectUpload.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Folder } from 'src/app/core/enums/folder-name.enum';
import { DEFAULT_TOOLBAR, Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-seeker-post-project',
  templateUrl: './seeker-post-project.component.html',
  styleUrls: ['./seeker-post-project.component.css']
})
export class SeekerPostProjectPageComponent implements OnInit, OnDestroy {
  projectUploadForm!: FormGroup;
  isSubmitting = false;
  isLoading = false;
  jobCreated = false;
  errorMessage = '';
  ifPreview = false;
  uploadedFileData: { fileName: string; url: string; filePath: string } | null = null;
  // previewURL: string | null = null; // For the image preview
  previewURL: SafeResourceUrl | null = null;
  fileRef: any; // Firebase reference for file deletion
  fileType: string | null = null; // Store the file type (image, video, pdf, audio, etc.)
  fileUploadProgress: Observable<number | undefined> | undefined;
  uploadComplete = false;
  public editor!: Editor;
  toolbar: Toolbar = DEFAULT_TOOLBAR;

  constructor(
    private fb: FormBuilder,
    private storage: AngularFireStorage,
    private projectUploadService: ProjectUploadService,
    private router: Router,
    private domSanitizer: DomSanitizer
  ) {}


  goBack(){
    this.router.navigate(['portfolio']);
  }


  ngOnInit(): void {
    this.initializeForm();
    this.editor = new Editor();
  }


  ngOnDestroy(): void {
    this.editor.destroy();
  }

  initializeForm() {
    this.projectUploadForm = this.fb.group({
      _id: [null],
      file: [null, [Validators.required]], // File field
      projectTitle: ['', [Validators.required]],
      projectType: ['', [Validators.required]],
      softwares: [[], [this.tagsValidator]],
      tags: [[], [this.tagsValidator]], // ✅ Ensure tags is an array
      projectDescription: ['', [Validators.required]]
    });
  }

      // Custom Validator to ensure at least one tag is present
      softwaresValidator(control: AbstractControl): ValidationErrors | null {
        const softwares = control.value;
        return softwares && softwares.length > 0 ? null : { required: true };
      }

      onSoftwaresBlur() {
        const tags = this.projectUploadForm.get('softwares')?.value || [];

        // ✅ If user left input field empty & no tags exist, trigger validation
        if (tags.length === 0) {
          this.projectUploadForm.get('softwares')?.setErrors({ required: true });
        }

        this.projectUploadForm.get('softwares')?.markAsTouched();
        this.projectUploadForm.get('softwares')?.updateValueAndValidity();
      }

      addSoftware(value: string) {
      const chipValue = value.trim();
      const softwares = this.projectUploadForm.get('softwares')?.value || [];
      if (!softwares.includes(chipValue)) {
        softwares.push(chipValue);
        this.projectUploadForm.get('softwares')?.setValue([...softwares]); // ✅ Spread operator to ensure Angular detects changes
      }

      this.projectUploadForm.get('softwares')?.markAsTouched();
      this.projectUploadForm.get('softwares')?.updateValueAndValidity();
    }

    removeSoftware(index: number) {
      const softwares = [...(this.projectUploadForm.get('softwares')?.value || [])];
      softwares.splice(index, 1);
      this.projectUploadForm.get('softwares')?.setValue([...softwares]); // ✅ Spread to force update
      if (softwares.length === 0) {
        this.projectUploadForm.get('softwares')?.setErrors({ required: true });
      }
      this.projectUploadForm.get('softwares')?.markAsTouched();
      this.projectUploadForm.get('softwares')?.updateValueAndValidity();
    }




    // Custom Validator to ensure at least one tag is present
    tagsValidator(control: AbstractControl): ValidationErrors | null {
      const tags = control.value;
      return tags && tags.length > 0 ? null : { required: true };
    }

    onTagsBlur() {
      const tags = this.projectUploadForm.get('tags')?.value || [];

      // ✅ If user left input field empty & no tags exist, trigger validation
      if (tags.length === 0) {
        this.projectUploadForm.get('tags')?.setErrors({ required: true });
      }

      this.projectUploadForm.get('tags')?.markAsTouched();
      this.projectUploadForm.get('tags')?.updateValueAndValidity();
    }

  addTag(value: string) {
    const chipValue = value.trim();
    const tags = this.projectUploadForm.get('tags')?.value || [];
    if (!tags.includes(chipValue)) {
      tags.push(chipValue);
      this.projectUploadForm.get('tags')?.setValue([...tags]); // ✅ Spread operator to ensure Angular detects changes
    }

    this.projectUploadForm.get('tags')?.markAsTouched();
    this.projectUploadForm.get('tags')?.updateValueAndValidity();
  }

  removeTag(index: number) {
    const tags = [...(this.projectUploadForm.get('tags')?.value || [])];
    tags.splice(index, 1);

    this.projectUploadForm.get('tags')?.setValue([...tags]); // ✅ Spread to force update

    if (tags.length === 0) {
      this.projectUploadForm.get('tags')?.setErrors({ required: true });
    }

    this.projectUploadForm.get('tags')?.markAsTouched();
    this.projectUploadForm.get('tags')?.updateValueAndValidity();
  }


  uploadFile(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const filePath = `${Folder.Main_Folder}/${Folder.Seeker_Folder}/${Folder.Seeker_Sub_Folder_2}/${file.name}`;

      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, file);
      // this.previewURL = URL.createObjectURL(file);
      this.previewURL = this.domSanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));

      this.fileType = this.getFileType(file);

      this.fileUploadProgress = task.percentageChanges();
      this.ifPreview = true;

      task.snapshotChanges().subscribe({
        next: (snapshot) => {
          if (snapshot?.state === 'success') {
            fileRef.getDownloadURL().subscribe((url) => {
              console.log('File uploaded successfully. URL:', url);

              // Store the file details for later submission
              this.uploadedFileData = {
                fileName: file.name,
                url: url,
                filePath: filePath // Save the file path for deletion
              };
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

  }



  deletePreview(): void {
    this.previewURL = null;
    this.fileType = null;
    this.fileUploadProgress = undefined;
    this.uploadComplete =false;

    if (this.uploadedFileData) {
      const { filePath } = this.uploadedFileData;

      this.storage.ref(filePath).delete().subscribe({
        next: () => {
          console.log('File deleted from Firebase Storage');
          this.uploadedFileData = null;
          this.ifPreview = false;
        },
        error: (error) => {
          console.error('Error deleting file from Firebase Storage:', error);
          this.errorMessage = 'Failed to delete the file. Please try again.';
        }
      });
    }
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
      return 'unknown'; // For other file types (could be handled further)
    }
  }

  submitProject() {
    if (this.projectUploadForm.valid && this.uploadedFileData) {
      const projectData :ProjectUpload = {
        projectDetails: {
        ...this.projectUploadForm.value,
        file: this.uploadedFileData
        }
      };

      this.isSubmitting = true;
      this.projectUploadService.createProjectUpload(projectData).subscribe({
        next: () => {
          this.projectUploadForm.reset({
            projectType : ''
          });
          this.uploadedFileData = null;
          this.isSubmitting = false;
          this.previewURL = null;
          this.ifPreview = false;
          this.uploadComplete= false;
          this.fileUploadProgress = undefined;

        },
        error: (err) => {
          console.error('Error submitting project:', err);
          this.errorMessage = 'Project submission failed. Please try again.';
          this.isSubmitting = false;
        }
      });
    }
  }

  confirmDiscard() {
    if (confirm("Are you sure you want to discard the changes?")) {
      this.discard();
    }
  }

  // Reset the form and uploaded data
  discard() {
    this.projectUploadForm.reset();
    this.uploadedFileData = null;
    this.previewURL = null;
  }
}
