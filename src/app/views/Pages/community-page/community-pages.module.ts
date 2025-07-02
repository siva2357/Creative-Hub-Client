import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommunityPagesRoutingModule} from './community-pages-routing.module';
import { LayoutModule } from '../../Layouts/layout.module';
import { CommunityPageComponent } from './community-page.component';
import { CommunityMainPageComponent } from './community-main-page/community-main-page.component';
@NgModule({
  declarations: [
    CommunityPageComponent,
     CommunityMainPageComponent
  ],
  imports: [
    CommonModule,
    CommunityPagesRoutingModule,
    HttpClientModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [DatePipe],
})
export class CommunityPageModule { }
