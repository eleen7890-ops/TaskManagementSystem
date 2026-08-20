import { Routes } from '@angular/router';

import { Tasks } from './tasks/tasks';
import { Dashboard } from './dashboard/dashboard';
import { Users } from './users/users';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: Dashboard },
  { path: 'tasks', component: Tasks },
  { path: 'users', component: Users },
  { path: '**', redirectTo: 'dashboard' }
];