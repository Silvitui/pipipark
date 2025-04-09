import { Routes } from '@angular/router';
import { MainLayoutComponent } from './components/layouts/main-layout/main-layout.component';
import { AuthLayoutComponent } from './components/layouts/auth-layout/auth-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'welcome',
        pathMatch: 'full'
      },
      {
        path: 'welcome',
        loadComponent: () =>
          import('./components/welcome/welcome.component').then(
            m => m.WelcomeComponent
          )
      },
      {
        path: 'map',
        loadComponent: () =>
          import('./components/mapa/mapa.component').then(
            m => m.MapaComponent
          )
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./components/perfil/perfil.component').then(
            m => m.PerfilComponent
          )
      }
    ]
  },
  {
    path: 'login',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/login/login.component').then(
            m => m.LoginComponent
          )
      }
    ]
  },
  {
    path: 'register',
    component: AuthLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/register/register.component').then(
            m => m.RegisterComponent
          )
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'welcome'
  }
];
