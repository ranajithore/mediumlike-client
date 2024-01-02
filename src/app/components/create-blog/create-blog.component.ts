import { HttpEvent } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig, UploadResponse } from '@kolkov/angular-editor';
import { BehaviorSubject, Observable } from 'rxjs';
import { Category, CreateBlog } from 'src/app';
import { BlogService } from 'src/app/services/blog.service';
import { CategoryService } from 'src/app/services/category.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { EndPoints } from 'src/end-points';

@Component({
  selector: 'app-create-blog',
  templateUrl: './create-blog.component.html',
  styleUrls: ['./create-blog.component.scss'],
})
export class CreateBlogComponent {
  private categorySelectRef: any;

  public createBlogForm = this.formBuilder.group({
    category: ['', [Validators.required]],
    title: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(100),
      ],
    ],
    subTitle: [
      '',
      [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(200),
      ],
    ],
    featuredPhoto: [''],
    body: [
      '',
      [
        Validators.required,
        Validators.minLength(100),
        Validators.maxLength(10000),
      ],
    ],
    isPremium: [false, [Validators.required]],
  });
  public categories = new BehaviorSubject<Category[]>([]);

  public editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '300px',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter ',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' },
    ],
    sanitize: false,
    toolbarPosition: 'top',
  };

  private blogId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
    private renderer: Renderer2,
    private blogService: BlogService,
    private alertService: CustomAlertService
  ) {
    this.categoryService.getAllCategories().subscribe((data) => {
      this.categories.next(data);
      console.log(data);
    });

    const data = this.router.getCurrentNavigation()?.extras.state;
    if (data) {
      this.blogId = data['_id'];
      this.createBlogForm.get('category')?.setValue(data['category']);
      this.createBlogForm.get('title')?.setValue(data['title']);
      this.createBlogForm.get('subTitle')?.setValue(data['subTitle']);
      this.createBlogForm.get('body')?.setValue(data['body']);
      this.createBlogForm.get('isPremium')?.setValue(data['isPaid']);
    }
  }

  public onFormDataChange(ev: Event) {
    const inputElement = ev.target as HTMLElement;
    const formControl = this.createBlogForm.get(
      inputElement.getAttribute('formControlName')!
    );
    this.renderer.removeClass(inputElement, 'is-valid');
    this.renderer.removeClass(inputElement, 'is-invalid');
    this.renderer.addClass(
      inputElement,
      formControl?.valid ? 'is-valid' : 'is-invalid'
    );
  }

  public onSave(ev: Event) {
    ev.preventDefault();
    const formData = this.createBlogForm.getRawValue();
    const data: CreateBlog = {
      title: formData.title!,
      subTitle: formData.subTitle!,
      body: formData.body!,
      category: formData.category!,
      isPaid: formData.isPremium!,
    };

    console.log(data.category);

    if (this.blogId) {
      this.blogService.updateBlog(this.blogId, data).subscribe(async () => {
        const result = await this.alertService.showSuccess(
          'Your blog has been updated successfully'
        );
        if (result.isDismissed) {
          this.router.navigateByUrl(EndPoints.BLOG_SAVED);
        }
      });
    } else {
      this.blogService.createNewBlog(data).subscribe(async () => {
        const result = await this.alertService.showSuccess(
          'Your blog has been created successfully'
        );
        if (result.isDismissed) {
          this.router.navigateByUrl(EndPoints.BLOG_SAVED);
        }
      });
    }
  }
}
