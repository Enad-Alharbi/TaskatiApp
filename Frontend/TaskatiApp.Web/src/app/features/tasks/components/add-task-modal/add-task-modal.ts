import { Component, inject, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import type { Category } from '../../../categories/category.models';
import { CategoryService } from '../../../categories/category.service';
import type { CreateTaskRequest, Task } from '../../task.models';
import { TaskService } from '../../task.service';

export interface CreatedTaskResult {
  task: Task;
  category: Category;
}

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-add-task-modal',
  styleUrl: './add-task-modal.scss',
  templateUrl: './add-task-modal.html',
})
export class AddTaskModal {
  private readonly categoryService = inject(CategoryService);
  private readonly taskService = inject(TaskService);

  readonly taskCreated = output<CreatedTaskResult>();
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

    const request: CreateTaskRequest = {
      title: this.form.controls.title.value,
      description: this.form.controls.description.value || null,
      categoryId,
      dueDate: this.form.controls.dueDate.value,
      isCompleted: this.form.controls.isCompleted.value,
    };

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.taskService.createTask(request).subscribe({
      next: (task) => {
        const category = this.categories().find((item) => item.id === task.categoryId);

        if (category) {
          this.taskCreated.emit({ task, category });
          this.resetAndClose();
          return;
        }

        this.errorMessage.set('The selected category is no longer available.');
        this.isSubmitting.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not create task. Please try again.');
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

  private resetAndClose(): void {
    this.form.reset({
      title: '',
      description: '',
      categoryId: null,
      dueDate: '',
      isCompleted: false,
    });
    this.isSubmitting.set(false);
    this.errorMessage.set(null);
    this.closed.emit();
  }
}
