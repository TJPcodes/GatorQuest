import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Home } from './home/home';
import { Signup } from './signup/signup';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'home', component: Home },
  { path: 'signup', component: Signup},
];
