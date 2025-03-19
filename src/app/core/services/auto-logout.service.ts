import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AutoLogoutService {
  private timeout: any;
  private logoutTime: number = 15 * 60 * 1000; // 5 minutes
  private debug = true; // Set to true for debugging, false to disable logs

  constructor(private authService: AuthService, private router: Router) {
    this.log("AutoLogoutService initialized.");
    this.resetTimer();
    this.initListeners();
  }

  private resetTimer() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.log("Session expired due to inactivity. Logging out...");
      this.logoutUser();
    }, this.logoutTime);
  }

  private initListeners() {
    ['mousemove', 'keydown', 'click', 'scroll'].forEach(event => {
      document.addEventListener(event, () => {
        this.resetTimer();
      });
    });
  }

  private logoutUser() {
    this.log("Executing logoutUser...");
    this.authService.logout(); // Call logout function
    this.router.navigate(['talent-page/login']); // Redirect to login page
  }

  private log(message: string) {
    if (this.debug) {
      console.log(`[AutoLogoutService] ${message}`);
    }
  }
}
