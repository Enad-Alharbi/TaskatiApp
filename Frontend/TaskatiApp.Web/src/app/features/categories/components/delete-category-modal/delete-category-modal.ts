import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, input, output, signal } from '@angular/core';
import type { Category } from '../../category.models';
import { CategoryService } from '../../category.service';

@Component({
  selector: 'app-delete-category-modal',
  styleUrl: './delete-category-modal.scss',
  templateUrl: './delete-category-modal.html',
})
export class DeleteCategoryModal {
  private readonly categoryService = inject(CategoryService);

  readonly category = input.required<Category>();
  readonly categoryDeleted = output<number>();
  readonly closed = output<void>();

  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  deleteCategory(): void {
    if (this.isSubmitting()) {
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.categoryService.deleteCategory(this.category().id).subscribe({
      next: () => {
        this.categoryDeleted.emit(this.category().id);
        this.closed.emit();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage.set(
          error.status === 409
            ? 'Cannot delete this category because it contains tasks. Move or delete the tasks first.'
            : 'Could not delete category. Please try again.',
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
