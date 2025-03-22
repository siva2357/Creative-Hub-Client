import { NgModule } from '@angular/core';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';


import { AppComponent } from './app.component';


import { MainPageComponent } from './views/Pages/main-page/main-page.component';
import { CoursePageComponent } from './views/Pages/course-page/course-page.component';
import { ForDeveloperComponent } from './views/Pages/for-developer/for-developer.component';
import { AboutPageComponent } from './views/Pages/about-page/about-page.component';
import { BlogPageComponent } from './views/Pages/blog-page/blog-page.component';
import { MarketPageComponent } from './views/Pages/market-page/market-page.component';
import { PublishPageComponent } from './views/Pages/publish-page/publish-page.component';
import { PurposePageComponent } from './views/Pages/purpose-page/purpose-page.component';
import { CloudPageComponent } from './views/Pages/cloud-page/cloud-page.component';

import { TalentPageModule } from './views/Pages/talent-page/talent-pages.module';

import { UnauthorizedPageComponent } from './views/other-pages/unauthorized-page/unauthorized-page.component';
import { LayoutModule } from "./views/Layouts/layout.module";
import { SharedModule } from './views/shared/shared.module';
import { IntroductionLogoComponent } from './views/Pages/introduction-logo/introduction-logo.component';
import { ForgotPasswordPageComponent } from './views/Pages/talent-page/talent-sign-up/forgot-password-page/forgot-password-page.component';
import { ResetPasswordOtpPageComponent } from './views/Pages/talent-page/talent-sign-up/reset-password-otp-page/reset-password-otp-page.component';
import { ResetPasswordPageComponent } from './views/Pages/talent-page/talent-sign-up/reset-password-page/reset-password-page.component';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { environment } from 'src/environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    CoursePageComponent,
    ForDeveloperComponent,
    AboutPageComponent,
    BlogPageComponent,
    MarketPageComponent,
    PublishPageComponent,
    PurposePageComponent,
    CloudPageComponent,
    UnauthorizedPageComponent,
    IntroductionLogoComponent,
    ForgotPasswordPageComponent,
    ResetPasswordOtpPageComponent,
    ResetPasswordPageComponent,
  ],

  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    SharedModule,
    TalentPageModule,
    AngularFireModule.initializeApp(environment.firebaseConfig), // Use legacy compatibility mode
    AngularFireStorageModule, // Use storage services

],
  providers: [ DatePipe ],
  bootstrap: [AppComponent]
})
export class AppModule { }
