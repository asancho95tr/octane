import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { ManagementComponent } from './views/management/management.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'setup',
    component: ManagementComponent,
  },
  {
    path: '**',
    component: HomeComponent,
  },
];
