// Category returned by the API.
export interface Category {
  id: number;
  name: string;
}

// Payload used to create a category.
export interface CreateCategoryRequest {
  name: string;
}

// Payload used to update a category.
export interface UpdateCategoryRequest {
  name: string;
}