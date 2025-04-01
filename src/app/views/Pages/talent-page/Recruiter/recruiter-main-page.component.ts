import { Component} from '@angular/core';
import { MenuItem } from 'src/app/core/models/sidebar-menu.model';
import { AutoLogoutService } from 'src/app/core/services/auto-logout.service';

@Component({
  selector: 'app-recruiter-main-page',
  templateUrl: './recruiter-main-page.component.html',
  styleUrls: ['./recruiter-main-page.component.css']
})
export class RecruiterMainPageComponent {

  constructor(private autoLogoutService: AutoLogoutService) {
    console.log('Auto logout service initialized');
  }


  menu: MenuItem[] = [
    // { label: 'Dashboard', link: 'dashboard', icon: 'bi bi-grid' },
    { label: 'My Profile', link: 'profile', icon: 'bi bi-person-circle' },
    { label: 'Post Job', link: 'post-job', icon: 'bi bi-plus-square' },
    { label: 'Manage Jobs', link: 'manage-jobs', icon: 'bi bi-pencil-square' },
    { label: 'Closed Jobs', link: 'closed-jobs', icon: 'bi bi-archive' },
    { label: 'Job Applicants', link: 'job-applicants', icon: 'bi bi-people-fill' },
    { label: 'Hire Seeker', link: 'hire-seeker', icon: 'bi bi-person-add' },
  ];

  sidebarOpen: boolean = true;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }


}
