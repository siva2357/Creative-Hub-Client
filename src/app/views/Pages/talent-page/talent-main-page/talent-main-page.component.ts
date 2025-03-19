import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-talent-main-page',
  templateUrl: './talent-main-page.component.html',
  styleUrls: ['./talent-main-page.component.css']
})
export class TalentMainPageComponent {

    constructor(private router: Router) {}

    login() {
      window.open('/talent-page/login', '_blank'); // Opens login in a new tab
    }

    signUp() {
      window.open('/talent-page/signup', '_blank'); // Opens signup in a new tab
    }


}
