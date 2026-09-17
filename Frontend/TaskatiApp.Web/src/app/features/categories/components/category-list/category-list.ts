import { Component, inject, OnInit, signal } from '@angular/core';
import type { Category } from '../../category.models';
import { CategoryService } from '../../category.service';
import { AddCategoryModal } from '../add-category-modal/add-category-modal';

@Component({
  imports: [AddCategoryModal],
  selector: 'app-category-list',
  styleUrl: './category-list.scss',
  templateUrl: './category-list.html',
})
export class CategoryList implements OnInit {
  private readonly categoryService = inject(CategoryService);

  protected readonly categories = signal<Category[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly isAddCategoryModalOpen = signal(false);

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set(
          'Could not load categories. Please check your connection and try again.',
        );
        this.isLoading.set(false);
      },
    });
  }

  openAddCategoryModal(): void {
    this.isAddCategoryModalOpen.set(true);
  }

  closeAddCategoryModal(): void {
    this.isAddCategoryModalOpen.set(false);
  }

  addCategory(category: Category): void {
    this.categories.update((categories) => [...categories, category]);
    this.closeAddCategoryModal();
  }
}
