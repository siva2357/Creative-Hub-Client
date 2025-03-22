import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { SeekerProfileCardComponent } from './seeker-profile-card/seeker-profile-card.component';
import { JobPostCardComponent } from './job-post-card/job-post-card.component';
import { SampleSeekerProfileComponent } from './sample-seeker-profile/sample-seeker-profile.component';
@NgModule({
  declarations: [
    SeekerProfileCardComponent,
    JobPostCardComponent,
    SampleSeekerProfileComponent
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
    SampleSeekerProfileComponent,
    CommonModule,

  ],

  providers: [DatePipe],
  bootstrap: []
})
export class SharedModule { }
