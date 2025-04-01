import { Component} from '@angular/core';
import { MenuItem } from 'src/app/core/models/sidebar-menu.model';
import { AutoLogoutService } from 'src/app/core/services/auto-logout.service';

@Component({
  selector: 'app-seeker-main-page',
  templateUrl: './seeker-main-page.component.html',
  styleUrls: ['./seeker-main-page.component.css']
})
export class SeekerMainPageComponent {
  constructor(private autoLogoutService: AutoLogoutService) {
    console.log('Auto logout service initialized');
  }

  menu: MenuItem[] = [
    // { label: 'Dashboard', link: 'dashboard', icon: 'bi bi-grid'},
    { label: 'My Profile', link: 'profile', icon: 'bi bi-person-circle'},
    { label: 'Post project', link: 'post-project', icon: 'bi bi-plus-square'},
    { label: 'Portfolio', link: 'portfolio', icon: 'bi bi-grid-3x3-gap'},
    { label: 'Manage project', link: 'manage-project', icon: 'bi bi-pencil-square'},
    { label: 'Job Profile', link: 'jobProfile', icon: 'bi bi-suitcase-lg'},
    { label: 'Launchpad', link: 'launchPad', icon: 'bi bi-rocket-takeoff'},
  ];

  sidebarOpen: boolean = true;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
