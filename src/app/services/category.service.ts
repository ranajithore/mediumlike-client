import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EndPoints } from 'src/end-points';
import { environment } from 'src/environments/environment.development';
import urlJoin from 'url-join';
import { Category } from '..';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  public getAllCategories() {
    return this.http.get<Category[]>(
      urlJoin(environment.serverURL, EndPoints.CATEGORY)
    );
  }
}
