import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
    return this.http.get<TaskDetails[]>(this.tasksUrl);
  }

  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(this.getTaskUrl(id));
  }

  createTask(request: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(this.tasksUrl, request);
  }

  updateTask(id: number, request: UpdateTaskRequest): Observable<TaskDetails> {
    return this.http.put<TaskDetails>(this.getTaskUrl(id), request);
  }

  // A successful delete returns 204 No Content.
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(this.getTaskUrl(id));
  }

  getTasksByCategory(categoryId: number): Observable<TaskDetails[]> {
    return this.http.get<TaskDetails[]>(this.getCategoryTasksUrl(categoryId));
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