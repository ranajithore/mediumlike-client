import { NgModule, importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  NgbAlertModule,
  NgbDropdownModule,
  NgbModule,
} from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SvgIconComponent, provideAngularSvgIcon } from 'angular-svg-icon';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { JsonPipe } from '@angular/common';
import { httpInterceptorProviders } from './interceptors';
import { CustomAlertService } from './services/custom-alert.service';
import { LocalStorageService } from './services/local-storage.service';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { BlogService } from './services/blog.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingBarService } from './services/loading-bar.service';
import { ViewBlogComponent } from './components/view-blog/view-blog.component';
import { CreateBlogComponent } from './components/create-blog/create-blog.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { CategoryService } from './services/category.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { CommentsComponent } from './components/comments/comments.component';
import { PaymentComponent } from './components/payment/payment.component';
import { PaymentService } from './services/payment.service';
import { GlobalEventsService } from './services/global-events.service';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { SubscriptionDetailsComponent } from './components/subscription-details/subscription-details.component';
import { AboutMeComponent } from './components/about-me/about-me.component';
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDi3esqqvp49oKuU-QyiM4OozSkWB23glQ',
  authDomain: 'mediumlike-7c43f.firebaseapp.com',
  projectId: 'mediumlike-7c43f',
  storageBucket: 'mediumlike-7c43f.appspot.com',
  messagingSenderId: '129458572631',
  appId: '1:129458572631:web:dc30860cb9a01fab938212',
  measurementId: 'G-WGEXF1R7RC',
};

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PageNotFoundComponent,
    ViewBlogComponent,
    CreateBlogComponent,
    CommentsComponent,
    PaymentComponent,
    ChangePasswordComponent,
    SubscriptionDetailsComponent,
    AboutMeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    FontAwesomeModule,
    SvgIconComponent,
    HttpClientModule,
    NgbAlertModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    BrowserAnimationsModule,
    NgbDropdownModule,
    MatProgressBarModule,
    AngularEditorModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
  ],
  providers: [
    provideAngularSvgIcon(),
    importProvidersFrom(HttpClientModule),
    httpInterceptorProviders,
    CustomAlertService,
    LocalStorageService,
    BlogService,
    LoadingBarService,
    CategoryService,
    PaymentService,
    GlobalEventsService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
