import { Component, EventEmitter, Input, Output} from '@angular/core';
import { MenuItem} from 'src/app/core/models/sidebar-menu.model';

@Component({
  selector: 'app-talent-sidebar',
  templateUrl: './talent-sidebar.component.html',
  styleUrls: ['./talent-sidebar.component.css']
})
export class TalentSidebarComponent {

  @Input() menu = new EventEmitter <MenuItem>; // Event emitter for job selection
  @Input() menuItems: MenuItem[] = []; // Receives the menu items array

  @Output() toggleSidebar = new EventEmitter<boolean>();
  @Input() sidebarOpen: boolean = true; // Receives sidebar state from parent


  toggle() {
    // this.sidebarOpen = !this.sidebarOpen;
    this.toggleSidebar.emit(); // Emit event to parent
  }

}
