import { Component, inject, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import type { Category } from '../../category.models';
import { CategoryService } from '../../category.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-add-category-modal',
  styleUrl: './add-category-modal.scss',
  templateUrl: './add-category-modal.html',
})
export class AddCategoryModal {
  private readonly categoryService = inject(CategoryService);

  readonly categoryCreated = output<Category>();
  readonly closed = output<void>();

  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),
  });

  submit(): void {
    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.categoryService.createCategory({ name: this.form.controls.name.value }).subscribe({
      next: (category) => {
        this.categoryCreated.emit(category);
        this.resetAndClose();
      },
      error: () => {
        this.errorMessage.set('Could not create category. Please try again.');
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
    this.form.reset();
    this.isSubmitting.set(false);
    this.errorMessage.set(null);
    this.closed.emit();
  }
}
