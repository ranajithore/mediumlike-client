import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Blog, BlogsResponse, Category, CreateBlog } from '..';
import { environment } from 'src/environments/environment.development';
import urlJoin from 'url-join';
import { EndPoints } from 'src/end-points';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  constructor(private http: HttpClient) {}

  public textSearch(query: string) {
    return this.http.post<Blog[]>(
      urlJoin(environment.serverURL, EndPoints.BLOG, EndPoints.TEXT_SEARCH),
      { query }
    );
  }

  public textSearchAutoComplete(query: string) {
    return this.http.post<Blog[]>(
      urlJoin(
        environment.serverURL,
        EndPoints.BLOG,
        EndPoints.TEXT_SEARCH_AUTO_COMPLETE
      ),
      { query }
    );
  }

  public getAllBlogs(
    skip: number,
    limit: number,
    sortBy: string,
    sortingOrder: number,
    category: string,
    showPremiumBlogs = false,
    viewPublishedBlogs = false,
    viewSavedBlogs = false,
    viewBookmarkedBlogs = false
  ) {
    let url = urlJoin(environment.serverURL, EndPoints.BLOG);
    if (viewPublishedBlogs) {
      url = urlJoin(environment.serverURL, EndPoints.BLOG_PUBLISHED);
    }
    if (viewSavedBlogs) {
      url = urlJoin(environment.serverURL, EndPoints.BLOG_SAVED);
    }
    if (viewBookmarkedBlogs) {
      url = urlJoin(environment.serverURL, EndPoints.BLOGS_BOOKMARKED);
    }
    return this.http.get<BlogsResponse>(url, {
      params: {
        skip,
        limit,
        sortBy,
        sortingOrder,
        category,
        showPremiumBlogs,
      },
    });
  }

  public getBlog(id: string) {
    const url = urlJoin(environment.serverURL, EndPoints.BLOG, id);
    return this.http.get<Blog[]>(url);
  }

  public createNewBlog(blog: CreateBlog) {
    const url = urlJoin(environment.serverURL, EndPoints.BLOG);
    return this.http.post<any>(url, blog);
  }

  public updateBlog(id: string, blog: CreateBlog) {
    const url = urlJoin(environment.serverURL, EndPoints.BLOG, id);
    return this.http.patch(url, blog);
  }

  public delete(id: string) {
    const url = urlJoin(environment.serverURL, EndPoints.BLOG, id);
    return this.http.delete(url);
  }

  public publish(blog: Blog) {
    const url = urlJoin(environment.serverURL, EndPoints.BLOG, blog._id);
    blog.isPublished = true;
    return this.http.patch(url, blog);
  }

  public like(id: string) {
    return this.http.get(
      urlJoin(environment.serverURL, EndPoints.BLOG_LIKE, id)
    );
  }

  public removeLike(id: string) {
    return this.http.delete(
      urlJoin(environment.serverURL, EndPoints.BLOG_LIKE, id)
    );
  }

  public bookmark(id: string) {
    return this.http.get(
      urlJoin(environment.serverURL, EndPoints.BOOKMARK, id)
    );
  }

  public unBookmark(id: string) {
    return this.http.delete(
      urlJoin(environment.serverURL, EndPoints.BOOKMARK, id)
    );
  }
}
