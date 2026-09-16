import { Routes } from '@angular/router';

// Load the category list only when the categories section is visited.
export const CATEGORIES_ROUTES: Routes = [
	{
		path: '',
		loadComponent: () =>
			import('./components/category-list/category-list').then(
				(module) => module.CategoryList,
			),
	},
];