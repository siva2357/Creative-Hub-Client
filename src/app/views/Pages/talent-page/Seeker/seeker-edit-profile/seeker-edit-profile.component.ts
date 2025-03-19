import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/core/services/admin.service';
import { ProfileService } from 'src/app/core/services/profile-service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DEFAULT_TOOLBAR, Editor, Toolbar } from 'ngx-editor';
import { University } from 'src/app/core/models/university.model';
import { SeekerProfile } from 'src/app/core/models/profile-details.model';
import { Folder } from 'src/app/core/enums/folder-name.enum';
import { Observable, throwError } from 'rxjs';

@Component({
  selector: 'app-seeker-edit-profile',
  templateUrl: './seeker-edit-profile.component.html',
  styleUrls: ['./seeker-edit-profile.component.css'],
})
export class SeekerEditProfileComponent implements OnInit, OnDestroy {
  updateProfileForm!: FormGroup;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;
  successMessage: string = '';
  seekerId!: string;
  public profile!: SeekerProfile;
  public universityList!: University[];


  ifPreview: boolean = false;
  ifFetched: boolean = false;
  uploadedFileData: { fileName: string; url: string; filePath: string } | null = null;
  fetchedURL: string | null = null;
  previewURL: SafeResourceUrl | null = null;
  fileType: string | null = null;
  isUpdating = false;
  fileUploadProgress: Observable<number | undefined> | undefined;
  uploadComplete = false;
  fileRef: any;
  isEditMode: boolean = false;
  profileActive: boolean = true;


  public editor!: Editor;
  toolbar: Toolbar = DEFAULT_TOOLBAR;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private profileService: ProfileService,
    private adminService: AdminService,
    private storage: AngularFireStorage, // CRUD Service
    private domSanitizer: DomSanitizer,
    private activatedRouter: ActivatedRoute
  ) {}

  ngOnInit() {
    // Get the userId and role from localStorage or AuthService
    this.seekerId = localStorage.getItem('userId') || '';
    const role = localStorage.getItem('userRole') || '';

    console.log('User ID:', this.seekerId);
    console.log('User Role:', role);

    // Initialize the form first
    this.initializeForm();
    this.loadUniversities(); // Fetch companies on init
    this.editor = new Editor();

    if (this.seekerId && role) {
      // Now load the profile data, as the form is already built.
      this.loadSeekerProfile();
    } else {
      this.errorMessage = 'User ID or Role is not available.';
    }
  }


  ngOnDestroy(): void {
    this.editor.destroy();
  }



  initializeForm() {
    this.updateProfileForm = this.fb.group({
      _id: [null],
        firstName:  ['', Validators.required],
        lastName:  ['', Validators.required],
        userName:  ['', Validators.required],
        email: [{ value: '', disabled: true }],
        gender: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
        phoneNumber: ['', Validators.required],
        streetAddress: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        country: ['', Validators.required],
        pincode: ['', Validators.required],
        universityName: ['', Validators.required],
        universityDegree: ['', Validators.required],
        yearOfGraduation: ['', Validators.required],
        universityNumber: ['', Validators.required],
        bioDescription: ['', Validators.required],
       profilePicture: [null, Validators.required],
    });


    if (this.profile && this.profile.profileDetails) {
      this.updateProfileForm.patchValue({
          firstName: this.profile.profileDetails.firstName,
          lastName: this.profile.profileDetails.lastName,
          userName: this.profile.profileDetails.userName,
          email: this.profile.profileDetails.email || '',
          gender: this.profile.profileDetails.gender,
          dateOfBirth: [new Date(this.profile.profileDetails.dateOfBirth).toISOString().slice(0, 10)],
          phoneNumber:this.profile.profileDetails.phoneNumber,
          streetAddress: this.profile.profileDetails.streetAddress,
          city: this.profile.profileDetails.city,
          state: this.profile.profileDetails.state,
          country: this.profile.profileDetails.country,
          pincode: this.profile.profileDetails.pincode,
          universityName: this.profile.profileDetails.universityName,
          universityDegree: this.profile.profileDetails.universityDegree,
          yearOfGraduation: [new Date(this.profile.profileDetails.yearOfGraduation).toISOString().slice(0, 10) ],
          universityNumber: this.profile.profileDetails.universityNumber,
          bioDescription: this.profile.profileDetails.bioDescription,
        profilePicture: this.profile.profileDetails.profilePicture.url || null,
      });

      if (this.profile.profileDetails.profilePicture.url) {
        this.fetchedURL = this.profile.profileDetails.profilePicture.url;
        this.ifFetched = true;
          // Determine the file type based on the fileName extension
      const fileName = this.profile.profileDetails.profilePicture.fileName.toLowerCase();
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
      this.updateProfileForm.disable();
    }
  }

  get  bioDescriptionControl(): FormControl {
    return this.updateProfileForm.get('bioDescription') as FormControl;
  }


  loadSeekerProfile() {
    this.profileService.getSeekerProfileById(this.seekerId).subscribe(
      (data:SeekerProfile) => {
        console.log('Recruiter profile details:', data);
        if (data) {
          this.profile = data;
          this.initializeForm()
        } else {
          this.errorMessage = 'No profile data found';
        }
      },
      (error) => {
        console.error('Error fetching profile data', error);
        this.errorMessage = 'Error fetching profile details.';
      }
    );
  }


  loadUniversities() {
    this.isLoading = true;
    this.adminService.getAllUniversities().subscribe(
      (data) => {
        console.log('company list:', data);
        if (data && data.universities) {
          this.universityList = data.universities; // Extract the companies array
        } else {
          this.errorMessage = 'No companies found';
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching companies', error);
        this.errorMessage = 'Error fetching company details.';
        this.isLoading = false;
      }
    );

  }

  openEditMode(): void {
    if (this.profileActive) {
      this.isEditMode = true;
      this.updateProfileForm.enable();
    } else {
      this.errorMessage = 'Project is closed, unable to edit.';
      this.updateProfileForm.disable();
    }
  }

  discardChanges(): void {
    this.updateProfileForm.patchValue({
      firstName: this.profile.profileDetails.firstName,
      lastName: this.profile.profileDetails.lastName,
      userName: this.profile.profileDetails.userName,
      email: this.profile.profileDetails.email || '',
      gender: this.profile.profileDetails.gender,
      dateOfBirth: [new Date(this.profile.profileDetails.dateOfBirth).toISOString().slice(0, 10)],
      phoneNumber:this.profile.profileDetails.phoneNumber,
      streetAddress: this.profile.profileDetails.streetAddress,
      city: this.profile.profileDetails.city,
      state: this.profile.profileDetails.state,
      country: this.profile.profileDetails.country,
      pincode: this.profile.profileDetails.pincode,
      universityName: this.profile.profileDetails.universityName,
      universityDegree: this.profile.profileDetails.universityDegree,
      yearOfGraduation: [new Date(this.profile.profileDetails.yearOfGraduation).toISOString().slice(0, 10) ],
      universityNumber: this.profile.profileDetails.universityNumber,
      bioDescription: this.profile.profileDetails.bioDescription,
    profilePicture: this.profile.profileDetails.profilePicture.url || null,
  });

    this.updateProfileForm.disable();
    this.isEditMode = false;
    this.previewURL = null;
    this.fileType = null;
    this.ifFetched = true;
  }

  resetForm() {
    this.updateProfileForm.patchValue({
      firstName: this.profile.profileDetails.firstName,
      lastName: this.profile.profileDetails.lastName,
      userName: this.profile.profileDetails.userName,
      email: this.profile.profileDetails.email || '',
      gender: this.profile.profileDetails.gender,
      dateOfBirth: [new Date(this.profile.profileDetails.dateOfBirth).toISOString().slice(0, 10)],
      phoneNumber:this.profile.profileDetails.phoneNumber,
      streetAddress: this.profile.profileDetails.streetAddress,
      city: this.profile.profileDetails.city,
      state: this.profile.profileDetails.state,
      country: this.profile.profileDetails.country,
      pincode: this.profile.profileDetails.pincode,
      universityName: this.profile.profileDetails.universityName,
      universityDegree: this.profile.profileDetails.universityDegree,
      yearOfGraduation: [new Date(this.profile.profileDetails.yearOfGraduation).toISOString().slice(0, 10) ],
      universityNumber: this.profile.profileDetails.universityNumber,
      bioDescription: this.profile.profileDetails.bioDescription,
    profilePicture: this.profile.profileDetails.profilePicture.url || null,
  });


    this.updateProfileForm.disable();
    this.isEditMode = false;
    this.previewURL = null;
    this.fileType = null;
    this.ifFetched = true;
  }

  updateProfile() {
    if (this.updateProfileForm.valid) {
      // Use getRawValue() to include values from disabled controls.
      const formValue = this.updateProfileForm.getRawValue();
      console.log('Raw Form Data:', formValue);

      // Construct the updated profile data with the proper structure.
      const updatedProfileData: SeekerProfile = {
        profileDetails: {
          ...formValue, // This spreads all fields from your form (e.g., basicDetails, contactDetails, etc.)
          // Overwrite profilePicture with the newly uploaded file if available, or fallback to the existing one.
          profilePicture: this.uploadedFileData
            ? this.uploadedFileData
            : this.profile.profileDetails.profilePicture,
        },
      };

      this.isUpdating = true;
      this.profileService.updateSeekerProfile(this.seekerId, updatedProfileData).subscribe({
        next: () => {
          this.resetState();
          console.log('Profile updated successfully!');
          this.updateProfileForm.reset();
          this.uploadedFileData = null;
          this.isUpdating = false;
          this.previewURL = null;
          this.ifPreview = false;
          this.uploadComplete = false;
          this.fileUploadProgress = undefined;
          this.router.navigateByUrl('talent-page/seeker');
        },
        error: (err) => {
          console.error('Error updating profile:', err);
          this.errorMessage = 'Submission failed. Please try again.';
          this.isUpdating = false;
        },
      });
    } else {
      console.error('Form is invalid:', this.updateProfileForm.errors);
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

      const newFilePath = `${Folder.Main_Folder}/${Folder.Seeker_Folder}/${Folder.Seeker_Sub_Folder_1}/${file.name}`;
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

        const correctedFilePath = `${Folder.Main_Folder}/${Folder.Seeker_Folder}/${Folder.Seeker_Sub_Folder_1}/${filePath}`;

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

  goBack() {
    this.router.navigateByUrl('talent-page/seeker/profile');
  }
}
