import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recruiter } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/user-service';

@Component({
  selector: 'app-recruiter-details',
  templateUrl: './recruiter-details.component.html',
  styleUrls: ['./recruiter-details.component.css']
})
export class RecruiterDetailsComponent  implements OnInit {
  @Input() recruiter!: Recruiter;


  errorMessage = '';
  recruiterId!: string;


    constructor(
      private activatedRouter: ActivatedRoute,
      private router: Router,
      private userService: UserService,
    ) {}

  ngOnInit(): void {
    this.activatedRouter.paramMap.subscribe((param) => {
      this.recruiterId = param.get('id')!;
      console.log('University ID:', this.recruiterId);

      if (this.recruiterId) {
        this.fetchRecruiterData(); // Call API only after ID is fetched
      }
    });
  }



  fetchRecruiterData() {
      this.userService.getRecruiterById(this.recruiterId).subscribe(
        (recruiterData: Recruiter) => {
          if (recruiterData) {
            this.recruiter = recruiterData;
          } else {
            this.errorMessage = 'University data not found';
          }
        },
        (error) => {
          this.errorMessage = 'Failed to load university data';
        }
      );
    }



  // **Navigate to University Details with ID**
  goToRecruiterPage(): void {
    this.router.navigateByUrl('talent-page/admin/recruiter');
  }

}
