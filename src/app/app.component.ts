import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoadingBarService } from './services/loading-bar.service';
import { EndPoints } from 'src/end-points';
import urlJoin from 'url-join';
import { LocalStorageService } from './services/local-storage.service';
import { GlobalEventsService } from './services/global-events.service';
import { AuthService } from './auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public showLoadingBar = new BehaviorSubject(false);
  public homePageUrl = EndPoints.DASHBOARD;
  public publishNewBlogUrl = urlJoin(EndPoints.BLOG, 'new');
  public publishedBlogsUrl = urlJoin(EndPoints.BLOG_PUBLISHED);
  public savedBlogsUrl = urlJoin(EndPoints.BLOG_SAVED);
  public bookmarkedBlogs = urlJoin(EndPoints.BLOGS_BOOKMARKED);
  public payment = urlJoin(EndPoints.PAYMENT);
  public changePassword = urlJoin(EndPoints.CHANGE_PASSWORD);
  public subscriptionDetails = urlJoin(EndPoints.SUBSCRIPTION_DETAILS);
  public currentLoggedInUser = this.storage.getCurrentLoggedInUser();
  title = 'mediumlike-client';

  constructor(
    private authService: AuthService,
    private loadingBarService: LoadingBarService,
    private storage: LocalStorageService,
    private globalEvents: GlobalEventsService,
    private router: Router
  ) {
    this.loadingBarService.shouldShowLoadingBar.subscribe((val) => {
      this.showLoadingBar.next(val);
    });

    this.globalEvents.userLoaded.subscribe(() => {
      this.currentLoggedInUser = this.storage.getCurrentLoggedInUser();
    });

    this.router.events.subscribe(() => {
      this.currentLoggedInUser = this.storage.getCurrentLoggedInUser();
    });
  }

  public onClickLogOutBtn() {
    this.authService.logOut();
    this.router.navigateByUrl(EndPoints.SIGN_IN);
  }
}
