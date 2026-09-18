import { Routes } from '@angular/router';

// Load the task list when the tasks section is visited.
export const TASKS_ROUTES: Routes = [
	{
		path: '',
		loadComponent: () =>
			import('./components/task-list/taks-list').then((module) => module.TaskList),
	},
];