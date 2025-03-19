import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Seeker } from 'src/app/core/models/user.model';
import { UserService } from 'src/app/core/services/user-service';

@Component({
  selector: 'app-seeker-details',
  templateUrl: './seeker-details.component.html',
  styleUrls: ['./seeker-details.component.css']
})
export class SeekerDetailsComponent implements OnInit {
@Input() seeker!: Seeker;


  errorMessage = '';
  seekerId!: string;



      constructor(
        private activatedRouter: ActivatedRoute,
        private router: Router,
        private userService: UserService,
      ) {}


      ngOnInit(): void {
        this.activatedRouter.paramMap.subscribe((param) => {
          this.seekerId = param.get('id')!;
          console.log('University ID:', this.seekerId);

          if (this.seekerId) {
            this.fetchSeekerData(); // Call API only after ID is fetched
          }
        });
      }



      fetchSeekerData() {
            this.userService.getSeekerById(this.seekerId).subscribe(
              (seekerData: Seeker) => {
                if (seekerData) {
                  this.seeker = seekerData;
                } else {
                  this.errorMessage = 'University data not found';
                }
              },
              (error) => {
                this.errorMessage = 'Failed to load university data';
              }
            );
          }

  goToSeekerPage(): void {
    this.router.navigateByUrl('talent-page/admin/seeker');
  }

}
