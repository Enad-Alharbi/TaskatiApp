import { Routes } from '@angular/router';

export const routes: Routes = [
	// Load each feature's routes only when its section is visited.
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
	// Keep the task area as the default application view.
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'tasks',
	},
	// Send unknown URLs to the default feature.
	{
		path: '**',
		redirectTo: 'tasks',
	},
];
