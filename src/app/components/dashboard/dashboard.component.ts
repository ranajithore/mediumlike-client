import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import {
  BehaviorSubject,
  combineLatest,
  first,
  last,
  map,
  retry,
  skip,
  takeLast,
  zip,
} from 'rxjs';
import { Blog, Category, UserRoles } from 'src/app';
import { BlogService } from 'src/app/services/blog.service';
import { CategoryService } from 'src/app/services/category.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { EndPoints } from 'src/end-points';
import { environment } from 'src/environments/environment.development';
import urlJoin from 'url-join';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements AfterViewInit {
  public blogs = new BehaviorSubject<Blog[]>([]);
  public categories = new BehaviorSubject<Category[]>([]);
  public displayShowMoreBtn = new BehaviorSubject(true);
  public isLoading = new BehaviorSubject(false);
  public sortBy = new BehaviorSubject('none');
  public category = new BehaviorSubject('all');
  public sortingOrder = new BehaviorSubject(1);
  public totalNumberOfBlogs = new BehaviorSubject(0);
  public showPremiumBlogsOnly = new BehaviorSubject(false);
  public viewPublishedBlogs = new BehaviorSubject(false);
  public viewSavedBlogs = new BehaviorSubject(false);
  public viewBookmarkedBlogs = new BehaviorSubject(false);
  public searchQuery = '';
  public isSearching = new BehaviorSubject(false);
  public isShowingSearchResults = new BehaviorSubject(false);
  public autocompleteSuggestions = new BehaviorSubject<Blog[]>([]);

  private reload = new BehaviorSubject(false);
  private currentPage = 0;
  private blogsPerPage = 10;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private blogService: BlogService,
    private categoryService: CategoryService,
    private alertService: CustomAlertService,
    private storage: LocalStorageService
  ) {}

  public ngAfterViewInit(): void {
    this.categoryService.getAllCategories().subscribe((data) => {
      this.categories.next(data);
    });
    this.route.data.subscribe((data) => {
      if (data['viewPublishedBlogs']) {
        this.viewPublishedBlogs.next(true);
      }
      if (data['viewSavedBlogs']) {
        this.viewSavedBlogs.next(true);
      }
      if (data['viewBookmarkedBlogs']) {
        this.viewBookmarkedBlogs.next(true);
      }
    });
    combineLatest([
      this.reload,
      this.viewPublishedBlogs,
      this.viewSavedBlogs,
      this.viewBookmarkedBlogs,
      this.sortBy,
      this.sortingOrder,
      this.category,
      this.showPremiumBlogsOnly,
      this.isSearching,
    ]).subscribe(() => {
      if (!this.isSearching.value) {
        this.blogs.next([]);
        this.currentPage = 0;
        this.fetchBlogs(
          this.currentPage * this.blogsPerPage,
          this.blogsPerPage
        );
      }
    });
  }

  public async clickReadMore(ev: Event, index: number) {
    ev.preventDefault();
    ev.stopPropagation();
    if (
      this.blogs.value[index].isPaid &&
      this.storage.getCurrentLoggedInUser().role === UserRoles.nonPremiumUser
    ) {
      const result = await this.alertService.showWarningModal(
        'This blog is Premium',
        'Please upgrade to Premium account to read Premium Blogs'
      );
      if (result.isConfirmed || result.isDismissed) {
        this.router.navigateByUrl(EndPoints.PAYMENT);
        return;
      }
    }
    this.router.navigateByUrl(urlJoin('blog', this.blogs.value[index]._id));
  }

  public onClickShowMore() {
    this.currentPage++;
    this.fetchBlogs(this.currentPage * this.blogsPerPage, this.blogsPerPage);
  }

  public onClickCreateNewBlog() {
    this.router.navigateByUrl('blog/new');
  }

  public onSortByChange(ev: Event) {
    const value = (ev.target as any).value;
    this.sortBy.next(value);
  }

  public onSortingOrderChange() {
    this.sortingOrder.next(-this.sortingOrder.value);
  }

  public onCategoryChange(ev: Event) {
    const value = (ev.target as any).value;
    this.category.next(value);
  }

  public onClickPremiumBlogs(ev: Event) {
    this.showPremiumBlogsOnly.next((ev.target as HTMLInputElement).checked);
  }

  public async onClickEditBtn(blog: Blog) {
    this.router.navigateByUrl(urlJoin(EndPoints.BLOG, 'new'), { state: blog });
  }

  public async onClickDeleteBtn(blogId: string) {
    const result = await this.alertService.showWarningModal(
      'Do you really want to delete this blog?',
      'This action can not be reverted once done.'
    );
    if (result.isConfirmed) {
      this.blogService.delete(blogId).subscribe(() => {
        this.reload.next(true);
        this.alertService.showSuccess('Successfully Deleted');
      });
    }
  }

  public async onClickPublishBtn(blog: Blog) {
    const result = await this.alertService.showWarningModal(
      'Do you really want to publish this blog?',
      'Once a blog is published no modifications can be made. This action can not be reverted once done.'
    );
    if (result.isConfirmed) {
      this.blogService.publish(blog).subscribe(() => {
        this.reload.next(true);
        this.alertService.showSuccess('Successfully Published');
      });
    }
  }

  public async onClickCommentsBtn(blog: Blog) {
    this.router.navigateByUrl(urlJoin(EndPoints.BLOG, blog._id), {
      state: { viewComments: true },
    });
  }

  public async onClickLikeBtn(blog: Blog) {
    if (blog.hasLiked) {
      this.blogService.removeLike(blog._id).subscribe(() => {
        blog.hasLiked = false;
      });
    } else {
      this.blogService.like(blog._id).subscribe(() => {
        blog.hasLiked = true;
      });
    }
  }

  public async onClickBookmarkBtn(blog: Blog) {
    if (blog.hasBookmarked) {
      this.blogService.unBookmark(blog._id).subscribe(() => {
        blog.hasBookmarked = false;
        if (this.viewBookmarkedBlogs.value) {
          this.blogs.next([]);
          this.currentPage = 0;
          this.fetchBlogs(
            this.currentPage * this.blogsPerPage,
            this.blogsPerPage
          );
        }
      });
    } else {
      this.blogService.bookmark(blog._id).subscribe(() => {
        blog.hasBookmarked = true;
        if (this.viewBookmarkedBlogs.value) {
          this.blogs.next([]);
          this.currentPage = 0;
          this.fetchBlogs(
            this.currentPage * this.blogsPerPage,
            this.blogsPerPage
          );
        }
      });
    }
  }

  public async onSearchQueryChange(ev: Event) {
    if (this.searchQuery !== '' && !this.isSearching.value) {
      this.isSearching.next(true);
    } else if (this.searchQuery === '' && this.isSearching.value) {
      this.isSearching.next(false);
    }
    this.blogService
      .textSearchAutoComplete(this.searchQuery)
      .subscribe((data) => {
        this.autocompleteSuggestions.next(data);
      });
  }

  public async onClickSearchBtn() {
    if (this.searchQuery !== '') {
      this.isLoading.next(true);
      this.blogService.textSearch(this.searchQuery).subscribe((data) => {
        this.isShowingSearchResults.next(true);
        this.currentPage = 0;
        this.blogs.next(data);
        this.totalNumberOfBlogs.next(data.length);
        this.displayShowMoreBtn.next(false);
        this.isLoading.next(false);
      });
    } else {
      this.blogs.next([]);
      this.currentPage = 0;
      this.fetchBlogs(this.currentPage * this.blogsPerPage, this.blogsPerPage);
    }
  }
  private handleShowMoreBtn() {
    if (
      this.currentPage * this.blogsPerPage + this.blogsPerPage >=
      this.totalNumberOfBlogs.value
    ) {
      this.displayShowMoreBtn.next(false);
    } else {
      this.displayShowMoreBtn.next(true);
    }
  }

  private fetchBlogs(skip: number, limit: number) {
    this.isShowingSearchResults.next(false);
    this.isLoading.next(true);
    this.blogService
      .getAllBlogs(
        skip,
        limit,
        this.sortBy.value,
        this.sortingOrder.value,
        this.category.value,
        this.showPremiumBlogsOnly.value,
        this.viewPublishedBlogs.value,
        this.viewSavedBlogs.value,
        this.viewBookmarkedBlogs.value
      )
      .subscribe({
        next: (data) => {
          this.totalNumberOfBlogs.next(data.totalCount);
          const previousBlogs = this.blogs.value;
          this.blogs.next([...previousBlogs, ...data.blogs]);
          this.isLoading.next(false);
          this.handleShowMoreBtn();
        },
      });
  }
}
