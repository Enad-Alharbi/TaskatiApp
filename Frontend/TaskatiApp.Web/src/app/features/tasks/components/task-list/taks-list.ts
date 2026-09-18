import { Component, inject, OnInit, signal } from '@angular/core';
import type { TaskDetails, UpdateTaskRequest } from '../../task.models';
import { TaskService } from '../../task.service';

@Component({
  imports: [],
  selector: 'app-task-list',
  styleUrl: './task-list.scss',
  templateUrl: './task-list.html',
})
export class TaskList implements OnInit {
  private readonly taskService = inject(TaskService);

  protected readonly tasks = signal<TaskDetails[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly updatingTaskIds = signal<Set<number>>(new Set());

  ngOnInit(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set(
          'Could not load tasks. Please check your connection and try again.',
        );
        this.isLoading.set(false);
      },
    });
  }

  toggleTask(task: TaskDetails, event: Event): void {
    const isCompleted = (event.target as HTMLInputElement).checked;

    if (this.updatingTaskIds().has(task.id)) {
      return;
    }

    const request: UpdateTaskRequest = {
      title: task.title,
      description: task.description,
      categoryId: task.category.id,
      dueDate: task.dueDate,
      isCompleted,
    };

    this.setTaskUpdating(task.id, true);
    this.errorMessage.set(null);

    this.taskService.updateTask(task.id, request).subscribe({
      next: (updatedTask) => {
        this.tasks.update((tasks) =>
          tasks.map((currentTask) =>
            currentTask.id === updatedTask.id ? updatedTask : currentTask,
          ),
        );
        this.setTaskUpdating(task.id, false);
      },
      error: () => {
        this.setTaskUpdating(task.id, false);
        this.errorMessage.set('Could not update task. Please try again.');
      },
    });
  }

  isTaskUpdating(taskId: number): boolean {
    return this.updatingTaskIds().has(taskId);
  }

  formatDueDate(dueDate: string): string {
    const [year, month, day] = dueDate.split('-');
    return `Due ${this.getMonthName(Number(month))} ${Number(day)}, ${year}`;
  }

  private setTaskUpdating(taskId: number, isUpdating: boolean): void {
    this.updatingTaskIds.update((taskIds) => {
      const nextTaskIds = new Set(taskIds);

      if (isUpdating) {
        nextTaskIds.add(taskId);
      } else {
        nextTaskIds.delete(taskId);
      }

      return nextTaskIds;
    });
  }

  private getMonthName(month: number): string {
    return new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' }).format(
      new Date(Date.UTC(2024, month - 1, 1)),
    );
  }
}
