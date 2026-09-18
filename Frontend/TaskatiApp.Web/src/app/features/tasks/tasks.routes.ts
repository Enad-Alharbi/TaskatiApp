import { Routes } from '@angular/router';

// Load the task list when the tasks section is visited.
export const TASKS_ROUTES: Routes = [
	{
		path: '',
		loadComponent: () =>
			import('./components/task-list/task-list').then((module) => module.TaskList),
	},
];