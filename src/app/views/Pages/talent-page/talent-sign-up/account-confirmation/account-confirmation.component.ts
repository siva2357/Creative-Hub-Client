import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-confirmation',
  templateUrl: './account-confirmation.component.html',
  styleUrls: ['./account-confirmation.component.css'],
})
export class ConfirmationComponent {


  constructor( private router: Router) {}

  login() {
    this.router.navigate(['talent-page/login']); // Corrected navigation
  }
}
