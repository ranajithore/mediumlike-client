import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BehaviorSubject, combineLatest, combineLatestWith, skip } from 'rxjs';
import { Blog } from 'src/app';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-view-blog',
  templateUrl: './view-blog.component.html',
  styleUrls: ['./view-blog.component.scss'],
})
export class ViewBlogComponent {
  private blogId = new BehaviorSubject('');
  public blogs = new BehaviorSubject<Blog[]>([]);

  public editorConfig: AngularEditorConfig = {
    editable: false,
    spellcheck: false,
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: false,
    showToolbar: false,
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
    ],
    sanitize: false,
  };

  private viewComments = false;

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe((data) => {
      this.blogId.next(data['id']);
    });

    const data = this.router.getCurrentNavigation()?.extras.state;
    if (data && data['viewComments']) {
      this.viewComments = true;
    }

    this.blogId.subscribe((id) => {
      this.blogService.getBlog(id).subscribe((data) => {
        this.blogs.next(data);
        console.log(data);
        if (this.viewComments) {
          setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
          }, 0);
        } else {
          window.scrollTo({ top: 0, left: 0 });
        }
      });
    });
  }

  public async onClickCommentsBtn() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  public async onClickLikeBtn(blog: Blog) {
    if (blog.hasLiked) {
      this.blogService.removeLike(blog._id).subscribe(() => {
        blog.hasLiked = false;
        // blog.likes = blog.likes.filter(userId => userId != )
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
      });
    } else {
      this.blogService.bookmark(blog._id).subscribe(() => {
        blog.hasBookmarked = true;
      });
    }
  }
}
