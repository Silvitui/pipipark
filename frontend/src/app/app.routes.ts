import { Routes } from '@angular/router';
import { LoginLayoutComponent } from './components/login-layout/login-layout.component';


export const routes: Routes = [
  { 
    path: 'welcome', 
    loadComponent: () => import('./components/welcome/welcome.component').then(m => m.WelcomeComponent) 
  },
  { 
    path: 'login', 
    component: LoginLayoutComponent,
    children: [
      { 
        path: '', 
        loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent) 
      }
    ]
  },
  { 
    path: 'register', 
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent) 
  },
  { 
    path: 'map', 
    loadComponent: () => import('./components/mapa/mapa.component').then(m => m.MapaComponent) 
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/perfil/perfil.component').then(m => m.PerfilComponent)
  },
  { path: '**', redirectTo: 'welcome' }
];
