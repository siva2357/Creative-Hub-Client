import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RecruiterProfile } from 'src/app/core/models/profile-details.model';
import { Recruiter } from 'src/app/core/models/user.model';
import { AuthService } from 'src/app/core/services/auth.service';
import { ProfileService } from 'src/app/core/services/profile-service';
import { UserService } from 'src/app/core/services/user-service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { DEFAULT_TOOLBAR, Editor, Toolbar } from 'ngx-editor';
import { Folder } from 'src/app/core/enums/folder-name.enum';
import { AdminService } from 'src/app/core/services/admin.service';
import { Company } from 'src/app/core/models/company.model';
import { DESIGNATION } from 'src/app/core/enums/designation.enum';


@Component({
  selector: 'app-recruiter-profile-form',
  templateUrl: './recruiter-profile-form.component.html',
  styleUrls: ['./recruiter-profile-form.component.css']
})
export class RecruiterProfileFormComponent implements OnInit,OnDestroy {
  profileDetailsForm!: FormGroup;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  isLoading: boolean = false;
  successMessage: string = '';
  recruiterId!: string;
  public profileDetails! :Recruiter;
  public companyList! :Company[];
  public designations = Object.values(DESIGNATION); // Convert Enum to an array

  ifPreview = false;
  uploadedFileData: { fileName: string; url: string; filePath: string } | null = null;
  previewURL: SafeResourceUrl | null = null;
  fileRef: any;
  fileType: string | null = null;
  uploadComplete = false;
  fileUploadProgress: Observable<number | undefined> | undefined;


  public editor!: Editor;
  toolbar: Toolbar = DEFAULT_TOOLBAR;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private profileService:ProfileService,
    private userService:UserService,
    private adminService:AdminService,
    private storage: AngularFireStorage,  // CRUD Service
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit() {
        // Get the userId and role from localStorage or AuthService
        this.recruiterId = localStorage.getItem('userId') || this.authService.getUserId() || '';
        const role = localStorage.getItem('userRole') || this.authService.getRole() || '';

        console.log("User ID:", this.recruiterId);
        console.log("User Role:", role); // Log the user role for debugging

        if (this.recruiterId && role) {
            this.loadRecruiterProfile();
          }else {
            this.errorMessage = 'User ID or Role is not available.';
          }
          this.initializeForm();
          this.loadCompanies(); // Fetch companies on init
          this.editor = new Editor();
        }



  ngOnDestroy(): void {
    this.editor.destroy();
  }

  initializeForm() {
    this.profileDetailsForm = this.fb.group({
      _id: [null],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      phoneNumber: ['', [Validators.required]],
      streetAddress: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      country: ['', Validators.required],
      pincode: ['', [Validators.required]],
      companyName: ['', Validators.required],
      designation: ['', Validators.required],
      experience: ['', [Validators.required]],
      employeeCode: ['', Validators.required],
      bioDescription: ['', [Validators.required]],
      profilePicture: [null, Validators.required] // Consider handling file upload separately
    });
  }

  loadRecruiterProfile() {
    this.isLoading = true;
    this.userService.getRecruiterById(this.recruiterId).subscribe(
      (data:Recruiter) => {
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

  loadCompanies() {
    this.isLoading = true;
    this.adminService.getAllCompanies().subscribe(
      (data) => {
        console.log('company list:', data);
        if (data && data.companies) {
          this.companyList = data.companies; // Extract the companies array
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
        const filePath = `${Folder.Main_Folder}/${Folder.Recruiter_Folder}/${Folder.Recruiter_Sub_Folder_1}/${file.name}`;
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
      const profileData: RecruiterProfile = {
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
                  companyName: this.profileDetailsForm.value.companyName,
                  designation: this.profileDetailsForm.value.designation,
                  experience: this.profileDetailsForm.value.experience,
                  employeeCode: this.profileDetailsForm.value.employeeCode,
                  bioDescription: this.profileDetailsForm.value.bioDescription,
                  profilePicture: this.uploadedFileData || { fileName: '', url: ''}, // Provide a default value when null
            }
      };

      this.isSubmitting = true;
      this.successMessage = '';
      this.errorMessage = '';

      this.profileService.postRecruiterProfile(profileData).subscribe({
          next: () => {
              this.profileDetailsForm.reset();
              this.uploadedFileData = null;
              this.isSubmitting = false;
              this.previewURL = null;
              this.ifPreview = false;
              this.uploadComplete = false;
              this.fileUploadProgress = undefined;
              this.router.navigate(['talent-page/recruiter']);
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
