import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
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
    return this.http.get<Category[]>(this.categoriesUrl).pipe(
      tap({
        next: (categories) => console.log('GET /categories', categories),
        error: (error) => console.log('GET /categories failed', error),
      }),
    );
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(this.getCategoryUrl(id)).pipe(
      tap({
        next: (category) => console.log(`GET /categories/${id}`, category),
        error: (error) => console.log(`GET /categories/${id} failed`, error),
      }),
    );
  }

  createCategory(request: CreateCategoryRequest): Observable<Category> {
    return this.http.post<Category>(this.categoriesUrl, request).pipe(
      tap({
        next: (category) => console.log('POST /categories', { request, category }),
        error: (error) => console.log('POST /categories failed', error),
      }),
    );
  }

  updateCategory(id: number, request: UpdateCategoryRequest): Observable<Category> {
    return this.http.put<Category>(this.getCategoryUrl(id), request).pipe(
      tap({
        next: (category) => console.log(`PUT /categories/${id}`, { request, category }),
        error: (error) => console.log(`PUT /categories/${id} failed`, error),
      }),
    );
  }

  // A successful delete returns 204 No Content.
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(this.getCategoryUrl(id)).pipe(
      tap({
        next: () => console.log(`DELETE /categories/${id}`, '204 No Content'),
        error: (error) => console.log(`DELETE /categories/${id} failed`, error),
      }),
    );
  }

  private getCategoryUrl(id: number): string {
    return `${this.categoriesUrl}/${id}`;
  }
}