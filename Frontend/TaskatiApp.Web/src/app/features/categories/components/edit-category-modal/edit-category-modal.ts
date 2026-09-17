import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import type { Category } from '../../category.models';
import { CategoryService } from '../../category.service';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-edit-category-modal',
  styleUrl: './edit-category-modal.scss',
  templateUrl: './edit-category-modal.html',
})
export class EditCategoryModal implements OnInit {
  private readonly categoryService = inject(CategoryService);

  readonly category = input.required<Category>();
  readonly categoryUpdated = output<Category>();
  readonly closed = output<void>();

  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(50)],
    }),
  });

  ngOnInit(): void {
    this.form.controls.name.setValue(this.category().name);
  }

  submit(): void {
    if (this.form.invalid || this.isSubmitting()) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.categoryService
      .updateCategory(this.category().id, { name: this.form.controls.name.value })
      .subscribe({
        next: (category) => {
          this.categoryUpdated.emit(category);
          this.resetAndClose();
        },
        error: () => {
          this.errorMessage.set('Could not update category. Please try again.');
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
    this.form.reset({ name: this.category().name });
    this.isSubmitting.set(false);
    this.errorMessage.set(null);
    this.closed.emit();
  }
}
