import { Routes } from '@angular/router';
import { LoginLayoutComponent } from './components/layouts/login-layout/login-layout.component';
import { RegisterLayoutComponent } from './components/layouts/register-layout/register-layout.component';
import { MainLayoutComponent } from './components/layouts/main-layout/main-layout.component';

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
    component: LoginLayoutComponent,
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
    component: RegisterLayoutComponent,
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
