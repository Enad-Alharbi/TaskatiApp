import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, input, output, signal } from '@angular/core';
import type { TaskDetails } from '../../task.models';
import { TaskService } from '../../task.service';

@Component({
  selector: 'app-delete-task-modal',
  styleUrl: './delete-task-modal.scss',
  templateUrl: './delete-task-modal.html',
})
export class DeleteTaskModal {
  private readonly taskService = inject(TaskService);

  readonly task = input.required<TaskDetails>();
  readonly taskDeleted = output<number>();
  readonly closed = output<void>();

  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  deleteTask(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.taskService.deleteTask(this.task().id).subscribe({
      next: () => {
        this.taskDeleted.emit(this.task().id);
        this.closed.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(
          error.status === 404
            ? 'This task could not be found. It may have already been deleted.'
            : 'Could not delete task. Please try again.',
        );
        this.isSubmitting.set(false);
      },
    });
  }

  cancel(): void {
    this.closed.emit();
  }

  closeOnOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.cancel();
    }
  }
}
