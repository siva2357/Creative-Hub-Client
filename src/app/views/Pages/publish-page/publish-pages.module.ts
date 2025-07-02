import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '../../Layouts/layout.module';
import { PublishMainPageComponent } from './publish-main-page/publish-main-page.component';
import { PublishPageComponent } from './publish-page.component';
import { PublishPagesRoutingModule } from './publish-pages-routing.module';
@NgModule({
  declarations: [
    PublishPageComponent ,
   PublishMainPageComponent
  ],
  imports: [
    CommonModule,
    PublishPagesRoutingModule,
    HttpClientModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [DatePipe],
})
export class PublishPageModule { }
