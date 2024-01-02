import { AfterViewInit, Component, Input, Renderer2 } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Blog, Comment } from 'src/app';
import { CommentsService } from 'src/app/services/comments.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
})
export class CommentsComponent implements AfterViewInit {
  @Input() blog: Blog;

  public comments = new BehaviorSubject<Comment[]>([]);

  public commentForm = this.formBuilder.group({
    body: ['', [Validators.required]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private commentsService: CommentsService,
    private alertService: CustomAlertService
  ) {}

  public ngAfterViewInit(): void {
    this.fetchComments();
  }

  public onFormDataChange(ev: Event) {
    const inputElement = ev.target as HTMLElement;
    const formControl = this.commentForm.get(
      inputElement.getAttribute('formControlName')!
    );
    this.renderer.removeClass(inputElement, 'is-valid');
    this.renderer.removeClass(inputElement, 'is-invalid');
    this.renderer.addClass(
      inputElement,
      formControl?.valid ? 'is-valid' : 'is-invalid'
    );
  }

  public onComment(ev: Event) {
    ev.preventDefault();
    const formData = this.commentForm.getRawValue();
    console.log(formData);
    this.commentsService
      .addNewComment(this.blog._id, formData.body!)
      .subscribe(() => {
        this.alertService.showSuccess('Comment Posted Successfully');
        this.fetchComments();
      });
  }

  public onClickLikeBtn(ev: Event, comment: Comment) {
    ev.preventDefault();
    ev.stopPropagation();
    if (comment.hasLiked) {
      this.commentsService.removeLikeFromComment(comment._id).subscribe(() => {
        this.fetchComments();
      });
    } else {
      this.commentsService.likeComment(comment._id).subscribe(() => {
        this.fetchComments();
      });
    }
  }

  private fetchComments() {
    this.commentsService.getAllComments(this.blog._id).subscribe((data) => {
      this.comments.next(data);
    });
  }
}
