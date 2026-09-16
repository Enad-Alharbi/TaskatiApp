import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from './category.models';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly categoriesUrl = 'http://localhost:5253/categories';

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoriesUrl);
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(this.getCategoryUrl(id));
  }

  createCategory(request: CreateCategoryRequest): Observable<Category> {
    return this.http.post<Category>(this.categoriesUrl, request);
  }

  updateCategory(id: number, request: UpdateCategoryRequest): Observable<Category> {
    return this.http.put<Category>(this.getCategoryUrl(id), request);
  }

  // A successful delete returns 204 No Content.
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(this.getCategoryUrl(id));
  }

  private getCategoryUrl(id: number): string {
    return `${this.categoriesUrl}/${id}`;
  }
}