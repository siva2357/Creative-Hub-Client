import { Company } from 'src/app/core/models/company.model';
import { Component, Input,  OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AdminService } from 'src/app/core/services/admin.service';
import { Folder } from 'src/app/core/enums/folder-name.enum';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable, throwError } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AlertService } from 'src/app/core/services/alerts.service';

@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.css']
})
export class CompanyEditComponent  implements OnInit  {
  public company!: Company;

  companyUpdateForm!: FormGroup;
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
  companyActive: boolean = true;

  fileRef: any;
  fileType: string | null = null;
  uploadComplete = false;
  errorMessage = '';
  companyId!: string;


  constructor(
    private fb: FormBuilder,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private storage: AngularFireStorage,  // CRUD Service
    private domSanitizer: DomSanitizer,
    private alert:AlertService
  ) {}

  ngOnInit(): void {

    this.initializeForm(); // Initialize form structure

    this.activatedRouter.paramMap.subscribe((param) => {
      this.companyId = param.get('id')!;
      console.log('Company ID:', this.companyId);

      if (this.companyId) {
        this.fetchCompanyData(); // Call API only after ID is fetched
      }
    });
  }


    fetchCompanyData() {
      this.adminService.getCompanyById(this.companyId).subscribe(
        (companyData: Company) => {
            if (companyData) {
              this.company= companyData;
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
    this.companyUpdateForm = this.fb.group({
      companyLogo: [null, Validators.required],
      companyId: ['', Validators.required],
      companyName: ['', Validators.required],
      companyAddress: ['', Validators.required],
    });

    if (this. company && this. company. companyDetails) {
      this.companyUpdateForm.patchValue({
        companyLogo: this.company.companyDetails.companyLogo.url || null,
        companyId: this.company.companyDetails.companyId || '',
        companyName: this.company.companyDetails.companyName || '',
        companyAddress: this.company.companyDetails.companyAddress || '',
      });
      console.log('Form Value After Patch:', this.companyUpdateForm.value);

      if (this.company.companyDetails.companyLogo?.url) {
        this.fetchedURL = this.company.companyDetails.companyLogo.url;
        this.ifFetched = true;
      }
    }

    if (!this.isEditMode) {
      this.companyUpdateForm.disable();
    }

  }




  openEditMode(): void {
    if (this.companyActive) {
      this.isEditMode = true;
      this.companyUpdateForm.enable();
    } else {
      this.errorMessage = 'Project is closed, unable to edit.';
      this.companyUpdateForm.disable();
    }
  }

  discardChanges(): void {
    this.companyUpdateForm.patchValue({
      companyLogo: this.company?.companyDetails?.companyLogo?.url || '',
      companyId: this.company?.companyDetails?.companyId,
      companyName: this.company?.companyDetails?.companyName,
      companyAddress: this.company?.companyDetails?.companyAddress,
    });

    this.companyUpdateForm.disable();
    this.isEditMode = false;
    this.previewURL = null;
    this.fileType = null;
    this.ifFetched = true;
}



onFileChange(event: any, filePath: string): void {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const newFilePath = `${Folder.Main_Folder}/${Folder.Admin_Folder}/${Folder.Admin_Sub_Folder_3}/${file.name}`;
  const newFileRef = this.storage.ref(newFilePath);

  if (filePath) {
    console.log("Deleting old file:", filePath);

    this.deleteCompanyLogo(filePath).subscribe({
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

  deleteCompanyLogo(filePath: string): Observable<void> {
    if (!filePath) {
      console.error("No file path provided for deletion.");
      return throwError(() => new Error("No file path provided for deletion."));
    }

    const correctedFilePath = `${Folder.Main_Folder}/${Folder.Admin_Folder}/${Folder.Admin_Sub_Folder_3}/${filePath}`;
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


  updateCompany() {
      if (this.companyUpdateForm.valid) {  // Ensure file is uploaded
        console.log("Form Data:", this.companyUpdateForm.value); // Debugging
        const companyData: Company = {
          companyDetails: {
            ...this.companyUpdateForm.value,
            companyLogo: this.uploadedFileData ? this.uploadedFileData : this.company.companyDetails.companyLogo, // ✅ Keep old logo if no new upload
          },
        };

        this.isUpdating = true;
        this.adminService.updateCompanyById(this.companyId,companyData).subscribe({
          next: () => {
            setTimeout(() => {
              this.isLoading = false;
              this.alert.showCompanyUpdatedSuccess();
            this.resetState(),
            console.log("University submitted successfully!");
            this.companyUpdateForm.reset();
            this.uploadedFileData = null;
            this.isUpdating = false;
            this.previewURL = null;
            this.ifPreview = false;
            this.uploadComplete = false;
            this.fileUploadProgress = undefined;
            this.router.navigateByUrl('talent-page/admin/company');
          }, 2000);
          },
          error: (err) => {
            console.error("Error submitting company:", err);
            this.errorMessage = "Submission failed. Please try again.";
            this.isUpdating = false;
          }
        });
      } else {
        console.error("Form is invalid:", this.companyUpdateForm.errors);
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
  goToCompanyPage(): void {
    this.router.navigateByUrl('talent-page/admin/company');
  }


  confirmDiscard() {
    if (confirm("Are you sure you want to discard the changes?")) {
      this.discard();
    }
  }

  // Reset the form and uploaded data
  discard() {
    this.companyUpdateForm.reset();
    this.uploadedFileData = null;
    this.previewURL = null;
  }

  resetForm() {
    this.companyUpdateForm.patchValue({
      companyLogo: this.company?.companyDetails?.companyLogo?.url || '',
      companyId: this.company?.companyDetails?.companyId,
      companyName: this.company?.companyDetails?.companyName,
      companyAddress: this.company?.companyDetails?.companyAddress,
    });

    this.uploadedFileData = null;
    this.previewURL = null;
    this.ifPreview = false;
    this.uploadComplete = false;
    this.isUpdating = false;
  }

}
