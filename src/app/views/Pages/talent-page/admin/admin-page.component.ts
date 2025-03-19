import { Component } from '@angular/core';
import { MenuItem } from 'src/app/core/models/sidebar-menu.model';
import { AutoLogoutService } from 'src/app/core/services/auto-logout.service';

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css']
})
export class AdminPageComponent {
  constructor(private autoLogoutService: AutoLogoutService) {
    console.log('Auto logout service initialized');
  }

  menu: MenuItem[] = [
    { label: 'Dashboard', link: 'dashboard', icon: 'bi bi-grid' },
    { label: 'User Data', link: 'user-data', icon: 'bi bi-database' },
  ];

  sidebarOpen: boolean = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

}
