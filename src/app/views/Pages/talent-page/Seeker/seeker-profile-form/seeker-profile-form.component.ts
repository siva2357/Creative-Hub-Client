import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/core/services/admin.service';
import { ProfileService } from 'src/app/core/services/profile-service';
import { UserService } from 'src/app/core/services/user-service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DEFAULT_TOOLBAR, Editor, Toolbar } from 'ngx-editor';
import { University } from 'src/app/core/models/university.model';
import { SeekerProfile } from 'src/app/core/models/profile-details.model';
import { Observable } from 'rxjs';
import { Folder } from 'src/app/core/enums/folder-name.enum';
import { Seeker } from 'src/app/core/models/user.model';

@Component({
  selector: 'app-seeker-profile-form',
  templateUrl: './seeker-profile-form.component.html',
  styleUrls: ['./seeker-profile-form.component.css']
})

export class SeekerProfileFormComponent implements OnInit, OnDestroy{
  profileDetailsForm!: FormGroup;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;
  successMessage: string = '';
  seekerId!: string;
  public profileDetails! :Seeker;
  public universityList! :University[];


  ifPreview = false;
  uploadedFileData: { fileName: string; url: string; filePath: string } | null = null;
  previewURL: SafeResourceUrl | null = null;
  fileRef: any;
  fileType: string | null = null;
  uploadComplete = false;
  fileUploadProgress: Observable<number | undefined> | undefined;


  public editor!: Editor;
  toolbar: Toolbar = DEFAULT_TOOLBAR;

  constructor( private fb: FormBuilder,
      private authService: AuthService,
      private router: Router,
      private profileService:ProfileService,
      private userService:UserService,
      private adminService:AdminService,
      private storage: AngularFireStorage,  // CRUD Service
      private domSanitizer: DomSanitizer)
      {}

  ngOnInit() {
    // Get the userId and role from localStorage or AuthService
    this.seekerId = localStorage.getItem('userId')|| '';
    const role = localStorage.getItem('userRole') ||  '';

    console.log("User ID:", this.seekerId);
    console.log("User Role:", role); // Log the user role for debugging

    if (this.seekerId && role) {
        this.loadSeekerProfile();
      }else {
        this.errorMessage = 'User ID or Role is not available.';
      }
      this.initializeForm();
      this.loadUniversities(); // Fetch companies on init
      this.editor = new Editor();
    }

ngOnDestroy(): void {
this.editor.destroy();
}


  initializeForm() {
    this.profileDetailsForm = this.fb.group({
      _id: [null],
      firstName:  ['', Validators.required],
      lastName:  ['', Validators.required],
      userName:  ['', Validators.required],
      email: [{ value: '', disabled: true }],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      phoneNumber: ['', [Validators.required]],
      streetAddress: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      pincode: ['', [Validators.required]],
      universityName: ['', Validators.required],
      universityDegree: ['', Validators.required],
      yearOfGraduation: ['', [Validators.required]],
      universityNumber: ['', Validators.required],
      bioDescription: ['', [Validators.required]],
      profilePicture: [null, Validators.required] // Consider handling file upload separately
    });
  }


  loadSeekerProfile() {
      this.isLoading = true;
      this.userService.getSeekerById(this.seekerId).subscribe(
        (data:Seeker) => {
          console.log('Recruiter profile details:', data);
          if (data) {
            this.profileDetails = data;
            this.profileDetailsForm.patchValue({
              email: data.registrationDetails?.email || '',
            });
          } else {
            this.errorMessage = 'No profile data found';
          }
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching profile data', error);
          this.errorMessage = 'Error fetching profile details.';
          this.isLoading = false;
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




      onFileChange(event: any): void {
        const file = event.target.files && event.target.files[0];
        if (file) {
          const filePath = `${Folder.Main_Folder}/${Folder.Seeker_Folder}/${Folder.Seeker_Sub_Folder_1}/${file.name}`;
          const fileRef = this.storage.ref(filePath);
          const task = this.storage.upload(filePath, file);
          this.previewURL = this.domSanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));
          this.fileType = this.getFileType(file);
          this.fileUploadProgress = task.percentageChanges();
          this.ifPreview = true;

          task.snapshotChanges().subscribe({
            next: (snapshot) => {
              if (snapshot?.state === 'success') {
                fileRef.getDownloadURL().subscribe((url) => {
                  console.log('File uploaded successfully. URL:', url);
                  this.uploadedFileData = { fileName: file.name, url: url, filePath: filePath };
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



      submitProfile() {
        if (this.profileDetailsForm.invalid) {
            console.log("Form is invalid:", this.profileDetailsForm.value);
            this.errorMessage = 'Please fill in all required fields correctly.';
            return;
        }

        // Construct the profile data correctly
        const profileData: SeekerProfile = {
            profileDetails: {
                    firstName: this.profileDetailsForm.value.firstName,
                    lastName: this.profileDetailsForm.value.lastName,
                    userName: this.profileDetailsForm.value.userName,
                    email: this.profileDetailsForm.value.email,
                    gender: this.profileDetailsForm.value.gender,
                    dateOfBirth: this.profileDetailsForm.value.dateOfBirth,
                    phoneNumber: this.profileDetailsForm.value.phoneNumber,
                    streetAddress: this.profileDetailsForm.value.streetAddress,
                    city: this.profileDetailsForm.value.city,
                    state: this.profileDetailsForm.value.state,
                    country: this.profileDetailsForm.value.country,
                    pincode: this.profileDetailsForm.value.pincode,
                    universityName: this.profileDetailsForm.value.universityName,
                    universityDegree: this.profileDetailsForm.value. universityDegree,
                    yearOfGraduation: this.profileDetailsForm.value.yearOfGraduation,
                    universityNumber: this.profileDetailsForm.value.universityNumber,
                    bioDescription: this.profileDetailsForm.value.bioDescription,
                profilePicture: this.uploadedFileData || { fileName: '', url: ''}, // Provide a default value when null
              }
        };

        this.isSubmitting = true;
        this.successMessage = '';
        this.errorMessage = '';

        this.profileService.postSeekerProfile(profileData).subscribe({
            next: () => {
                this.profileDetailsForm.reset();
                this.uploadedFileData = null;
                this.isSubmitting = false;
                this.previewURL = null;
                this.ifPreview = false;
                this.uploadComplete = false;
                this.fileUploadProgress = undefined;
                this.router.navigate(['talent-page/seeker']);
            },
            error: (error) => {
                console.error('Error updating profile', error);
                this.errorMessage = 'Failed to update profile. Please try again.';
                this.isSubmitting = false;
            }
        });
    }

    confirmDiscard() {
      if (confirm("Are you sure you want to discard the changes?")) {
        this.discard();
      }
    }

    // Reset the form and uploaded data
    discard() {
      this.profileDetailsForm.reset();
      this.uploadedFileData = null;
      this.previewURL = null;
    }

}
