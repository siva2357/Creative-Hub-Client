import { Component, Input, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DEFAULT_TOOLBAR, Editor, Toolbar } from 'ngx-editor';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { JobPost } from 'src/app/core/models/jobPost.model';
import { JobPostService } from 'src/app/core/services/jobPost.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { QUALIFICATION } from 'src/app/core/enums/qualification.enum';
import { EXPERIENCE } from 'src/app/core/enums/experience.enum';
import { SALARY } from 'src/app/core/enums/salary.enum';
import { JOBCATEGORY } from 'src/app/core/enums/job-category.enum';
import { JOBTYPE } from 'src/app/core/enums/job-type.enum';

@Component({
  selector: 'app-job-post-edit-form',
  templateUrl: './job-post-edit-form.component.html',
  styleUrls: ['./job-post-edit-form.component.css']
})
export class RecruiterEditJobPageComponent implements OnInit,  OnDestroy{

  public jobPost!: JobPost;
  editor!: Editor;
  toolbar: Toolbar = DEFAULT_TOOLBAR;
  jobPostUpdateForm!: FormGroup;
  isEditMode: boolean = false;

  isUpdating = false;
  isLoading = false;
  jobPostActive: boolean = true;
  errorMessage = '';
  jobId!: string;
  recruiterId!: string;

    public qualifications = Object.values(QUALIFICATION); // Convert Enum to an array
    public experience = Object.values(EXPERIENCE); // Convert Enum to an array
    public salaries = Object.values(SALARY); // Convert Enum to an array
    public jobType = Object.values(JOBTYPE); // Convert Enum to an array
    public jobCategories = Object.values(JOBCATEGORY); // Convert Enum to an array

  constructor(
    private fb: FormBuilder,
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private jobPostService: JobPostService,
      private authService: AuthService
  ) {}



  ngOnInit(): void {

     // Get the userId and role from localStorage or AuthService
     this.recruiterId = localStorage.getItem('userId') ||  '';
     const role = localStorage.getItem('userRole') || '';

     console.log("User ID:", this.recruiterId);
     console.log("User Role:", role); // Log the user role for debugging


    this.editor = new Editor();
    this.initializeForm();

    this.activatedRouter.paramMap.subscribe((param) => {
      this. jobId = param.get('id')!;
      console.log('Company ID:', this. jobId);

      if (this.jobId) {
        this.fetchJobpostData(); // Call API only after ID is fetched
      }
    });
  }

  ngOnDestroy(): void {
    this.editor.destroy();
}

fetchJobpostData() {
    this.jobPostService.getRecruiterJobPostById(this.recruiterId,  this.jobId).subscribe(
      (jobPostData: JobPost) => {
        if (jobPostData) {
          this.jobPost = jobPostData;
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
    this.jobPostUpdateForm = this.fb.group({
      _id: [null],
      jobId: ['', [Validators.required]],
      jobTitle: ['', [Validators.required]],
      jobCategory: ['', [Validators.required]],
      jobType: ['', [Validators.required]],
      experience: ['', [Validators.required]],
      salary: ['', [Validators.required]],
      vacancy: ['', [Validators.required]],
      location: ['', [Validators.required]],
      qualification: ['', [Validators.required]],
      applyByDate: ['', [Validators.required]],
      jobDescription: ['', [Validators.required]],
      });

      if (this.jobPost && this.jobPost.jobPostDetails) {
        this.jobPostUpdateForm.patchValue({
          jobId: this.jobPost.jobPostDetails.jobId,
          jobTitle: this.jobPost.jobPostDetails.jobTitle,
          jobType: this.jobPost.jobPostDetails.jobType,
          jobCategory: this.jobPost.jobPostDetails.jobCategory,
          experience: this.jobPost.jobPostDetails. experience,
          salary: this.jobPost.jobPostDetails.salary,
          vacancy: this.jobPost.jobPostDetails.vacancy,
          location: this.jobPost.jobPostDetails.location,
          qualification: this.jobPost.jobPostDetails.  qualification,
          applyByDate: [new Date(this.jobPost?.jobPostDetails?.applyByDate).toISOString().slice(0, 10)],
          jobDescription: this.jobPost.jobPostDetails.jobDescription,

        });
      }

      if (!this.isEditMode) {
        this.jobPostUpdateForm.disable();
      }
    }

    get jobDescriptionControl(): FormControl {
      return this.jobPostUpdateForm.get('jobDescription') as FormControl;
    }




  openEditMode(): void {
    if (this. jobPostActive) {
      this.isEditMode = true;
      this.jobPostUpdateForm.enable();
    } else {
      this.errorMessage = 'Project is closed, unable to edit.';
      this.jobPostUpdateForm.disable();
    }
  }

  discardChanges(): void {
    this.jobPostUpdateForm.patchValue({
      jobId: this.jobPost.jobPostDetails.jobId,
      jobTitle: this.jobPost.jobPostDetails.jobTitle,
      jobType: this.jobPost.jobPostDetails.jobType,
      jobCategory: this.jobPost.jobPostDetails.jobCategory,
      experience: this.jobPost.jobPostDetails. experience,
      salary: this.jobPost.jobPostDetails.salary,
      vacancy: this.jobPost.jobPostDetails.vacancy,
      location: this.jobPost.jobPostDetails.location,
      qualification: this.jobPost.jobPostDetails.  qualification,
      applyByDate: [new Date(this.jobPost.jobPostDetails.applyByDate).toISOString().slice(0, 10)],
      jobDescription: this.jobPost.jobPostDetails.jobDescription,
    });

    this.jobPostUpdateForm.disable();
    this.isEditMode = false;
}


  updateJobPost() {
      if (this.jobPostUpdateForm.valid) {  // Ensure file is uploaded
        console.log("Form Data:", this.jobPostUpdateForm.value); // Debugging
        const jobPostData: JobPost = {
         jobPostDetails: {
            ...this.jobPostUpdateForm.value,
          },
        };

        this.isUpdating = true;
        this.jobPostService.updateJobPostById(this.recruiterId,  this.jobId,jobPostData).subscribe({
          next: () => {
            this.resetState(),
            console.log("University submitted successfully!");
            this.jobPostUpdateForm.reset();
            this.isUpdating = false;
            this.router.navigateByUrl('talent-page/recruiter/manage-jobs');

          },
          error: (err) => {
            console.error("Error submitting company:", err);
            this.errorMessage = "Submission failed. Please try again.";
            this.isUpdating = false;
          }
        });
      } else {
        console.error("Form is invalid:", this.jobPostUpdateForm.errors);
        this.errorMessage = "Please fill all required fields correctly.";
      }
    }

  resetState(): void {
    this.isEditMode = false;
  }


  // **Navigate to University Details with ID**
  goToJobpostPage(): void {
    this.router.navigateByUrl('talent-page/recruiter/manage-jobs');
  }


  confirmDiscard() {
    if (confirm("Are you sure you want to discard the changes?")) {
      this.discard();
    }
  }

  // Reset the form and uploaded data
  discard() {
    this.jobPostUpdateForm.reset();
  }

  resetForm() {
    this.jobPostUpdateForm.patchValue({
      jobId: this.jobPost.jobPostDetails.jobId,
      jobTitle: this.jobPost.jobPostDetails.jobTitle,
      jobType: this.jobPost.jobPostDetails.jobType,
      jobCategory: this.jobPost.jobPostDetails.jobCategory,
      experience: this.jobPost.jobPostDetails. experience,
      salary: this.jobPost.jobPostDetails.salary,
      vacancy: this.jobPost.jobPostDetails.vacancy,
      location: this.jobPost.jobPostDetails.location,
      qualification: this.jobPost.jobPostDetails.  qualification,
      applyByDate: [new Date(this.jobPost.jobPostDetails.applyByDate).toISOString().slice(0, 10)],
      jobDescription: this.jobPost.jobPostDetails.jobDescription,
    });

    this.isUpdating = false;
  }





}
