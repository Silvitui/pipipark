import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'welcome', loadComponent: () => import('./components/welcome/welcome.component').then(m => m.WelcomeComponent), },
 { path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent), },
    { path: 'register', loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) },
    { path: 'map', loadComponent: () => import('./components/mapa/mapa.component').then(m => m.MapaComponent) },
    { path: '**', redirectTo: 'welcome' }

];
