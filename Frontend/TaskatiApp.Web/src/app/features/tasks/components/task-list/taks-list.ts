import { Component, computed, HostListener, inject, OnInit, signal } from '@angular/core';
import type { Category } from '../../../categories/category.models';
import { CategoryService } from '../../../categories/category.service';
import type { Task, TaskDetails, UpdateTaskRequest } from '../../task.models';
import { TaskService } from '../../task.service';
import { AddTaskModal, type CreatedTaskResult } from '../add-task-modal/add-task-modal';
import { DeleteTaskModal } from '../delete-task-modal/delete-task-modal';
import { EditTaskModal } from '../edit-task-modal/edit-task-modal';

@Component({
  imports: [AddTaskModal, DeleteTaskModal, EditTaskModal],
  selector: 'app-task-list',
  styleUrl: './task-list.scss',
  templateUrl: './task-list.html',
})
export class TaskList implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly categoryService = inject(CategoryService);

  protected readonly tasks = signal<TaskDetails[]>([]);
  protected readonly isLoading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly updatingTaskIds = signal<Set<number>>(new Set());
  protected readonly isAddTaskModalOpen = signal(false);
  protected readonly editingTask = signal<TaskDetails | null>(null);
  protected readonly deletingTask = signal<TaskDetails | null>(null);
  protected readonly categories = signal<Category[]>([]);
  protected readonly isLoadingCategories = signal(true);
  protected readonly categoryError = signal<string | null>(null);
  protected readonly isCategoryFilterOpen = signal(false);
  protected readonly selectedCategoryId = signal<number | null>(null);
  protected readonly visibleTasks = computed(() => {
    const selectedCategoryId = this.selectedCategoryId();

    return selectedCategoryId === null
      ? this.tasks()
      : this.tasks().filter((task) => task.category.id === selectedCategoryId);
  });
  protected readonly selectedCategoryName = computed(() => {
    const selectedCategoryId = this.selectedCategoryId();
    return this.categories().find((category) => category.id === selectedCategoryId)?.name ?? 'All Categories';
  });

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

    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.isLoadingCategories.set(false);
      },
      error: () => {
        this.categoryError.set('Could not load categories.');
        this.isLoadingCategories.set(false);
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

  openAddTaskModal(): void {
    this.isAddTaskModalOpen.set(true);
  }

  closeAddTaskModal(): void {
    this.isAddTaskModalOpen.set(false);
  }

  addTask(result: CreatedTaskResult): void {
    const taskDetails: TaskDetails = {
      ...result.task,
      category: result.category,
    };

    this.tasks.update((tasks) => [...tasks, taskDetails]);
    this.closeAddTaskModal();
  }

  openEditTaskModal(task: TaskDetails): void {
    this.editingTask.set(task);
  }

  closeEditTaskModal(): void {
    this.editingTask.set(null);
  }

  updateTask(updatedTask: TaskDetails): void {
    this.tasks.update((tasks) =>
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    );
    this.closeEditTaskModal();
  }

  openDeleteTaskModal(task: TaskDetails): void {
    this.deletingTask.set(task);
  }

  closeDeleteTaskModal(): void {
    this.deletingTask.set(null);
  }

  removeTask(taskId: number): void {
    this.tasks.update((tasks) => tasks.filter((task) => task.id !== taskId));
    this.closeDeleteTaskModal();
  }

  toggleCategoryFilter(): void {
    if (!this.isLoadingCategories() && !this.categoryError()) {
      this.isCategoryFilterOpen.update((isOpen) => !isOpen);
    }
  }

  selectCategory(categoryId: number | null): void {
    this.selectedCategoryId.set(categoryId);
    this.isCategoryFilterOpen.set(false);
  }

  clearCategoryFilter(): void {
    this.selectCategory(null);
  }

  @HostListener('document:click')
  closeCategoryFilter(): void {
    this.isCategoryFilterOpen.set(false);
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
