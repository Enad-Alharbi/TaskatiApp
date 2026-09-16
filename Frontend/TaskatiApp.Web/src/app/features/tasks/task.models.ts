import type { Category } from '../categories/category.models';

// Basic task response returned by the API.
export interface Task {
  id: number;
  title: string;
  description: string | null;
  categoryId: number;
  dueDate: string;
  isCompleted: boolean;
}

// Detailed task response with its related category.
export interface TaskDetails {
  id: number;
  title: string;
  description: string | null;
  dueDate: string;
  isCompleted: boolean;
  category: Category;
}

// Payload used to create a task.
export interface CreateTaskRequest {
  title: string;
  description: string | null;
  categoryId: number;
  dueDate: string;
  isCompleted: boolean;
}

// Payload used to update a task.
export interface UpdateTaskRequest {
  title: string;
  description: string | null;
  categoryId: number;
  dueDate: string;
  isCompleted: boolean;
}