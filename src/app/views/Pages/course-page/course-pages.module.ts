import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CoursePageComponent } from './course-page.component';
import { CoursePagesRoutingModule } from './course-pages-routing.module';
import { LayoutModule } from '../../Layouts/layout.module';
import { CourseMainPageComponent } from './course-main-page/course-main-page.component';
@NgModule({
  declarations: [
    CoursePageComponent,
    CourseMainPageComponent
  ],
  imports: [
    CommonModule,
    CoursePagesRoutingModule,
    HttpClientModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [DatePipe],
})
export class CoursePageModule { }
