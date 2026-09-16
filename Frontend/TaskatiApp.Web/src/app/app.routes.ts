import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'tasks',
		loadChildren: () =>
			import('./features/tasks/tasks.routes').then((module) => module.TASKS_ROUTES),
	},
	{
		path: 'categories',
		loadChildren: () =>
			import('./features/categories/categories.routes').then(
				(module) => module.CATEGORIES_ROUTES,
			),
	},
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'tasks',
	},
	{
		path: '**',
		redirectTo: 'tasks',
	},
];
