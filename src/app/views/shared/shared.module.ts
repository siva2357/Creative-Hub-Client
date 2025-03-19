import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { SeekerProfileCardComponent } from './seeker-profile-card/seeker-profile-card.component';
import { JobPostCardComponent } from './job-post-card/job-post-card.component';
@NgModule({
  declarations: [
    SeekerProfileCardComponent,
    JobPostCardComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

  ],
  exports: [
    SeekerProfileCardComponent,
    JobPostCardComponent ,
    CommonModule,

  ],

  providers: [DatePipe],
  bootstrap: []
})
export class SharedModule { }
