import { Component} from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DEFAULT_TOOLBAR, Editor, Toolbar } from 'ngx-editor';
import { QUALIFICATION } from 'src/app/core/enums/qualification.enum';
import { Company } from 'src/app/core/models/company.model';
import { JobPost } from 'src/app/core/models/jobPost.model';
import { AdminService } from 'src/app/core/services/admin.service';
import { JobPostService } from 'src/app/core/services/jobPost.service';
import { EXPERIENCE } from 'src/app/core/enums/experience.enum';
import { JOBCATEGORY } from 'src/app/core/enums/job-category.enum';
import { JOBTYPE } from 'src/app/core/enums/job-type.enum';
import { SALARY } from 'src/app/core/enums/salary.enum';
@Component({
  selector: 'app-recruiter-post-job',
  templateUrl: './recruiter-post-job.component.html',
  styleUrls: ['./recruiter-post-job.component.css']
})
export class RecruiterPostJobPageComponent {
  public companies: Company[] = [];
  jobPostForm!: FormGroup;
  errorMessage: string = '';
  jobCreated: boolean = false;
  isLoading: boolean = false;
  isSubmitting: boolean = false;
  public editor!: Editor;
  toolbar: Toolbar = DEFAULT_TOOLBAR;
  loading: boolean = true;  // For managing loading state
  public qualifications = Object.values(QUALIFICATION); // Convert Enum to an array
  public experience = Object.values(EXPERIENCE); // Convert Enum to an array
  public salaries = Object.values(SALARY); // Convert Enum to an array
  public jobType = Object.values(JOBTYPE); // Convert Enum to an array
  public jobCategories = Object.values(JOBCATEGORY); // Convert Enum to an array


  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private jobService: JobPostService) {}

  ngOnInit() {
    this.initializeForm();
    this.fetchCompanies();
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }


  fetchCompanies() {
    this.adminService.getAllCompanies().subscribe(
      (response: { companies: Company[] }) => {
        this.companies = response.companies;
      },
      (error) => {
        console.error('Error fetching companies:', error);
        this.errorMessage = 'Failed to load companies. Please try again later.';
      }
    );
  }

  initializeForm() {
    this.jobPostForm = this.fb.group({
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
      status: ['Open']
    });
  }

  submitJobPost() {
    if (this.jobPostForm.valid) {
      this.isSubmitting = true; // Disable submit button
      const jobPostData: JobPost = {
        jobPostDetails: {
          ...this.jobPostForm.value, // This assumes your form has fields: jobId, jobRoleTitle, jobType, salary, vacancy, applyByDate, jobDescription, etc.
          status: 'Open',
        }
      };
      this.isLoading = true;
      this.jobService.createJobPost(jobPostData).subscribe({
        next: () => {
          this.isSubmitting = false;
          this.isLoading = false;
          this.jobPostForm.reset({ salary: '', jobType:'', jobCategory :'', experience:'', qualification:''});
          this.jobCreated = true; // Show success message
          setTimeout(() => {
            this.jobCreated = false; // Hide success message
          }, 3000);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.isLoading = false;
          this.errorMessage = "There was an error while posting the job. Please try again.";
        }
      });
    }
  }

  handleError(error: any) {
    console.error('Error fetching user details:', error);
    if (error.status === 401) {
      this.errorMessage = 'Unauthorized access. Please log in again.';
    } else {
      this.errorMessage = 'An error occurred while fetching user details.';
    }
    this.loading = false;
  }

  confirmDiscard() {
    if (confirm("Are you sure you want to discard the changes?")) {
      this.discard();
    }
  }

  // Reset the form and uploaded data
  discard() {
    this.jobPostForm.reset();
  }
}
