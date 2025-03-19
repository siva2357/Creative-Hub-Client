import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-user-data',
  templateUrl: './admin-user-data.component.html',
  styleUrls: ['./admin-user-data.component.css'],
})
export class AdminUserDataPageComponent {
  constructor(private router: Router) {}

  goToRecruiterPage(): void {
    this.router.navigateByUrl('talent-page/admin/recruiter');
  }

  goToSeekerPage(): void {
    this.router.navigateByUrl('talent-page/admin/seeker');
  }
}
