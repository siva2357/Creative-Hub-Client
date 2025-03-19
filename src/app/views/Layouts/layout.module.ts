import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TalentSidebarComponent } from './talent-sidebar/talent-sidebar.component';
import { RouterModule } from '@angular/router';
import { TalentHeaderComponent } from './talent-header/talent-header.component';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { AppHeaderComponent } from './app-header/app-header.component';

@NgModule({
  declarations: [
    TalentSidebarComponent,
    TalentHeaderComponent,
    AppHeaderComponent,
    AppFooterComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
 exports: [
    TalentSidebarComponent,
    TalentHeaderComponent,
    AppHeaderComponent,
    AppFooterComponent
  ],
  providers: [DatePipe],
})
export class LayoutModule { }
