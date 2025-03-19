import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-talent-sign-up',
  templateUrl: './talent-sign-up.component.html',
  styleUrls: ['./talent-sign-up.component.css']
})
export class TalentSignUpComponent {
  isUserTypeSelected = false;
  selectedUserType: string | null = null;

  constructor(private router: Router) {}

  selectUserType(userType: string) {
    this.selectedUserType = userType;
    this.isUserTypeSelected = true;
  }

  login() {
    this.router.navigate(['talent-page/login']); // Corrected navigation
  }
  navigateToRegistration() {
    if (this.selectedUserType === 'seeker') {
      this.router.navigate(['/talent-page/register/seeker']);  // 🔥 Absolute path
    } else if (this.selectedUserType === 'recruiter') {
      this.router.navigate(['/talent-page/register/recruiter']);
    }
  }


}

