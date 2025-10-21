import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './login/login';
import { Home } from './home/home';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // default route
  { path: 'login', component: Login },
  { path: 'home', component: Home },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
