import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import type {
  CreateTaskRequest,
  Task,
  TaskDetails,
  UpdateTaskRequest,
} from './task.models';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://localhost:5253';

  getTasks(): Observable<TaskDetails[]> {
    return this.http.get<TaskDetails[]>(this.tasksUrl).pipe(
      tap({
        next: (tasks) => console.log('GET /tasks', tasks),
        error: (error) => console.log('GET /tasks failed', error),
      }),
    );
  }

  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(this.getTaskUrl(id)).pipe(
      tap({
        next: (task) => console.log(`GET /tasks/${id}`, task),
        error: (error) => console.log(`GET /tasks/${id} failed`, error),
      }),
    );
  }

  createTask(request: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(this.tasksUrl, request).pipe(
      tap({
        next: (task) => console.log('POST /tasks', { request, task }),
        error: (error) => console.log('POST /tasks failed', error),
      }),
    );
  }

  updateTask(id: number, request: UpdateTaskRequest): Observable<TaskDetails> {
    return this.http.put<TaskDetails>(this.getTaskUrl(id), request).pipe(
      tap({
        next: (task) => console.log(`PUT /tasks/${id}`, { request, task }),
        error: (error) => console.log(`PUT /tasks/${id} failed`, error),
      }),
    );
  }

  // A successful delete returns 204 No Content.
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(this.getTaskUrl(id)).pipe(
      tap({
        next: () => console.log(`DELETE /tasks/${id}`, '204 No Content'),
        error: (error) => console.log(`DELETE /tasks/${id} failed`, error),
      }),
    );
  }

  getTasksByCategory(categoryId: number): Observable<TaskDetails[]> {
    return this.http.get<TaskDetails[]>(this.getCategoryTasksUrl(categoryId)).pipe(
      tap({
        next: (tasks) => console.log(`GET /categories/${categoryId}/tasks`, tasks),
        error: (error) => console.log(`GET /categories/${categoryId}/tasks failed`, error),
      }),
    );
  }

  private get tasksUrl(): string {
    return `${this.apiBaseUrl}/tasks`;
  }

  private getTaskUrl(id: number): string {
    return `${this.tasksUrl}/${id}`;
  }

  private getCategoryTasksUrl(categoryId: number): string {
    return `${this.apiBaseUrl}/categories/${categoryId}/tasks`;
  }
}