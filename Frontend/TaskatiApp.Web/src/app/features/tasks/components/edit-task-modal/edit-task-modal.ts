import { Component, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import type { Category } from '../../../categories/category.models';
import { CategoryService } from '../../../categories/category.service';
import type { TaskDetails, UpdateTaskRequest } from '../../task.models';
import { TaskService } from '../../task.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-edit-task-modal',
  styleUrl: './edit-task-modal.scss',
  templateUrl: './edit-task-modal.html',
})
export class EditTaskModal {
  private readonly categoryService = inject(CategoryService);
  private readonly taskService = inject(TaskService);

  readonly task = input.required<TaskDetails>();
  readonly taskUpdated = output<TaskDetails>();
  readonly closed = output<void>();

  protected readonly categories = signal<Category[]>([]);
  protected readonly isLoadingCategories = signal(true);
  protected readonly categoryError = signal<string | null>(null);
  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly form = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(500)],
    }),
    categoryId: new FormControl<number | null>(null, Validators.required),
    dueDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    isCompleted: new FormControl(false, { nonNullable: true }),
  });

  constructor() {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.isLoadingCategories.set(false);
        this.initializeForm();
      },
      error: () => {
        this.categoryError.set('Could not load categories. Please try again.');
        this.isLoadingCategories.set(false);
      },
    });
  }

  submit(): void {
    if (this.form.invalid || this.isSubmitting() || this.isLoadingCategories()) {
      this.form.markAllAsTouched();
      return;
    }

    const categoryId = this.form.controls.categoryId.value;

    if (categoryId === null) {
      return;
    }

    const request: UpdateTaskRequest = {
      title: this.form.controls.title.value,
      description: this.form.controls.description.value || null,
      categoryId,
      dueDate: this.form.controls.dueDate.value,
      isCompleted: this.form.controls.isCompleted.value,
    };

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.taskService.updateTask(this.task().id, request).subscribe({
      next: (updatedTask) => {
        this.taskUpdated.emit(updatedTask);
        this.resetAndClose();
      },
      error: () => {
        this.errorMessage.set('Could not update task. Please try again.');
        this.isSubmitting.set(false);
      },
    });
  }

  cancel(): void {
    this.resetAndClose();
  }

  closeOnOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.cancel();
    }
  }

  private initializeForm(): void {
    this.form.reset({
      title: this.task().title,
      description: this.task().description ?? '',
      categoryId: this.task().category.id,
      dueDate: this.task().dueDate,
      isCompleted: this.task().isCompleted,
    });
  }

  private resetAndClose(): void {
    this.initializeForm();
    this.isSubmitting.set(false);
    this.errorMessage.set(null);
    this.closed.emit();
  }
}
