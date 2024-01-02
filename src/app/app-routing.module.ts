import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ViewBlogComponent } from './components/view-blog/view-blog.component';
import { CreateBlogComponent } from './components/create-blog/create-blog.component';
import { PaymentComponent } from './components/payment/payment.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { SubscriptionDetailsComponent } from './components/subscription-details/subscription-details.component';
import { AboutMeComponent } from './components/about-me/about-me.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'blog/new',
    component: CreateBlogComponent,
  },
  {
    path: 'blog/published',
    component: DashboardComponent,
    data: { viewPublishedBlogs: true },
  },
  {
    path: 'blog/saved',
    component: DashboardComponent,
    data: { viewSavedBlogs: true },
  },
  {
    path: 'blog/bookmarked',
    component: DashboardComponent,
    data: { viewBookmarkedBlogs: true },
  },
  {
    path: 'blog/:id',
    component: ViewBlogComponent,
  },
  {
    path: 'blog/edit/:id',
    component: CreateBlogComponent,
  },
  {
    path: 'payment',
    component: PaymentComponent,
  },
  {
    path: 'auth/changePassword',
    component: ChangePasswordComponent,
  },
  {
    path: 'activeSubscriptionPlan',
    component: SubscriptionDetailsComponent,
  },
  {
    path: 'aboutMe',
    component: AboutMeComponent,
  },
  { path: '', pathMatch: 'full', redirectTo: 'auth' },
  { path: '**', pathMatch: 'full', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
