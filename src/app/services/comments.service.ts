import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndPoints } from 'src/end-points';
import { environment } from 'src/environments/environment.development';
import urlJoin from 'url-join';
import { Comment, CreateComment } from '..';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  constructor(private http: HttpClient) {}

  public getAllComments(blogId: string) {
    return this.http.get<Comment[]>(
      urlJoin(environment.serverURL, EndPoints.BLOG, blogId, 'comments')
    );
  }

  public addNewComment(blogId: string, body: string, mentionedUser?: string) {
    const comment: CreateComment = {
      blogId,
      body,
      mentionedUser,
    };
    return this.http.post(
      urlJoin(environment.serverURL, EndPoints.BLOG, 'comments'),
      comment
    );
  }

  public likeComment(commentId: string) {
    return this.http.get(
      urlJoin(
        environment.serverURL,
        EndPoints.BLOG,
        'comments',
        commentId,
        'like'
      )
    );
  }

  public removeLikeFromComment(commentId: string) {
    return this.http.delete(
      urlJoin(
        environment.serverURL,
        EndPoints.BLOG,
        'comments',
        commentId,
        'like'
      )
    );
  }
}
