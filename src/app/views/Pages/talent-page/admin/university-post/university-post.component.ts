import { Component, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/core/services/admin.service';
import { Folder } from 'src/app/core/enums/folder-name.enum';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { University } from 'src/app/core/models/university.model';
import { DEFAULT_TOOLBAR, Editor, Toolbar } from 'ngx-editor';
import { AlertService } from 'src/app/core/services/alerts.service';


@Component({
  selector: 'app-university-post',
  templateUrl: './university-post.component.html',
  styleUrls: ['./university-post.component.css']
})
export class UniversityPostComponent implements OnInit,  OnDestroy {

  public editor!: Editor;
  toolbar: Toolbar = DEFAULT_TOOLBAR;

  universityPostForm!: FormGroup;
  uploading: boolean = false; // Track upload state
  fileUploadProgress: Observable<number | undefined> | undefined;
  isSubmitting = false;
  isLoading = false;
  ifPreview = false;
  uploadedFileData: { fileName: string; url: string; filePath: string } | null = null;
  previewURL: SafeResourceUrl | null = null;
  fileRef: any;
  fileType: string | null = null;
  uploadComplete = false;
  errorMessage = '';


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private adminService: AdminService,
    private storage: AngularFireStorage,  // CRUD Service
    private domSanitizer: DomSanitizer,
    private alert:AlertService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }

  initializeForm() {
    this.universityPostForm = this.fb.group({
      _id: [null],
      universityLogo: [null, Validators.required],  // Important: Set default as null
      universityId: ['', Validators.required],
      universityName: ['', Validators.required],
      universityAddress: ['', Validators.required],
    });
  }



  uploadFile(event: any) {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const filePath = `${Folder.Main_Folder}/${Folder.Admin_Folder}/${Folder.Admin_Sub_Folder_2}/${file.name}`;

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



  // **Submit University**
  submitUniversity() {
    if (this.universityPostForm.valid) {  // Ensure file is uploaded
      console.log("Form Data:", this.universityPostForm.value); // Debugging
      const universityData :University = {
        universityDetails: {
          ...this.universityPostForm.value, // Will be optional on the backend
          universityLogo: this.uploadedFileData
        },

      };

      this.isSubmitting = true;
      this.adminService.createUniversity(universityData).subscribe({
        next: () => {
          setTimeout(() => {
            this.isLoading = false;
            this.alert.showUniversityCreatedSuccess();
          console.log("University submitted successfully!");
          this.universityPostForm.reset();
          this.uploadedFileData = null;
          this.isSubmitting = false;
          this.previewURL = null;
          this.ifPreview = false;
          this.uploadComplete = false;
          this.fileUploadProgress = undefined;
          this.router.navigateByUrl('talent-page/admin/university');
        }, 2000);
        },
        error: (err) => {
          console.error("Error submitting university:", err);
          this.errorMessage = "Submission failed. Please try again.";
          this.isSubmitting = false;
        }
      });
    } else {
      console.error("Form is invalid:", this.universityPostForm.errors);
      this.errorMessage = "Please fill all required fields correctly.";
    }
  }



  // **Navigate to University Details with ID**
  goToUniversityPage(): void {
    this.router.navigateByUrl('talent-page/admin/university');
  }


  confirmDiscard() {
    if (confirm("Are you sure you want to discard the changes?")) {
      this.discard();
    }
  }

  // Reset the form and uploaded data
  discard() {
    this.universityPostForm.reset();
    this.uploadedFileData = null;
    this.previewURL = null;
  }

  resetForm() {
    this.universityPostForm.reset();
    this.uploadedFileData = null;
    this.previewURL = null;
    this.ifPreview = false;
    this.uploadComplete = false;
    this.fileUploadProgress = undefined;
    this.isSubmitting = false;
  }

}
