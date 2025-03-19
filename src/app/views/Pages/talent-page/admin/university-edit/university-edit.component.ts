import { University } from './../../../../../core/models/university.model';
import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AdminService } from 'src/app/core/services/admin.service';
import { Folder } from 'src/app/core/enums/folder-name.enum';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable, throwError } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-university-edit',
  templateUrl: './university-edit.component.html',
  styleUrls: ['./university-edit.component.css']
})
export class UniversityEditComponent  implements OnInit  {
  public university!: University;


  universityUpdateForm!: FormGroup;
  isEditMode: boolean = false;

  uploading: boolean = false; // Track upload state
  fileUploadProgress: Observable<number | undefined> | undefined;
  isUpdating = false;
  isLoading = false;
  ifPreview = false;
  uploadedFileData: { fileName: string; url: string; filePath: string } | null = null;
  previewURL: SafeResourceUrl | null = null;
  fetchedURL: string | null = null;
  ifFetched: boolean = false;
  universityActive: boolean = true;

  fileRef: any;
  fileType: string | null = null;
  uploadComplete = false;
  errorMessage = '';
  universityId!: string;



  constructor(
    private fb: FormBuilder,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private storage: AngularFireStorage,  // CRUD Service
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {

    this.initializeForm();

    this.activatedRouter.paramMap.subscribe((param) => {
      this.universityId = param.get('id')!;
      console.log('University ID:', this.universityId);

      if (this.universityId) {
        this.fetchUniversityData(); // Call API only after ID is fetched
      }
    });



  }





  fetchUniversityData() {
    this.adminService.getUniversityById(this.universityId).subscribe(
      (universityData: University) => {
        if (universityData) {
          this.university = universityData;
          this.initializeForm();
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
    this.universityUpdateForm = this.fb.group({
      universityLogo: [null, Validators.required], // Default null
      universityId: ['', [Validators.required]],
      universityName: ['', [Validators.required]],
      universityAddress: ['', [Validators.required]],
    });

    if (this.university && this.university.universityDetails) {
      this.universityUpdateForm.patchValue({
        universityLogo: this.university.universityDetails.universityLogo.url || null,
        universityId: this.university.universityDetails.universityId || '',
        universityName: this.university.universityDetails.universityName  || '',
        universityAddress: this.university.universityDetails.universityAddress  || ''

      });

      if (this.university.universityDetails.universityLogo?.url) {
        this.fetchedURL = this.university.universityDetails.universityLogo.url;
        this.ifFetched = true;
      }
    }

    if (!this.isEditMode) {
      this.universityUpdateForm.disable();
    }
  }

  openEditMode(): void {
    if (this.universityActive) {
      this.isEditMode = true;
      this.universityUpdateForm.enable();
    } else {
      this.errorMessage = 'Project is closed, unable to edit.';
      this.universityUpdateForm.disable();
    }
  }
  discardChanges(): void {
    this.universityUpdateForm.patchValue({
        universityLogo: this.university?.universityDetails?.universityLogo?.url || '',
        universityId: this.university?.universityDetails?.universityId,
        universityName: this.university?.universityDetails?.universityName,
        universityAddress: this.university?.universityDetails?. universityAddress

    });

    this.universityUpdateForm.disable();
    this.isEditMode = false;
    this.previewURL = null;
    this.fileType = null;
    this.ifFetched = true;
}



onFileChange(event: any, filePath: string): void {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const newFilePath = `${Folder.Main_Folder}/${Folder.Admin_Folder}/${Folder.Admin_Sub_Folder_2}/${file.name}`;
  const newFileRef = this.storage.ref(newFilePath);

  if (filePath) {
    console.log("Deleting old file:", filePath);

    this.deleteUniversityLogo(filePath).subscribe({
      next: () => {
        console.log("Old file deleted successfully. Proceeding with new file upload.");
        this.uploadNewFile(newFilePath, newFileRef, file); // ✅ Upload only after successful deletion
      },
      error: (error) => {
        console.error("Error deleting old file. New file upload aborted.", error);
        return; // ❌ Stop execution if deletion fails
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

  deleteUniversityLogo(filePath: string): Observable<void> {
    if (!filePath) {
      console.error("No file path provided for deletion.");
      return throwError(() => new Error("No file path provided for deletion."));
    }

    const correctedFilePath = `${Folder.Main_Folder}/${Folder.Admin_Folder}/${Folder.Admin_Sub_Folder_2}/${filePath}`;
    return this.storage.ref(correctedFilePath).delete();
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
  updateUniversity() {
    if (this.universityUpdateForm.valid) {  // Ensure file is uploaded
      console.log("Form Data:", this.universityUpdateForm.value); // Debugging
      const universityData: University = {
        universityDetails: {
          ...this.universityUpdateForm.value,
          universityLogo: this.uploadedFileData ? this.uploadedFileData : this.university.universityDetails.universityLogo, // ✅ Keep old logo if no new upload
        },
      };

      this.isUpdating = true;
      this.adminService.updateUniversityById(this.universityId,universityData).subscribe({
        next: () => {
          this.resetState(),
          console.log("University submitted successfully!");
          this.universityUpdateForm.reset();
          this.uploadedFileData = null;
          this.isUpdating = false;
          this.previewURL = null;
          this.ifPreview = false;
          this.uploadComplete = false;
          this.fileUploadProgress = undefined;
          this.router.navigateByUrl('talent-page/admin/university');

        },
        error: (err) => {
          console.error("Error submitting university:", err);
          this.errorMessage = "Submission failed. Please try again.";
          this.isUpdating = false;
        }
      });
    } else {
      console.error("Form is invalid:", this.universityUpdateForm.errors);
      this.errorMessage = "Please fill all required fields correctly.";
    }
  }

  resetState(): void {
    this.previewURL = null;
    this.ifPreview = false;
    this.isEditMode = false;
    this.uploadedFileData = null;
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
    this.universityUpdateForm.reset();
    this.uploadedFileData = null;
    this.previewURL = null;
  }

  resetForm() {
    this.universityUpdateForm.patchValue({
      universityLogo: this.university?.universityDetails?.universityLogo?.url || '',
      universityId: this.university?.universityDetails?.universityId,
      universityName: this.university?.universityDetails?.universityName
    });

    this.uploadedFileData = null;
    this.previewURL = null;
    this.ifPreview = false;
    this.uploadComplete = false;
    this.isUpdating = false;
  }


}
